import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm } from "@/components/admin/ActionForm";
import { PageHead } from "@/components/admin/Shell";
import styles from "@/components/admin/Shell.module.css";
import { requireStaff } from "@/lib/admin/session";
import { sessionClient } from "@/lib/supabase/server";
import { importStarterContent } from "./import-actions";

export const metadata: Metadata = { title: "Overview" };

/**
 * The "Keep an offline copy" box (requests spreadsheet + full backup) is hidden for now, while the
 * client decides on a paid Supabase plan (which has its own backups). Set to true to show it again.
 * The requests spreadsheet stays available on the Booking requests page either way.
 */
const SHOW_OFFLINE_COPY = false;

export default async function OverviewPage() {
  const me = await requireStaff();
  const supabase = await sessionClient();
  const count = async (table: string, filter?: [string, string]) => {
    let q = supabase.from(table).select("id", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    return (await q).count ?? 0;
  };
  const [settings, fresh, open, tours, destinations, people] = await Promise.all([
    supabase.from("site_settings").select("id").eq("id", 1).maybeSingle(),
    count("inquiries", ["status", "new"]),
    count("inquiries", ["status", "in_progress"]),
    count("tours"),
    count("destinations"),
    count("staff"),
  ]);
  const imported = Boolean(settings.data);

  return (
    <>
      <PageHead title={`Hello${me.fullName ? `, ${me.fullName.split(" ")[0]}` : ""}`} lead="What is waiting, and where to find things." />

      {!imported && (
        <section className={styles.card} aria-labelledby="import-title">
          <h2 id="import-title" className={styles.cardTitle}>
            First step: bring the website content in
          </h2>
          <p className={styles.muted}>
            The website is still showing its built-in content. This copies all of it (tours, destinations, team, gallery, page photos,
            contact details and legal pages) into the database so the team can edit it here. It only runs once.
          </p>
          <ActionForm action={importStarterContent} submitLabel="Import the website content" pendingLabel="Importing…" variant="secondary">
            {null}
          </ActionForm>
        </section>
      )}

      <div className={styles.stats}>
        <Link href="/admin/inbox?status=new" className={styles.stat}>
          <span className={styles.statValue}>{fresh}</span>
          <span className={styles.statLabel}>New booking requests</span>
        </Link>
        <Link href="/admin/inbox?status=in_progress" className={styles.stat}>
          <span className={styles.statValue}>{open}</span>
          <span className={styles.statLabel}>In progress</span>
        </Link>
        <div className={styles.stat}>
          <span className={styles.statValue}>{imported ? tours : "–"}</span>
          <span className={styles.statLabel}>Tours</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{imported ? destinations : "–"}</span>
          <span className={styles.statLabel}>Destinations</span>
        </div>
        <Link href="/admin/people" className={styles.stat}>
          <span className={styles.statValue}>{people}</span>
          <span className={styles.statLabel}>People with access</span>
        </Link>
      </div>

      {SHOW_OFFLINE_COPY && (
        <section className={styles.card} aria-labelledby="backup-title">
          <h2 id="backup-title" className={styles.cardTitle}>
            Keep an offline copy
          </h2>
          <p className={styles.muted}>
            The free database plan keeps no backups, so save a copy now and then (once a week is a good habit) somewhere safe, such as
            the company Google Drive. The files hold travellers&rsquo; contact details: keep them private. Each download is noted in the
            change log.
          </p>
          <div className={styles.row}>
            <a href="/admin/export/requests" className={styles.filter} download>
              Booking requests (spreadsheet)
            </a>
            <a href="/admin/export/backup" className={styles.filter} download>
              Full backup of everything (for a developer)
            </a>
          </div>
        </section>
      )}
    </>
  );
}
