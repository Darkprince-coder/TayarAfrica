import type { Metadata } from "next";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getImageManifest, imageSpecs } from "@/lib/content/image-manifest";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Image checklist",
  robots: { index: false, follow: false },
};

// Re-check the filesystem on every request so the list updates as you drop images in.
export const dynamic = "force-dynamic";

const PUBLIC = path.join(process.cwd(), "public");

function listImages(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listImages(path.join(dir, e.name)) : /\.(jpe?g|png|webp|avif)$/i.test(e.name) ? [path.join(dir, e.name)] : [],
  );
}

async function pixelSize(file: string): Promise<{ width: number; height: number } | null> {
  try {
    const m = await sharp(file).metadata();
    return m.width && m.height ? { width: m.width, height: m.height } : null;
  } catch {
    return null;
  }
}

export default async function ImageChecklistPage() {
  const manifest = await getImageManifest();
  const rows = await Promise.all(
    manifest.map(async (m) => {
      // Uploads from the admin live on Cloudinary: present by definition, size not checked here.
      const remote = /^https?:///.test(m.src);
      const file = remote ? "" : path.join(PUBLIC, m.src);
      const present = remote || existsSync(file);
      const size = present && !remote ? await pixelSize(file) : null;
      const min = imageSpecs[m.role].minWidth;
      const tooSmall = Boolean(size && size.width < min);
      return { ...m, present, size, min, tooSmall };
    }),
  );

  const expected = new Set(manifest.map((m) => path.normalize(path.join(PUBLIC, m.src))));
  const strays = listImages(path.join(PUBLIC, "images")).filter((f) => !expected.has(path.normalize(f)));

  const added = rows.filter((r) => r.present).length;
  const small = rows.filter((r) => r.tooSmall).length;

  return (
    <main id="main" className={styles.page}>
      <h1 className={styles.title}>Image checklist</h1>
      <p className={styles.summary}>
        <strong>
          {added} / {rows.length}
        </strong>{" "}
        images in place
        {small > 0 && (
          <>
            , <strong className={styles.warn}>{small} too small</strong>
          </>
        )}
        . Drop files into <code>public/images/</code> using exactly these paths. Missing images show a branded placeholder, so nothing breaks
        while you add them.
      </p>
      <p className={styles.summary}>
        <strong>Why size matters:</strong> a photo is stretched to fill its frame. A full-screen hero on a 1920px monitor needs a photo at least
        1920px wide; a 700px thumbnail is enlarged almost three times and looks soft. Download the largest version offered (Unsplash or Pexels:
        &quot;Download&quot; then &quot;Large&quot; or &quot;Original&quot;). Do not use screenshots or images saved from social media.
      </p>

      {strays.length > 0 && (
        <div className={styles.stray}>
          <strong>Files the site does not use yet</strong> (wrong folder or name):
          <ul role="list">
            {strays.map((f) => (
              <li key={f}>
                <code>{path.relative(PUBLIC, f).replaceAll("\\", "/")}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Status</th>
              <th scope="col">Path (rename your file to this)</th>
              <th scope="col">Your file</th>
              <th scope="col">Recommended</th>
              <th scope="col">Used by</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.src}>
                <td>
                  {!r.present ? (
                    <span className={styles.missing}>Missing</span>
                  ) : r.tooSmall ? (
                    <span className={styles.warn}>Too small</span>
                  ) : (
                    <span className={styles.ok}>✓ Good</span>
                  )}
                </td>
                <td>
                  <code>public{r.src}</code>
                </td>
                <td>
                  {r.size ? (
                    <>
                      {r.size.width} × {r.size.height} px
                      {r.tooSmall && (
                        <>
                          <br />
                          <small className={styles.warn}>needs at least {r.min}px wide</small>
                        </>
                      )}
                    </>
                  ) : (
                    "-"
                  )}
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
