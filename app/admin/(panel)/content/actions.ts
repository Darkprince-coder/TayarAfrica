"use server";

import { createHash, randomUUID } from "node:crypto";
import { revalidatePath, updateTag } from "next/cache";
import { editorFor, SETTINGS_FIELDS } from "@/lib/admin/editors";
import { validate, type FieldErrors } from "@/lib/admin/fields";
import { getRecord, withOptions } from "@/lib/admin/records";
import { requireStaff } from "@/lib/admin/session";
import { COLLECTIONS, toRow } from "@/lib/content/collections";
import { CONTENT_TAG } from "@/lib/supabase/public";
import { sessionClient } from "@/lib/supabase/server";

export type SaveResult = { ok: true; key: string; message: string } | { ok: false; error: string; fieldErrors?: FieldErrors };

/** After any content change: refresh the cached public pages straight away. */
function refreshSite() {
  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

/**
 * Saves a record from an editor. `mode` decides visibility: "publish" makes it live, "draft" hides
 * it from the website, "keep" leaves it as it was. Everything is checked again here against the
 * editor's fields; only signed-in team members get this far, and the database rules apply too.
 */
export async function saveRecord(path: string, originalKey: string | null, input: unknown, mode: "publish" | "draft" | "keep"): Promise<SaveResult> {
  const me = await requireStaff();
  const def = editorFor(path);
  if (!def) return { ok: false, error: "Unknown content type." };
  if (!originalKey && !def.canCreate) return { ok: false, error: `New ${def.singular}s cannot be added here.` };

  const { value, errors } = validate(await withOptions(def.fields), input);
  if (Object.keys(errors).length) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: errors };

  const spec = COLLECTIONS[def.collection];
  const existing = originalKey ? await getRecord(def, originalKey) : null;
  if (originalKey && !existing) return { ok: false, error: "This record no longer exists. Someone may have deleted it." };

  let item: Record<string, unknown> = { ...(existing?.item ?? def.blank()), ...value };
  const key = def.keyKind === "slug" ? String(item.slug) : (originalKey ?? randomUUID());
  if (def.keyKind === "id") item.id = key;

  const wasLive = existing ? existing.status === "published" : false;
  const live = mode === "publish" ? true : mode === "draft" ? false : wasLive;
  if (def.collection === "heroSlides") item.active = live;
  else item.status = def.hasStatus ? (live ? "published" : "draft") : "published";
  if (def.finalize) item = def.finalize(item);

  const row = { ...toRow(spec as never, item as never), updated_at: new Date().toISOString(), updated_by: me.id };
  const supabase = await sessionClient();

  if (originalKey && key !== originalKey) {
    const { data: clash } = await supabase.from(spec.table).select("slug").eq("slug", key).maybeSingle();
    if (clash) return { ok: false, error: "That web address is already used.", fieldErrors: { slug: "Already used by another record." } };
    const { error } = await supabase.from(spec.table).update(row).eq("slug", originalKey);
    if (error) return { ok: false, error: error.message };
  } else if (originalKey) {
    const { error } = await supabase.from(spec.table).update(row).eq("slug", originalKey);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from(spec.table).insert(row);
    if (error) return { ok: false, error: /duplicate|unique/i.test(error.message) ? "That web address is already used." : error.message, fieldErrors: /duplicate|unique/i.test(error.message) ? { slug: "Already used." } : undefined };
  }

  refreshSite();
  const label = def.hasStatus ? (live ? "Saved and live on the website." : "Saved as a draft (not on the website).") : "Saved.";
  return { ok: true, key, message: label };
}

export async function deleteRecord(path: string, key: string): Promise<SaveResult> {
  await requireStaff();
  const def = editorFor(path);
  if (!def || !def.canDelete) return { ok: false, error: "This cannot be deleted." };
  const supabase = await sessionClient();
  const { error } = await supabase.from(COLLECTIONS[def.collection].table).delete().eq("slug", key);
  if (error) return { ok: false, error: error.message };
  refreshSite();
  return { ok: true, key, message: "Deleted." };
}

export async function saveSettings(input: unknown): Promise<SaveResult> {
  const me = await requireStaff();
  const { value, errors } = validate(SETTINGS_FIELDS, input);
  if (Object.keys(errors).length) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: errors };

  const supabase = await sessionClient();
  const { data: current } = await supabase.from("site_settings").select("data").eq("id", 1).maybeSingle();
  if (!current) return { ok: false, error: "Settings are missing. Import the website content first (Overview)." };
  const contact = value.contact as Record<string, unknown>;
  contact.whatsapp = String(contact.whatsapp ?? "").replace(/\D/g, "");
  const merged = { ...(current.data as object), ...value };
  const { error } = await supabase.from("site_settings").update({ data: merged, updated_at: new Date().toISOString(), updated_by: me.id }).eq("id", 1);
  if (error) return { ok: false, error: error.message };
  refreshSite();
  return { ok: true, key: "settings", message: "Saved. The website is updated." };
}

/**
 * A short-lived signature so the browser can upload one photo straight to Cloudinary without ever
 * seeing the secret. Uploads land in the tayari/ folder.
 */
export async function signUpload(): Promise<{ ok: true; cloudName: string; apiKey: string; timestamp: number; folder: string; signature: string } | { ok: false; error: string }> {
  await requireStaff();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !secret) return { ok: false, error: "Photo uploads are not set up (Cloudinary keys missing)." };
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "tayari";
  // Cloudinary signs the alphabetically sorted parameters, then the secret, with SHA-1.
  const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest("hex");
  return { ok: true, cloudName, apiKey, timestamp, folder, signature };
}
