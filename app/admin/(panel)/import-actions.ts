"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { FormState } from "@/app/admin/auth-actions";
import { destinations } from "@/data/demo/destinations";
import { gallery } from "@/data/demo/gallery";
import { legalPages } from "@/data/demo/legal";
import { packages } from "@/data/demo/packages";
import { heroSlides, services, siteSettings, team, testimonials } from "@/data/demo/people-and-site";
import { COLLECTIONS, toRow } from "@/lib/content/collections";
import { requireStaff } from "@/lib/admin/session";
import { CONTENT_TAG } from "@/lib/supabase/public";
import { sessionClient } from "@/lib/supabase/server";

/**
 * One-time copy of the current website content (data/demo) into Supabase, so the site looks the
 * same on day one and the team edits from there. Refuses to run once site settings exist, so it
 * can never overwrite the team's edits.
 */
export async function importStarterContent(): Promise<FormState> {
  const me = await requireStaff();
  const supabase = await sessionClient();

  const { data: existing } = await supabase.from("site_settings").select("id").eq("id", 1).maybeSingle();
  if (existing) return { error: "The content has already been imported. Edit it from the admin instead." };

  const batches = [
    [COLLECTIONS.destinations, destinations],
    [COLLECTIONS.tours, packages],
    [COLLECTIONS.team, team],
    [COLLECTIONS.services, services],
    [COLLECTIONS.gallery, gallery],
    [COLLECTIONS.testimonials, testimonials],
    [COLLECTIONS.heroSlides, heroSlides],
    [COLLECTIONS.legal, legalPages],
  ] as const;

  for (const [spec, items] of batches) {
    const rows = (items as readonly object[]).map((item) => ({ ...toRow(spec as never, item), updated_by: me.id }));
    const { error } = await supabase.from(spec.table).upsert(rows, { onConflict: "slug" });
    if (error) return { error: `Importing ${spec.table} failed: ${error.message}` };
  }

  // Settings last: their presence switches the website over to the database.
  const { error } = await supabase.from("site_settings").insert({ id: 1, data: siteSettings, updated_by: me.id });
  if (error) return { error: `Importing settings failed: ${error.message}` };

  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  return { ok: "Done. The website now reads its content from the database." };
}
