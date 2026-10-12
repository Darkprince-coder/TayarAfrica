"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { LinkState } from "@/app/admin/(panel)/people/actions";
import type { FormState } from "@/app/admin/auth-actions";
import { audit } from "@/lib/admin/audit";
import { INQUIRY_STATUSES, STATUS_LABEL } from "@/lib/admin/inquiries";
import { requireStaff } from "@/lib/admin/session";
import { serviceClient } from "@/lib/supabase/admin";
import { sessionClient } from "@/lib/supabase/server";

/** One tap moves a request along: new → in progress → quote sent → booked / closed. */
export async function setInquiryStatus(form: FormData): Promise<void> {
  const me = await requireStaff();
  const parsed = z.object({ id: z.uuid(), status: z.enum(INQUIRY_STATUSES) }).safeParse({ id: form.get("id"), status: form.get("status") });
  if (!parsed.success) return;
  const supabase = await sessionClient();
  await supabase
    .from("inquiries")
    .update({ status: parsed.data.status, updated_at: new Date().toISOString(), updated_by: me.id })
    .eq("id", parsed.data.id);
  revalidatePath("/admin", "layout");
}

/** Team notes on a request (never shown to the traveller). */
export async function saveInquiryNotes(_: FormState, form: FormData): Promise<FormState> {
  const me = await requireStaff();
  const parsed = z.object({ id: z.uuid(), notes: z.string().max(5000, "Notes are too long.") }).safeParse({ id: form.get("id"), notes: form.get("notes") ?? "" });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await sessionClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ notes: parsed.data.notes, updated_at: new Date().toISOString(), updated_by: me.id })
    .eq("id", parsed.data.id);
  if (error) return { error: error.message };
  revalidatePath("/admin", "layout");
  return { ok: "Notes saved." };
}

/**
 * Deletes a request for good (spam, tests, duplicates). Goes through the server key so the team's
 * own database access stays read-and-update only, and every deletion is logged.
 */
export async function deleteInquiry(_: LinkState, form: FormData): Promise<LinkState> {
  const me = await requireStaff();
  const id = z.uuid().safeParse(form.get("id"));
  if (!id.success) return { error: "Unknown request." };
  const db = serviceClient();
  const { data: row } = await db.from("inquiries").select("reference, status, payload->>fullName").eq("id", id.data).maybeSingle();
  if (!row) return { error: "This request was already deleted." };
  const { error } = await db.from("inquiries").delete().eq("id", id.data);
  if (error) return { error: `Could not delete it: ${error.message}` };
  await audit(me, "deleted request", `${row.reference} (${row.fullName ?? "no name"}, ${STATUS_LABEL[row.status] ?? row.status})`);
  revalidatePath("/admin", "layout");
  redirect(`/admin/inbox?deleted=${encodeURIComponent(row.reference)}`);
}
