import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/ActionForm";
import { PageHead } from "@/components/admin/Shell";
import styles from "@/components/admin/Shell.module.css";
import { SelectField, TextAreaField } from "@/components/ui/Field";
import { FIELD_LABEL, STATUS_LABEL, show } from "@/lib/admin/inquiries";
import { requireStaff } from "@/lib/admin/session";
import { sessionClient } from "@/lib/supabase/server";
import { whatsappHref } from "@/lib/site";
import { updateInquiry } from "../actions";

export const metadata: Metadata = { title: "Request" };

type Props = { params: Promise<{ id: string }> };

export default async function InquiryPage({ params }: Props) {
  await requireStaff();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const supabase = await sessionClient();
  const { data: r } = await supabase.from("inquiries").select("*").eq("id", id).maybeSingle();
  if (!r) notFound();

  const p = r.payload as Record<string, unknown>;
  const ordered = Object.keys(FIELD_LABEL).filter((k) => k in p);
  const extra = Object.keys(p).filter((k) => !(k in FIELD_LABEL));
  const phoneDigits = typeof p.phone === "string" ? p.phone.replace(/\D/g, "") : "";

  return (
    <>
      <p>
        <Link href="/admin/inbox">← All requests</Link>
      </p>
      <PageHead
        title={`${String(p.fullName ?? "Request")} · ${r.reference}`}
        lead={`${r.kind === "trip" ? "Trip request" : "Message"} received ${new Date(r.created_at).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}.`}
      />

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
              <dd>{show(p[k])}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.card} aria-labelledby="status-title">
        <h2 id="status-title" className={styles.cardTitle}>
          Status and notes
        </h2>
        <ActionForm action={updateInquiry} submitLabel="Save" variant="secondary">
          <input type="hidden" name="id" value={r.id} />
          <SelectField label="Status" name="status" defaultValue={r.status} options={Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }))} />
          <TextAreaField label="Team notes (never shown to the traveller)" name="notes" defaultValue={r.notes} />
        </ActionForm>
      </section>
    </>
  );
}
