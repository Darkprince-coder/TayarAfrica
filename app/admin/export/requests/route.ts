import { audit } from "@/lib/admin/audit";
import { nairobiDate, requestsCsv, type InquiryRow } from "@/lib/admin/export";
import { requireStaff } from "@/lib/admin/session";
import { sessionClient } from "@/lib/supabase/server";

/** Every booking request as a spreadsheet (CSV), for an offline copy. Team only, and logged. */
export async function GET() {
  const me = await requireStaff();
  const supabase = await sessionClient();
  const [requests, tours, places] = await Promise.all([
    supabase.from("inquiries").select("reference, kind, status, payload, notes, created_at, updated_at").order("created_at", { ascending: false }),
    supabase.from("tours").select("slug, data->>title"),
    supabase.from("destinations").select("slug, data->>name"),
  ]);
  if (requests.error) return new Response(`Could not read the requests: ${requests.error.message}`, { status: 500 });

  const csv = requestsCsv(requests.data as InquiryRow[], {
    tours: new Map((tours.data ?? []).map((t) => [t.slug, String(t.title ?? t.slug)])),
    places: new Map((places.data ?? []).map((d) => [d.slug, String(d.name ?? d.slug)])),
  });
  await audit(me, "downloaded booking requests", `${requests.data.length} requests (spreadsheet)`);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tayari-requests-${nairobiDate()}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
