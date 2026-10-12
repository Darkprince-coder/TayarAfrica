"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteRecord, saveRecord, saveSettings, type SaveResult } from "@/app/admin/(panel)/content/actions";
import { Button } from "@/components/ui/Button";
import { slugify, validate, type Field, type FieldErrors } from "@/lib/admin/fields";
import { Fields } from "./FieldInput";
import styles from "./Editor.module.css";

type Props = {
  fields: Field[];
  initial: Record<string, unknown>;
  /** Editor path (e.g. "tours"), or "settings" for site settings. */
  path: string;
  originalKey: string | null;
  hasStatus: boolean;
  isLive: boolean;
  canDelete: boolean;
  /** Where to go after deleting, and after creating (the new key is appended). */
  backHref: string;
  viewHref?: string;
};

/** The edit form: all fields, then Publish / Save as draft / Delete, with a message line. */
export function RecordEditor({ fields, initial, path, originalKey, hasStatus, isLive, canDelete, backHref, viewHref }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  // New records: the web address follows the title until someone edits the address by hand.
  // Existing records keep theirs, because changing a live address breaks saved links.
  const followsTitle = !originalKey && fields.some((f) => f.kind === "slug");
  const [slugTouched, setSlugTouched] = useState(false);
  const [pending, start] = useTransition();

  const handle = (res: SaveResult) => {
    if (res.ok) {
      setErrors({});
      setDirty(false);
      setMessage({ ok: true, text: res.message });
      if (path !== "settings" && res.key !== originalKey) router.replace(`${backHref}/${encodeURIComponent(res.key)}`);
      else router.refresh();
    } else {
      setErrors(res.fieldErrors ?? {});
      setMessage({ ok: false, text: res.error });
      // Bring the first problem into view.
      requestAnimationFrame(() => document.querySelector("[aria-invalid='true']")?.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
  };

  const save = (mode: "publish" | "draft" | "keep") => {
    // Same checks as the server, run here first so mistakes show instantly. The server checks again.
    const local = validate(fields, value).errors;
    if (Object.keys(local).length) return handle({ ok: false, error: "Please fix the highlighted fields.", fieldErrors: local });
    setMessage({ ok: true, text: "Saving…" });
    start(async () => handle(path === "settings" ? await saveSettings(value) : await saveRecord(path, originalKey, value, mode)));
  };

  const remove = () => {
    if (!originalKey || !window.confirm("Delete this for good? It disappears from the website straight away.")) return;
    start(async () => {
      const res = await deleteRecord(path, originalKey);
      if (res.ok) router.replace(backHref);
      else setMessage({ ok: false, text: res.error });
    });
  };

  return (
    <div className={styles.editor}>
      <Fields
        fields={fields}
        value={value}
        onChange={(v) => {
          let next = v;
          if (followsTitle) {
            const title = v.title ?? v.name;
            if (v.slug !== value.slug) setSlugTouched(true);
            else if (!slugTouched && title !== (value.title ?? value.name)) next = { ...v, slug: slugify(String(title ?? "")) };
          }
          setValue(next);
          setDirty(true);
        }}
        errors={errors}
      />

      <div className={styles.bar}>
        <div className={styles.barInner}>
          <span className={styles.state}>
            {hasStatus && originalKey && (isLive ? "Live on the website" : "Draft, not on the website")}
            {dirty && " · unsaved changes"}
          </span>
          {message && (
            <span className={message.ok ? styles.okMsg : styles.err} role={message.ok ? "status" : "alert"}>
              {message.text}
            </span>
          )}
          <span className={styles.actions}>
            {viewHref && isLive && (
              <a href={viewHref} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                View on site
              </a>
            )}
            {canDelete && originalKey && (
              <Button type="button" variant="ghost" onClick={remove} disabled={pending}>
                Delete
              </Button>
            )}
            {hasStatus ? (
              <>
                <Button type="button" variant="secondary" onClick={() => save("draft")} disabled={pending}>
                  {isLive ? "Unpublish (save as draft)" : "Save draft"}
                </Button>
                <Button type="button" onClick={() => save("publish")} disabled={pending}>
                  {pending ? "Saving…" : isLive ? "Save" : "Publish"}
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => save("keep")} disabled={pending}>
                {pending ? "Saving…" : "Save"}
              </Button>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
