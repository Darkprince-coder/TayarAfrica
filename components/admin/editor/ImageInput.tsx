"use client";

/* eslint-disable @next/next/no-img-element -- previews of uploads and local files, not page content */
import { useRef, useState } from "react";
import { signUpload } from "@/app/admin/(panel)/content/actions";
import styles from "./Editor.module.css";

export type ImageValue = { src: string; alt: string; focus?: string; focusMobile?: string };

const MAX_MB = 20;

/**
 * Pick a photo: upload to Cloudinary (signed on the server), describe it, and click where the
 * subject is so crops keep it in frame. Separate focus points for wide screens and phones.
 */
export function ImageInput({ value, onChange, error, altError }: { value: ImageValue | null | undefined; onChange: (v: ImageValue | null) => void; error?: string; altError?: string }) {
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const [target, setTarget] = useState<"focus" | "focusMobile">("focus");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setProblem("");
    if (!file.type.startsWith("image/")) return setProblem("Please choose an image file (JPG, PNG or WebP).");
    if (file.size > MAX_MB * 1024 * 1024) return setProblem(`That file is over ${MAX_MB} MB. Export a smaller JPG first.`);
    setBusy(true);
    try {
      const sig = await signUpload();
      if (!sig.ok) throw new Error(sig.error);
      const body = new FormData();
      body.append("file", file);
      body.append("api_key", sig.apiKey);
      body.append("timestamp", String(sig.timestamp));
      body.append("folder", sig.folder);
      body.append("signature", sig.signature);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? "Upload failed.");
      if (json.width && json.width < 1200) setProblem(`Uploaded, but it is only ${json.width} px wide, so it may look soft on large screens.`);
      onChange({ src: json.secure_url as string, alt: value?.alt ?? "", focus: "50% 50%", focusMobile: "50% 50%" });
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "Upload failed. Try again.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const setFocus = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!value) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * 100);
    const y = Math.round(((e.clientY - r.top) / r.height) * 100);
    onChange({ ...value, [target]: `${Math.min(100, Math.max(0, x))}% ${Math.min(100, Math.max(0, y))}%` });
  };
  const point = (v?: string) => (v ?? "50% 50%").split(" ");

  return (
    <div className={styles.image}>
      {value?.src ? (
        <>
          <div className={styles.imageRow}>
            <button type="button" className={styles.focusPick} onClick={setFocus} aria-label="Click where the main subject is">
              <img src={value.src} alt="" />
              {(["focus", "focusMobile"] as const).map((k) => {
                const [x, y] = point(value[k]);
                return <span key={k} className={styles.dot} data-active={k === target} style={{ left: x, top: y }} aria-hidden="true" />;
              })}
            </button>
            <div className={styles.crops} aria-hidden="true">
              <span className={styles.cropLabel}>Wide screens</span>
              <img src={value.src} alt="" className={styles.cropWide} style={{ objectPosition: value.focus ?? "50% 50%" }} />
              <span className={styles.cropLabel}>Phones</span>
              <img src={value.src} alt="" className={styles.cropTall} style={{ objectPosition: value.focusMobile ?? value.focus ?? "50% 50%" }} />
            </div>
          </div>
          <div className={styles.inline}>
            <span className={styles.small}>Click the photo where the subject is, for:</span>
            <label className={styles.radio}>
              <input type="radio" checked={target === "focus"} onChange={() => setTarget("focus")} /> wide screens
            </label>
            <label className={styles.radio}>
              <input type="radio" checked={target === "focusMobile"} onChange={() => setTarget("focusMobile")} /> phones
            </label>
          </div>
          <label className={styles.field}>
            <span className={styles.label}>Describe the photo *</span>
            <input className={styles.input} value={value.alt} onChange={(e) => onChange({ ...value, alt: e.target.value })} placeholder="e.g. Elephants walking to a waterhole at dusk" aria-invalid={Boolean(altError) || undefined} />
            <span className={styles.small}>Read aloud to people who cannot see it, and used by search engines. Say what is in the picture.</span>
            {altError && <span className={styles.err}>{altError}</span>}
          </label>
        </>
      ) : (
        <div className={styles.empty}>No photo yet.</div>
      )}
      <div className={styles.inline}>
        <label className={styles.upload} data-busy={busy || undefined}>
          {busy ? "Uploading…" : value?.src ? "Replace photo" : "Upload a photo"}
          <input ref={fileRef} type="file" accept="image/*" disabled={busy} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
        {value?.src && (
          <button type="button" className={styles.linkBtn} onClick={() => onChange(null)}>
            Remove
          </button>
        )}
      </div>
      {(problem || error) && <span className={styles.err}>{problem || error}</span>}
    </div>
  );
}
