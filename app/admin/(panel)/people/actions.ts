"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaff, siteOrigin } from "@/lib/admin/session";
import { serviceClient } from "@/lib/supabase/admin";

export type LinkState = { error?: string; ok?: string; link?: string } | undefined;

/** Our own link to the confirm route, so links work without extra Supabase redirect settings. */
async function confirmLink(hashedToken: string, type: "invite" | "recovery") {
  return `${await siteOrigin()}/admin/auth/confirm?token_hash=${encodeURIComponent(hashedToken)}&type=${type}&next=/admin/set-password`;
}

async function audit(actor: { id: string; email: string }, action: string, target: string) {
  await serviceClient().from("audit_log").insert({ actor: actor.id, actor_email: actor.email, action, target });
}

/**
 * Adds someone to the team: creates their account and returns an invite link to send them
 * (WhatsApp, email, anything). They choose their own password when they open it.
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
  return { ok: `${fullName} is on the team. Send them this link to choose their password (it works once and expires in 24 hours):`, link: await confirmLink(data.properties.hashed_token, "invite") };
}

/** A fresh password-reset link for a teammate who is locked out, without waiting for email. */
export async function resetLinkFor(_: LinkState, form: FormData): Promise<LinkState> {
  const me = await requireStaff();
  const email = z.email().safeParse(form.get("email"));
  if (!email.success) return { error: "Unknown person." };
  const { data, error } = await serviceClient().auth.admin.generateLink({ type: "recovery", email: email.data });
  if (error) return { error: `Could not create a reset link: ${error.message}` };
  await audit(me, "issued reset link", email.data);
  return { ok: "Send them this link to choose a new password (it works once and expires in an hour):", link: await confirmLink(data.properties.hashed_token, "recovery") };
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
