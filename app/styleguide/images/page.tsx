import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import { getImageManifest, imageSpecs } from "@/lib/content/image-manifest";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Image checklist",
  robots: { index: false, follow: false },
};

// Re-check the filesystem on every request so the list updates as you drop images in.
export const dynamic = "force-dynamic";

export default async function ImageChecklistPage() {
  const manifest = await getImageManifest();
  const rows = manifest.map((m) => ({
    ...m,
    present: existsSync(path.join(process.cwd(), "public", m.src)),
  }));
  const done = rows.filter((r) => r.present).length;

  return (
    <main id="main" className={styles.page}>
      <h1 className={styles.title}>Image checklist</h1>
      <p className={styles.summary}>
        <strong>
          {done} / {rows.length}
        </strong>{" "}
        images in place. Drop files into <code>public/images/</code> using exactly these paths. Missing images show a
        branded placeholder, so nothing breaks while you add them.
      </p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Status</th>
              <th scope="col">Path (rename your file to this)</th>
              <th scope="col">Recommended</th>
              <th scope="col">Used by</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.src}>
                <td>
                  <span className={r.present ? styles.ok : styles.missing}>{r.present ? "✓ Added" : "Missing"}</span>
                </td>
                <td>
                  <code>public{r.src}</code>
                </td>
                <td>
                  {imageSpecs[r.role].size}
                  <br />
                  <small>{imageSpecs[r.role].note}</small>
                </td>
                <td>{r.usedBy.join("; ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
