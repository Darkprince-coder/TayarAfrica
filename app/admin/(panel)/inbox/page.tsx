import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/admin/Shell";
import styles from "@/components/admin/Shell.module.css";
import { STATUS_LABEL } from "@/lib/admin/inquiries";
import { requireStaff } from "@/lib/admin/session";
import { sessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Booking requests" };

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

type Props = { searchParams: Promise<{ status?: string }> };

export default async function InboxPage({ searchParams }: Props) {
  await requireStaff();
  const { status } = await searchParams;
  const filter = status && STATUS_LABEL[status] ? status : null;

  const supabase = await sessionClient();
  let query = supabase.from("inquiries").select("id, reference, kind, status, payload, created_at").order("created_at", { ascending: false }).limit(200);
  if (filter) query = query.eq("status", filter);
  const { data: rows, error } = await query;

  return (
    <>
      <PageHead title="Booking requests" lead="Trip requests and contact messages from the website, newest first. Open one to update its status and keep notes." />
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
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Received</th>
                <th>From</th>
                <th>Type</th>
                <th>When / what</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const p = r.payload as Record<string, unknown>;
                return (
                  <tr key={r.id}>
                    <td>{when(r.created_at)}</td>
                    <td>
                      <Link href={`/admin/inbox/${r.id}`}>{String(p.fullName ?? "Unknown")}</Link>
                      <div className={styles.muted}>{r.reference}</div>
                    </td>
                    <td>{r.kind === "trip" ? "Trip request" : "Message"}</td>
                    <td className={styles.muted}>
                      {r.kind === "trip" ? [p.startDate, p.travelers && `${p.travelers} travellers`, p.packageSlug || p.destinationSlug].filter(Boolean).join(" · ") : String(p.message ?? "").slice(0, 80)}
                    </td>
                    <td>
                      <span className={styles.pill} data-status={r.status}>
                        {STATUS_LABEL[r.status] ?? r.status}
                      </span>
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
