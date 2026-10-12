"use server";

import { redirect } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/admin/audit";
import { requireStaff, siteOrigin } from "@/lib/admin/session";
import { appFactor, cleanCode, passwordMatches } from "@/lib/admin/two-step";
import { sessionClient } from "@/lib/supabase/server";

export type FormState = { error?: string; ok?: string } | undefined;

const email = z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email address."));
/** Long enough to resist guessing; no forced symbols, which mostly produce weaker, reused passwords. */
const password = z.string().min(10, "Use at least 10 characters.").max(128, "That password is too long.");

/** Only ever redirect inside the admin after signing in. */
const safeNext = (value: FormDataEntryValue | null) => {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/admin") && !v.startsWith("//") ? v : "/admin";
};

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  const parsed = z.object({ email, password: z.string().min(1, "Please enter your password.") }).safeParse({
    email: form.get("email"),
    password: form.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await sessionClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  // Same message whatever went wrong, so the form does not reveal which emails have accounts.
  if (error) return { error: "That email and password do not match. Try again, or reset your password." };
  const next = safeNext(form.get("next"));
  // Two-step login on: the code from their app comes next.
  if (appFactor(data.user)) redirect(`/admin/verify?next=${encodeURIComponent(next)}`);
  redirect(next);
}

export async function requestReset(_: FormState, form: FormData): Promise<FormState> {
  const parsed = email.safeParse(form.get("email"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await sessionClient();
  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${await siteOrigin()}/admin/auth/confirm`,
  });
  // Always the same answer, whether or not the email has an account.
  return { ok: "If that email belongs to a team account, a reset link is on its way. It works once and expires after an hour." };
}

const LINK_TYPES: EmailOtpType[] = ["invite", "recovery", "email", "magiclink"];

/**
 * "Continue" on an invite or reset link (/admin/auth/confirm). Only this uses up the one-time link,
 * never just opening the page. Invite and reset links then go to choosing a password.
 */
export async function continueFromLink(_: FormState, form: FormData): Promise<FormState> {
  const tokenHash = form.get("token_hash");
  const type = form.get("type") as EmailOtpType | null;
  const code = form.get("code");
  const supabase = await sessionClient();
  let ok = false;
  if (typeof tokenHash === "string" && type && LINK_TYPES.includes(type)) {
    ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  } else if (typeof code === "string" && code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  }
  if (!ok) {
    return {
      error: "This link has already been used, has expired, or a newer one was made since (only the newest link works). Ask a teammate for a new link on the People page, or use “Forgot your password?”.",
    };
  }
  const next = form.get("next");
  redirect(typeof next === "string" && next ? safeNext(next) : "/admin/set-password");
}

/** After an invite or reset link: the person is signed in and chooses their password. */
export async function setPassword(_: FormState, form: FormData): Promise<FormState> {
  const parsed = z
    .object({ password, confirm: z.string() })
    .refine((v) => v.password === v.confirm, { message: "The two passwords do not match.", path: ["confirm"] })
    .safeParse({ password: form.get("password"), confirm: form.get("confirm") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await sessionClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { error: "This link has expired. Ask a teammate for a new one, or use Forgot password." };
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };
  redirect("/admin");
}

/** From the account page: confirm the current password before changing it. */
export async function changePassword(_: FormState, form: FormData): Promise<FormState> {
  const me = await requireStaff();
  const parsed = z
    .object({ current: z.string().min(1, "Please enter your current password."), password, confirm: z.string() })
    .refine((v) => v.password === v.confirm, { message: "The two new passwords do not match.", path: ["confirm"] })
    .safeParse({ current: form.get("current"), password: form.get("password"), confirm: form.get("confirm") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  if (!(await passwordMatches(me.email, parsed.data.current))) return { error: "Your current password is not right." };
  const supabase = await sessionClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };
  return { ok: "Password changed." };
}

export async function updateName(_: FormState, form: FormData): Promise<FormState> {
  const me = await requireStaff();
  const name = z.string().trim().min(2, "Please enter your name.").max(80).safeParse(form.get("fullName"));
  if (!name.success) return { error: name.error.issues[0].message };
  const supabase = await sessionClient();
  const { error } = await supabase.from("staff").update({ full_name: name.data }).eq("id", me.id);
  if (error) return { error: error.message };
  return { ok: "Saved." };
}

export async function signOut() {
  const supabase = await sessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ─── Two-step login ───────────────────────────────────────────────────────────

const WRONG_CODE = "That code did not work. Use the newest code in the app (they change every 30 seconds) and check that your phone's clock is set automatically.";

/** After the password: the six-digit code from their authenticator app. */
export async function verifyCode(_: FormState, form: FormData): Promise<FormState> {
  const code = cleanCode(form.get("code"));
  if (!code) return { error: "Enter the six-digit code from your authenticator app." };
  const supabase = await sessionClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");
  const factor = appFactor(data.user);
  if (factor) {
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code });
    if (error) return { error: WRONG_CODE };
  }
  redirect(safeNext(form.get("next")));
}

export type TwoStepSetup = { error: string } | { factorId: string; qr: string; secret: string };

/** Step 1 of turning it on: a new app link to scan. Nothing changes until the first code is confirmed. */
export async function startTwoStep(): Promise<TwoStepSetup> {
  const me = await requireStaff();
  if (me.twoStep) return { error: "Two-step login is already on." };
  const supabase = await sessionClient();
  // Clear any half-finished earlier attempt, so the new one can take its name.
  const { data } = await supabase.auth.getUser();
  for (const f of data.user?.factors ?? []) {
    if (f.factor_type === "totp" && f.status !== "verified") await supabase.auth.mfa.unenroll({ factorId: f.id });
  }
  const { data: enrolled, error } = await supabase.auth.mfa.enroll({ factorType: "totp", issuer: "Tayari admin", friendlyName: "Authenticator app" });
  if (error || !enrolled) return { error: `Could not start: ${error?.message ?? "unknown error"}` };
  return { factorId: enrolled.id, qr: enrolled.totp.qr_code, secret: enrolled.totp.secret };
}

/** Step 2: the first code from the app proves it is set up; from now on sign-in asks for a code. */
export async function confirmTwoStep(factorId: string, rawCode: string): Promise<FormState> {
  const me = await requireStaff();
  const code = cleanCode(rawCode);
  if (!code) return { error: "Enter the six-digit code the app shows for Tayari admin." };
  const supabase = await sessionClient();
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
  if (error) return { error: WRONG_CODE };
  await audit(me, "turned on two-step login", me.email);
  revalidatePath("/admin/account");
  return { ok: "Two-step login is on. Next time you sign in, have your phone ready." };
}

/** Turning it off asks for a current code, so an unattended open laptop is not enough. */
export async function turnOffTwoStep(_: FormState, form: FormData): Promise<FormState> {
  const me = await requireStaff();
  const code = cleanCode(form.get("code"));
  if (!code) return { error: "Enter the six-digit code from your authenticator app." };
  const supabase = await sessionClient();
  const { data } = await supabase.auth.getUser();
  const factor = data.user && appFactor(data.user);
  if (!factor) return { ok: "Two-step login is already off." };
  const check = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code });
  if (check.error) return { error: WRONG_CODE };
  const { error } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
  if (error) return { error: `Could not turn it off: ${error.message}` };
  await audit(me, "turned off two-step login", me.email);
  revalidatePath("/admin/account");
  return { ok: "Two-step login is off. You can remove Tayari admin from the app." };
}
