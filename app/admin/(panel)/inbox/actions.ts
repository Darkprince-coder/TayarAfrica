"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { FormState } from "@/app/admin/auth-actions";
import { INQUIRY_STATUSES } from "@/lib/admin/inquiries";
import { requireStaff } from "@/lib/admin/session";
import { sessionClient } from "@/lib/supabase/server";

/** Moves a request along (new → in progress → quoted → booked / closed) and keeps team notes. */
export async function updateInquiry(_: FormState, form: FormData): Promise<FormState> {
  const me = await requireStaff();
  const parsed = z
    .object({ id: z.uuid(), status: z.enum(INQUIRY_STATUSES), notes: z.string().max(5000) })
    .safeParse({ id: form.get("id"), status: form.get("status"), notes: form.get("notes") ?? "" });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await sessionClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ status: parsed.data.status, notes: parsed.data.notes, updated_at: new Date().toISOString(), updated_by: me.id })
    .eq("id", parsed.data.id);
  if (error) return { error: error.message };
  revalidatePath("/admin", "layout");
  return { ok: "Saved." };
}
