import { z } from "zod";
import { emailField, line, paragraph, phoneText } from "./common";

/** Simple contact form (separate from a trip request). */
export const contactSchema = z.object({
  fullName: line(100).pipe(z.string().min(2, "Please enter your name.")),
  email: emailField,
  phone: phoneText,
  message: paragraph(2000).pipe(z.string().min(10, "Please write a few words so we know how to help.")),
  consent: z.literal(true, { error: "Please confirm so we can reply to you." }),
  /** Honeypot */
  website: z.string().max(200),
  startedAt: z.number().int(),
  idempotencyKey: z.string().min(8).max(80),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactFormValues = { fullName: string; email: string; phone: string; message: string; consent: boolean; website: string };
export const emptyContact: ContactFormValues = { fullName: "", email: "", phone: "", message: "", consent: false, website: "" };
