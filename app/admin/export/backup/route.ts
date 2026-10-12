import { audit } from "@/lib/admin/audit";
import { nairobiDate } from "@/lib/admin/export";
import { requireStaff } from "@/lib/admin/session";
import { sessionClient } from "@/lib/supabase/server";

/** Everything the website and the team keep in the database, one table per key. */
const TABLES = [
  "site_settings",
  "tours",
  "destinations",
  "team_members",
  "services",
  "gallery_images",
  "testimonials",
  "hero_slides",
  "legal_pages",
  "inquiries",
  "staff",
  "audit_log",
] as const;

/**
 * A full backup as one JSON file: all content (drafts included), settings, booking requests, the
 * team list and the change log. Photos stay on Cloudinary and are referenced by address.
 * Passwords and two-step secrets are not in these tables and never leave Supabase.
 */
export async function GET() {
  const me = await requireStaff();
  const supabase = await sessionClient();
  const results = await Promise.all(TABLES.map((t) => supabase.from(t).select("*")));
  const failed = results.findIndex((r) => r.error);
  if (failed >= 0) return new Response(`Could not read ${TABLES[failed]}: ${results[failed].error?.message}`, { status: 500 });

  const tables = Object.fromEntries(TABLES.map((t, i) => [t, results[i].data]));
  const backup = {
    about: "Tayari admin backup. One key per database table (supabase/migrations). Photos are on Cloudinary; their addresses are in the data.",
    createdAt: new Date().toISOString(),
    createdBy: me.email,
    counts: Object.fromEntries(TABLES.map((t, i) => [t, results[i].data?.length ?? 0])),
    tables,
  };
  await audit(me, "downloaded a full backup", `${backup.counts.inquiries} requests, ${backup.counts.tours} tours, ${backup.counts.destinations} destinations`);
  return new Response(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="tayari-backup-${nairobiDate()}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}
