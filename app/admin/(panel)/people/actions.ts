"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { audit } from "@/lib/admin/audit";
import { requireStaff, siteOrigin } from "@/lib/admin/session";
import { emailLayout, escapeHtml, sendEmail } from "@/lib/email";
import { serviceClient } from "@/lib/supabase/admin";

export type LinkState = { error?: string; ok?: string; link?: string } | undefined;

/** Our own link to the confirm route, so links work without extra Supabase redirect settings. */
async function confirmLink(hashedToken: string, type: "invite" | "recovery") {
  return `${await siteOrigin()}/admin/auth/confirm?token_hash=${encodeURIComponent(hashedToken)}&type=${type}&next=/admin/set-password`;
}

/** Emails a sign-in link to a teammate. Returns whether it went out (false when email is not set up). */
async function emailLink(to: string, kind: "invite" | "recovery", link: string, name?: string) {
  const invite = kind === "invite";
  const hello = name ? `Hello ${name.split(/\s+/)[0]},` : "Hello,";
  const intro = invite
    ? "You have been added to the Tayari Africa Tours website team. Open the link below to choose your password. It works once and expires in 24 hours."
    : "Open the link below to choose a new password for the Tayari admin. It works once and expires in an hour.";
  const label = invite ? "Choose my password" : "Choose a new password";
  const footnote = "If you did not expect this email, you can ignore it.";
  return sendEmail({
    to: [to],
    subject: invite ? "Your invitation to the Tayari admin" : "Reset your Tayari admin password",
    text: [hello, "", intro, "", link, "", footnote].join("\n"),
    html: emailLayout({ heading: invite ? "Welcome to the team" : "Choose a new password", body: `<p style="margin:0 0 10px">${escapeHtml(hello)}</p><p style="margin:0">${escapeHtml(intro)}</p>`, button: { label, href: link }, footnote }),
  });
}

/**
 * Adds someone to the team: creates their account, emails them an invite link (when email is set up)
 * and returns the link to send another way too (WhatsApp). They choose their own password when they open it.
 */
export async function inviteMember(_: LinkState, form: FormData): Promise<LinkState> {
  const me = await requireStaff();
  const parsed = z
    .object({ fullName: z.string().trim().min(2, "Please enter their name.").max(80), email: z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email address.")) })
    .safeParse({ fullName: form.get("fullName"), email: form.get("email") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { fullName, email } = parsed.data;

  const db = serviceClient();
  const { data, error } = await db.auth.admin.generateLink({ type: "invite", email, options: { data: { full_name: fullName } } });
  if (error || !data.user) {
    return { error: /registered|exists/i.test(error?.message ?? "") ? "That email already has an account. Use “Reset link” next to their name instead." : `Could not create the invite: ${error?.message}` };
  }
  const { error: staffError } = await db.from("staff").upsert({ id: data.user.id, email, full_name: fullName, invited_by: me.id });
  if (staffError) return { error: `Account created, but adding them to the team failed: ${staffError.message}` };

  await audit(me, "invited", email);
  revalidatePath("/admin/people");
  const link = await confirmLink(data.properties.hashed_token, "invite");
  const emailed = await emailLink(email, "invite", link, fullName);
  return {
    ok: emailed
      ? `${fullName} is on the team. We emailed them a link to choose their password. You can also send this link yourself (it works once and expires in 24 hours):`
      : `${fullName} is on the team. Send them this link to choose their password (it works once and expires in 24 hours):`,
    link,
  };
}

/** A fresh password-reset link for a teammate who is locked out: emailed to them when email is set up, and shown to copy. */
export async function resetLinkFor(_: LinkState, form: FormData): Promise<LinkState> {
  const me = await requireStaff();
  const email = z.email().safeParse(form.get("email"));
  if (!email.success) return { error: "Unknown person." };
  const { data, error } = await serviceClient().auth.admin.generateLink({ type: "recovery", email: email.data });
  if (error) return { error: `Could not create a reset link: ${error.message}` };
  await audit(me, "issued reset link", email.data);
  const link = await confirmLink(data.properties.hashed_token, "recovery");
  const emailed = await emailLink(email.data, "recovery", link);
  return {
    ok: emailed
      ? "We emailed them a link to choose a new password. You can also send this link yourself (it works once and expires in an hour):"
      : "Send them this link to choose a new password (it works once and expires in an hour):",
    link,
  };
}

/** Removes someone's access. The last account on the team can never be removed. */
export async function removeMember(_: LinkState, form: FormData): Promise<LinkState> {
  const me = await requireStaff();
  const id = z.uuid().safeParse(form.get("id"));
  if (!id.success) return { error: "Unknown person." };

  const db = serviceClient();
  const { count } = await db.from("staff").select("id", { count: "exact", head: true });
  if ((count ?? 0) <= 1) return { error: "This is the only account left, so it cannot be removed." };

  const { data: target } = await db.from("staff").select("email").eq("id", id.data).maybeSingle();
  const { error } = await db.auth.admin.deleteUser(id.data);
  if (error) return { error: `Could not remove them: ${error.message}` };
  await audit(me, "removed", target?.email ?? id.data);
  revalidatePath("/admin/people");
  return { ok: `${target?.email ?? "They"} no longer have access.` };
}

/**
 * For a teammate who lost or replaced their phone: turns their two-step login off so they can sign
 * in with their password alone, then set it up again on the new phone. Logged.
 */
export async function resetTwoStepFor(_: LinkState, form: FormData): Promise<LinkState> {
  const me = await requireStaff();
  const id = z.uuid().safeParse(form.get("id"));
  if (!id.success) return { error: "Unknown person." };

  const db = serviceClient();
  const { data: target } = await db.from("staff").select("email, full_name").eq("id", id.data).maybeSingle();
  if (!target) return { error: "That person is not on the team." };
  const { data, error } = await db.auth.admin.mfa.listFactors({ userId: id.data });
  if (error) return { error: `Could not check their sign-in: ${error.message}` };
  for (const f of data.factors.filter((f) => f.factor_type === "totp")) {
    const { error: delError } = await db.auth.admin.mfa.deleteFactor({ id: f.id, userId: id.data });
    if (delError) return { error: `Could not reset it: ${delError.message}` };
  }
  await audit(me, "reset two-step login for", target.email);
  revalidatePath("/admin/people");
  return { ok: `Done. ${target.full_name || target.email} can now sign in with their password alone, then turn two-step login on again in My account.` };
}
