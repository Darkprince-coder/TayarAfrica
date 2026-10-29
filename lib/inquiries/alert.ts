import "server-only";
import { getDestinationBySlug, getPackageBySlug, getSiteSettings } from "@/lib/content";
import { emailEnabled, emailLayout, escapeHtml, sendEmail } from "@/lib/email";
import { siteUrl } from "@/lib/site";
import { ACCOMMODATION, ARRIVAL_OPTIONS, CONTACT_PREFERENCES, DURATIONS, labelFor } from "@/lib/validation/options";
import type { InquiryRecord } from "./types";

/**
 * Emails the team when a trip request or contact message arrives. Recipients: INQUIRY_ALERT_TO
 * (comma-separated), else the contact email in Site settings. Never throws: the request is already
 * saved, and a failed alert must not affect the visitor.
 */
export async function sendInquiryAlert(record: Pick<InquiryRecord, "kind" | "reference" | "payload">): Promise<void> {
  if (!emailEnabled()) return;
  try {
    const settings = await getSiteSettings();
    const to = (process.env.INQUIRY_ALERT_TO || settings.contact.email).split(",").map((s) => s.trim()).filter(Boolean);
    const { subject, rows, message } = await describe(record);
    const email = record.payload.email;
    await sendEmail({
      to,
      subject,
      // Pressing Reply answers the visitor directly.
      replyTo: typeof email === "string" ? email : undefined,
      text: textBody(record.reference, rows, message),
      html: htmlBody(record.reference, rows, message),
      idempotencyKey: `alert-${record.reference}`,
    });
  } catch (error) {
    console.error(`[alert] could not send ${record.reference}`, error instanceof Error ? error.message : error);
  }
}

type Row = [label: string, value: string];
const str = (v: unknown) => (v === null || v === undefined || v === "" ? "" : String(v));

async function describe({ kind, reference, payload: p }: Pick<InquiryRecord, "kind" | "reference" | "payload">) {
  const name = str(p.fullName);
  if (kind === "contact") {
    const rows: Row[] = [["Name", name], ["Email", str(p.email)], ["Phone", str(p.phone)]];
    return { subject: `New message ${reference} from ${name}`, rows, message: str(p.message) };
  }
  const trip = p.packageSlug ? (await getPackageBySlug(String(p.packageSlug)))?.title : undefined;
  const place = p.destinationSlug ? (await getDestinationBySlug(String(p.destinationSlug)))?.name : undefined;
  const what = trip || place || "a custom trip";
  const rows: Row[] = [
    ["Name", name],
    ["Email", str(p.email)],
    ["Phone / WhatsApp", str(p.phone)],
    ["Prefers", labelFor(CONTACT_PREFERENCES, str(p.contactPreference))],
    ["Nationality", str(p.nationality)],
    ["Lives in", str(p.country)],
    ["Trip", trip ?? ""],
    ["Destination", place ?? ""],
    ["Start date", `${str(p.startDate)}${p.flexibleDates ? " (flexible)" : ""}`],
    ["Length", labelFor(DURATIONS, str(p.duration))],
    ["Travellers", str(p.travelers)],
    ["Interests", Array.isArray(p.experienceTypes) ? p.experienceTypes.join(", ") : ""],
    ["Stay style", labelFor(ACCOMMODATION, str(p.accommodation))],
    ["Getting here", labelFor(ARRIVAL_OPTIONS, str(p.arrival))],
    ["Pickup point", str(p.pickupPoint)],
    ["Flying from", str(p.departureCity)],
  ];
  return { subject: `New trip request ${reference}: ${name}, ${what}, ${str(p.startDate)}`, rows, message: str(p.message) };
}

const inboxUrl = () => `${siteUrl}/admin/inbox`;
const FOOTNOTE = "Reply to this email to answer the visitor directly.";

function textBody(reference: string, rows: Row[], message: string) {
  const lines = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
  return [`Reference: ${reference}`, ...lines, "", message ? `Message:\n${message}\n` : "", `Open the inbox: ${inboxUrl()}`, FOOTNOTE].join("\n");
}

function htmlBody(reference: string, rows: Row[], message: string) {
  const cell = "padding:6px 12px 6px 0;vertical-align:top;font:14px/1.45 Arial,sans-serif";
  const trs = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="${cell};color:#5e594f;white-space:nowrap">${escapeHtml(k)}</td><td style="${cell};color:#1b1a17">${escapeHtml(v)}</td></tr>`)
    .join("");
  const body = `<table role="presentation" style="border-collapse:collapse">${trs}</table>
${message ? `<p style="margin:18px 0 6px;color:#5e594f">Message</p><p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>` : ""}`;
  return emailLayout({ heading: `New request ${reference}`, body, button: { label: "Open the inbox", href: inboxUrl() }, footnote: FOOTNOTE });
}
