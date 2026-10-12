import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/ActionForm";
import { LinkForm } from "@/components/admin/LinkForm";
import { PageHead } from "@/components/admin/Shell";
import styles from "@/components/admin/Shell.module.css";
import { TextAreaField } from "@/components/ui/Field";
import { FIELD_LABEL, STATUS_LABEL, show } from "@/lib/admin/inquiries";
import { requireStaff } from "@/lib/admin/session";
import { getDestinationBySlug, getPackageBySlug } from "@/lib/content";
import { destinationHref } from "@/lib/content/format";
import { sessionClient } from "@/lib/supabase/server";
import { whatsappHref } from "@/lib/site";
import { deleteInquiry, saveInquiryNotes, setInquiryStatus } from "../actions";

export const metadata: Metadata = { title: "Request" };

type Props = { params: Promise<{ id: string }> };

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Nairobi" });

export default async function InquiryPage({ params }: Props) {
  await requireStaff();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const supabase = await sessionClient();
  const { data: r } = await supabase.from("inquiries").select("*").eq("id", id).maybeSingle();
  if (!r) notFound();

  const p = r.payload as Record<string, unknown>;
  const [tour, place, editor] = await Promise.all([
    typeof p.packageSlug === "string" && p.packageSlug ? getPackageBySlug(p.packageSlug) : null,
    typeof p.destinationSlug === "string" && p.destinationSlug ? getDestinationBySlug(p.destinationSlug) : null,
    r.updated_by ? supabase.from("staff").select("full_name, email").eq("id", r.updated_by).maybeSingle().then((x) => x.data) : null,
  ]);
  const ordered = Object.keys(FIELD_LABEL).filter((k) => k in p);
  const extra = Object.keys(p).filter((k) => !(k in FIELD_LABEL));
  const phoneDigits = typeof p.phone === "string" ? p.phone.replace(/\D/g, "") : "";
  const name = String(p.fullName ?? "this request");

  // Tour and destination as their names, linked to the page the traveller saw.
  const value = (k: string) => {
    if (k === "packageSlug" && tour) return <Link href={`/tours/${tour.slug}`} target="_blank">{tour.title}</Link>;
    if (k === "destinationSlug" && place) return <Link href={destinationHref(place)} target="_blank">{place.name}</Link>;
    return show(p[k]);
  };

  return (
    <>
      <p>
        <Link href="/admin/inbox">← All requests</Link>
      </p>
      <PageHead
        title={`${String(p.fullName ?? "Request")} · ${r.reference}`}
        lead={`${r.kind === "trip" ? "Trip request" : "Message"} received ${when(r.created_at)} (Nairobi time).`}
      />

      <section className={styles.card} aria-labelledby="status-title">
        <h2 id="status-title" className={styles.cardTitle}>
          Status
        </h2>
        <div className={styles.filters} role="group" aria-labelledby="status-title">
          {Object.entries(STATUS_LABEL).map(([key, label]) => (
            <form key={key} action={setInquiryStatus}>
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="status" value={key} />
              <button type="submit" className={styles.filter} aria-pressed={r.status === key} data-status={key}>
                {label}
              </button>
            </form>
          ))}
        </div>
        <p className={styles.muted}>
          {r.updated_at && r.updated_at !== r.created_at
            ? `Last changed ${when(r.updated_at)}${editor ? ` by ${editor.full_name || editor.email}` : ""}.`
            : "Not handled yet. Tap a status to move it along."}
        </p>
      </section>

      <section className={styles.card} aria-labelledby="reply-title">
        <h2 id="reply-title" className={styles.cardTitle}>
          Reply
        </h2>
        <div className={styles.row}>
          {typeof p.email === "string" && <a href={`mailto:${p.email}?subject=${encodeURIComponent(`Your Tayari trip request ${r.reference}`)}`}>Email {p.email}</a>}
          {phoneDigits && (
            <a href={whatsappHref(phoneDigits)} target="_blank" rel="noopener noreferrer">
              WhatsApp {String(p.phone)}
            </a>
          )}
        </div>
      </section>

      <section className={styles.card} aria-labelledby="details-title">
        <h2 id="details-title" className={styles.cardTitle}>
          Details
        </h2>
        <dl className={styles.details}>
          {[...ordered, ...extra].map((k) => (
            <div key={k} style={{ display: "contents" }}>
              <dt>{FIELD_LABEL[k] ?? k}</dt>
              <dd>{value(k)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.card} aria-labelledby="notes-title">
        <h2 id="notes-title" className={styles.cardTitle}>
          Team notes
        </h2>
        <ActionForm action={saveInquiryNotes} submitLabel="Save notes" variant="secondary">
          <input type="hidden" name="id" value={r.id} />
          <TextAreaField label="Never shown to the traveller" name="notes" defaultValue={r.notes} rows={5} />
        </ActionForm>
      </section>

      <section className={styles.card} aria-labelledby="delete-title">
        <h2 id="delete-title" className={styles.cardTitle}>
          Delete
        </h2>
        <p className={styles.muted}>For spam, tests and duplicates. Real requests are better marked Closed, so their history stays.</p>
        <LinkForm action={deleteInquiry} submitLabel="Delete request" pendingLabel="Deleting…" variant="ghost" confirm={`Delete ${r.reference} from ${name} for good? This cannot be undone.`}>
          <input type="hidden" name="id" value={r.id} />
        </LinkForm>
      </section>
    </>
  );
}
