import "server-only";
import { FIELD_LABEL, STATUS_LABEL, show } from "./inquiries";

/** Today's date in Nairobi, for file names (e.g. tayari-requests-2026-10-12.csv). */
export const nairobiDate = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi" }).format(new Date());

const nairobiTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Nairobi", dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

/**
 * One spreadsheet cell. Quotes when needed, and defuses text a spreadsheet would run as a formula
 * (a traveller could type "=..." into a form).
 */
function cell(value: unknown): string {
  let s = value === null || value === undefined ? "" : typeof value === "string" ? value : show(value);
  if (s === "—") s = "";
  // Phone numbers ("+254 710 …") would otherwise lose their "+" or turn into a sum in Excel: keep them as text.
  if (/^\+[\d\s().-]+$/.test(s)) s = `="${s}"`;
  else if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export type InquiryRow = {
  reference: string;
  kind: string;
  status: string;
  payload: Record<string, unknown>;
  notes: string;
  created_at: string;
  updated_at: string;
};

/**
 * Booking requests as a CSV spreadsheet: one row each, newest first, the same fields and labels
 * as the request page. Starts with a byte-order mark so Excel reads accents correctly.
 */
export function requestsCsv(rows: InquiryRow[], names: { tours: Map<string, string>; places: Map<string, string> }): string {
  const fields = Object.keys(FIELD_LABEL);
  const header = ["Reference", "Received (Nairobi time)", "Type", "Status", ...fields.map((f) => FIELD_LABEL[f]), "Team notes", "Last changed (Nairobi time)"];
  const lines = rows.map((r) => {
    const p = r.payload ?? {};
    const value = (f: string) => {
      if (f === "packageSlug" && typeof p[f] === "string") return names.tours.get(p[f] as string) ?? p[f];
      if (f === "destinationSlug" && typeof p[f] === "string") return names.places.get(p[f] as string) ?? p[f];
      return p[f];
    };
    return [
      r.reference,
      nairobiTime(r.created_at),
      r.kind === "trip" ? "Trip request" : "Message",
      STATUS_LABEL[r.status] ?? r.status,
      ...fields.map(value),
      r.notes,
      nairobiTime(r.updated_at),
    ]
      .map(cell)
      .join(",");
  });
  return "﻿" + [header.map(cell).join(","), ...lines].join("\r\n") + "\r\n";
}
