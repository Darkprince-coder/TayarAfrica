import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/admin/Shell";
import admin from "@/components/admin/Admin.module.css";
import styles from "@/components/admin/Shell.module.css";
import { STATUS_LABEL } from "@/lib/admin/inquiries";
import { requireStaff } from "@/lib/admin/session";
import { sessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Booking requests" };

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nairobi" });

type Props = { searchParams: Promise<{ status?: string; deleted?: string }> };

export default async function InboxPage({ searchParams }: Props) {
  await requireStaff();
  const { status, deleted } = await searchParams;
  const filter = status && STATUS_LABEL[status] ? status : null;

  const supabase = await sessionClient();
  let query = supabase.from("inquiries").select("id, reference, kind, status, payload, created_at").order("created_at", { ascending: false }).limit(200);
  if (filter) query = query.eq("status", filter);
  const [{ data: rows, error }, tours, places] = await Promise.all([
    query,
    supabase.from("tours").select("slug, data->>title"),
    supabase.from("destinations").select("slug, data->>name"),
  ]);
  // Show tours and destinations by name, not by their web address.
  const names = new Map<string, string>([
    ...(tours.data ?? []).map((t) => [t.slug, String(t.title ?? t.slug)] as [string, string]),
    ...(places.data ?? []).map((d) => [d.slug, String(d.name ?? d.slug)] as [string, string]),
  ]);
  const nameOf = (slug: unknown) => (typeof slug === "string" && slug ? (names.get(slug) ?? slug) : "");

  return (
    <>
      <PageHead title="Booking requests" lead="Trip requests and contact messages from the website, newest first. Open one to change its status, keep notes or delete it." />
      {deleted && /^[A-Z]{3}-[A-Z0-9]{6}$/.test(deleted) && (
        <p className={admin.ok} role="status">
          {deleted} was deleted.
        </p>
      )}
      <p className={styles.muted}>
        <a href="/admin/export/requests" download>
          Download all requests as a spreadsheet
        </a>
      </p>
      <nav className={styles.filters} aria-label="Filter by status">
        <Link href="/admin/inbox" className={styles.filter} aria-current={!filter ? "page" : undefined}>
          All
        </Link>
        {Object.entries(STATUS_LABEL).map(([key, label]) => (
          <Link key={key} href={`/admin/inbox?status=${key}`} className={styles.filter} aria-current={filter === key ? "page" : undefined}>
            {label}
          </Link>
        ))}
      </nav>

      {error ? (
        <p className={styles.muted}>Could not load requests: {error.message}</p>
      ) : rows && rows.length > 0 ? (
        <div className={`${styles.card} ${styles.scroll}`}>
          <table className={`${styles.table} ${styles.inbox}`}>
            <thead>
              <tr>
                <th>Received</th>
                <th>From</th>
                <th>Type</th>
                <th>When / what</th>
                <th>Status</th>
                <th>
                  <span className="visually-hidden">Open</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const p = r.payload as Record<string, unknown>;
                return (
                  <tr key={r.id}>
                    <td className={styles.received}>{when(r.created_at)}</td>
                    <td className={styles.from}>
                      <Link href={`/admin/inbox/${r.id}`} className={styles.rowLink}>
                        {String(p.fullName ?? "Unknown")}
                      </Link>
                      <div className={styles.muted}>{r.reference}</div>
                    </td>
                    <td className={styles.kind}>{r.kind === "trip" ? "Trip request" : "Message"}</td>
                    <td className={`${styles.muted} ${styles.what}`}>
                      {r.kind === "trip" ? [p.startDate, p.travelers && `${p.travelers} travellers`, nameOf(p.packageSlug) || nameOf(p.destinationSlug)].filter(Boolean).join(" · ") : String(p.message ?? "").slice(0, 80)}
                    </td>
                    <td className={styles.status}>
                      <span className={styles.pill} data-status={r.status}>
                        {STATUS_LABEL[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className={styles.open}>
                      <Link href={`/admin/inbox/${r.id}`} className={styles.filter} aria-label={`Open ${String(p.fullName ?? "request")} ${r.reference}`}>
                        Open
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={styles.muted}>No requests {filter ? "with this status" : "yet"}.</p>
      )}
    </>
  );
}
