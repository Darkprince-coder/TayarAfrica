"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStaff, siteOrigin } from "@/lib/admin/session";
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
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  // Same message whatever went wrong, so the form does not reveal which emails have accounts.
  if (error) return { error: "That email and password do not match. Try again, or reset your password." };
  redirect(safeNext(form.get("next")));
}

export async function requestReset(_: FormState, form: FormData): Promise<FormState> {
  const parsed = email.safeParse(form.get("email"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await sessionClient();
  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${await siteOrigin()}/admin/auth/confirm?next=/admin/set-password`,
  });
  // Always the same answer, whether or not the email has an account.
  return { ok: "If that email belongs to a team account, a reset link is on its way. It works once and expires after an hour." };
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

  const supabase = await sessionClient();
  const check = await supabase.auth.signInWithPassword({ email: me.email, password: parsed.data.current });
  if (check.error) return { error: "Your current password is not right." };
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
