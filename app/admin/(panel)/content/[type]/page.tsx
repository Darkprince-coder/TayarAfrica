import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/admin/Shell";
import styles from "@/components/admin/Shell.module.css";
import { Button } from "@/components/ui/Button";
import { editorFor } from "@/lib/admin/editors";
import { listRecords } from "@/lib/admin/records";
import { requireStaff } from "@/lib/admin/session";

type Props = { params: Promise<{ type: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: editorFor((await params).type)?.label ?? "Content" };
}

export default async function ContentListPage({ params }: Props) {
  await requireStaff();
  const def = editorFor((await params).type);
  if (!def) notFound();
  const records = await listRecords(def);
  const thumb = (item: Record<string, unknown>) => {
    const img = (item.cover ?? item.image ?? item.portrait) as { src?: string } | undefined;
    return img?.src;
  };

  return (
    <>
      <PageHead title={def.label} lead={def.intro} />
      {def.canCreate && (
        <div>
          <Button href={`/admin/content/${def.path}/new`} arrow>
            Add a {def.singular}
          </Button>
        </div>
      )}
      <div className={`${styles.card} ${styles.scroll}`}>
        <table className={`${styles.table} ${styles.stack}`}>
          <thead>
            <tr>
              <th aria-label="Photo" />
              <th>Name</th>
              <th>Status</th>
              <th>Last changed</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => {
              const src = thumb(r.item);
              return (
                <tr key={r.key}>
                  <td className={styles.thumbCell}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail */}
                    {src && <img src={src} alt="" width={64} height={44} style={{ objectFit: "cover", borderRadius: 4 }} />}
                  </td>
                  <td>
                    <Link href={`/admin/content/${def.path}/${encodeURIComponent(r.key)}`}>{def.titleOf(r.item) || r.key}</Link>
                    {def.subtitleOf && <div className={styles.muted}>{def.subtitleOf(r.item)}</div>}
                  </td>
                  <td>
                    {def.hasStatus ? (
                      <span className={styles.pill} data-status={r.status === "published" ? "booked" : undefined}>
                        {r.status === "published" ? "Live" : "Draft"}
                      </span>
                    ) : (
                      <span className={styles.pill}>{r.item.draft ? "Draft" : "Approved"}</span>
                    )}
                  </td>
                  <td className={styles.muted}>{new Date(r.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Nairobi" })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {records.length === 0 && <p className={styles.muted}>Nothing here yet.</p>}
      </div>
    </>
  );
}
