import "server-only";
import { getDestinationBySlug, getPackageBySlug, getSiteSettings } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import { ACCOMMODATION, ARRIVAL_OPTIONS, CONTACT_PREFERENCES, DURATIONS, labelFor } from "@/lib/validation/options";
import type { InquiryRecord } from "./types";

/**
 * Emails the team when a trip request or contact message arrives (Resend's HTTP API, no SDK).
 * Off until RESEND_API_KEY is set. Recipients: INQUIRY_ALERT_TO (comma-separated), else the
 * contact email in Site settings. Sender: ALERT_FROM, which must be on a domain verified in Resend.
 * Never throws: the request is already saved, and a failed alert must not affect the visitor.
 */
export async function sendInquiryAlert(record: Pick<InquiryRecord, "kind" | "reference" | "payload">): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    const settings = await getSiteSettings();
    const to = (process.env.INQUIRY_ALERT_TO || settings.contact.email).split(",").map((s) => s.trim()).filter(Boolean);
    const from = process.env.ALERT_FROM || "Tayari website <alerts@tayariafrica.com>";
    const { subject, rows, message } = await describe(record);
    const p = record.payload;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `alert-${record.reference}` },
      body: JSON.stringify({
        from,
        to,
        subject,
        // Pressing Reply answers the visitor directly.
        reply_to: typeof p.email === "string" ? p.email : undefined,
        text: textBody(record.reference, rows, message),
        html: htmlBody(record.reference, rows, message),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error(`[alert] Resend refused ${record.reference}: ${res.status} ${(await res.text()).slice(0, 300)}`);
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

function textBody(reference: string, rows: Row[], message: string) {
  const lines = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
  return [`Reference: ${reference}`, ...lines, "", message ? `Message:\n${message}\n` : "", `Open the inbox: ${inboxUrl()}`, "Reply to this email to answer the visitor directly."].join("\n");
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function htmlBody(reference: string, rows: Row[], message: string) {
  const cell = "padding:6px 12px 6px 0;vertical-align:top;font:14px/1.45 Arial,sans-serif";
  const trs = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="${cell};color:#5e594f;white-space:nowrap">${esc(k)}</td><td style="${cell};color:#1b1a17">${esc(v)}</td></tr>`)
    .join("");
  return `<div style="max-width:600px;margin:0 auto;padding:24px;background:#faf6ee;color:#1b1a17;font:14px/1.5 Arial,sans-serif">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#4a6b3a">Tayari website</p>
<h1 style="margin:0 0 16px;font:600 20px/1.3 Georgia,serif">New request ${esc(reference)}</h1>
<table role="presentation" style="border-collapse:collapse">${trs}</table>
${message ? `<p style="margin:18px 0 6px;color:#5e594f">Message</p><p style="margin:0;white-space:pre-wrap">${esc(message)}</p>` : ""}
<p style="margin:24px 0 0"><a href="${esc(inboxUrl())}" style="display:inline-block;padding:10px 18px;background:#b4501e;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold">Open the inbox</a></p>
<p style="margin:16px 0 0;font-size:12px;color:#5e594f">Reply to this email to answer the visitor directly.</p>
</div>`;
}
