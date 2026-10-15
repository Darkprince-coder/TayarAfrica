import { z } from "zod";

/** Removes control characters and trims the ends. Stored text is always plain text. */
export function cleanText(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

/** A trimmed single-line string with control characters removed. */
export const line = (max: number) => z.string().transform(cleanText).pipe(z.string().max(max, `Please keep this under ${max} characters.`));

/** A trimmed, possibly multi-line string with control characters (but not newlines) removed. */
export const paragraph = (max: number) => z.string().transform(cleanText).pipe(z.string().max(max, `Please keep this under ${max} characters.`));

export const emailField = z
  .string()
  .transform(cleanText)
  .pipe(z.string().min(1, "Please enter your email address.").max(254, "That email address is too long.").pipe(z.email("Please enter a valid email address, like name@example.com.")));

/** Loose international phone check: digits, spaces, +, brackets and dashes, 7 to 16 digits. */
export const phoneText = z
  .string()
  .transform(cleanText)
  .pipe(
    z
      .string()
      .max(30, "That phone number is too long.")
      .refine((v) => v === "" || (/^[+\d][\d\s().-]*$/.test(v) && v.replace(/\D/g, "").length >= 7 && v.replace(/\D/g, "").length <= 16), {
        message: "Please enter a phone number with the country code, like +254 700 000 000.",
      }),
  );

/** Maps zod issues to { fieldName: firstMessage } so forms can show errors beside each field. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a valid date.")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Please choose a valid date.");

/**
 * The earliest start date anyone can pick, as YYYY-MM-DD. "Today" depends on where the traveller
 * is: the server runs on UTC, which is already tomorrow during a US evening. Allowing one day
 * before the UTC date covers every time zone, so nobody is told their own today is "in the past".
 */
export function earliestStartDate(now = new Date()): string {
  return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** True when an ISO date (YYYY-MM-DD) is before the earliest date anyone could call today. */
export function isPastDate(iso: string, now = new Date()): boolean {
  return iso < earliestStartDate(now);
}
