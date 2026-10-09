import { z } from "zod";
import { emailField, isoDate, isPastDate, line, paragraph, phoneText } from "./common";
import { ACCOMMODATION_VALUES, CONTACT_VALUES, DURATION_VALUES, EXPERIENCE_TYPES } from "./options";

/**
 * Trip request, split by form step. The same schemas validate each step in the browser and the
 * whole request again on the server (which never trusts the browser).
 */

const slug = z.string().regex(/^[a-z0-9-]{0,80}$/, "Unknown selection.");

/** Step 1: the trip */
export const tripShape = {
  packageSlug: slug,
  destinationSlug: slug,
  experienceTypes: z
    .array(z.enum(EXPERIENCE_TYPES))
    .min(1, "Choose at least one kind of trip.")
    .max(EXPERIENCE_TYPES.length),
  accommodation: z.enum(ACCOMMODATION_VALUES, { error: "Choose an accommodation style, or Not sure." }),
};

/** Step 2: the details */
export const detailsShape = {
  travelers: z.coerce
    .number({ error: "Please enter how many people are travelling." })
    .int("Please enter a whole number.")
    .min(1, "At least 1 traveller.")
    .max(50, "For groups over 50, please contact us directly."),
  // Required by the client's booking process. An estimate is fine; "flexible" says so.
  startDate: z.string().min(1, "Please choose a start date. An estimate is fine.").pipe(isoDate),
  flexibleDates: z.boolean(),
  pickupPoint: line(120).pipe(z.string().min(2, "Please tell us where we should pick you up.")),
  duration: z.enum(DURATION_VALUES, { error: "Choose a trip length, or Not sure yet." }),
  message: paragraph(2000),
};

/** Step 3: about you */
export const aboutShape = {
  fullName: line(100).pipe(z.string().min(2, "Please enter your full name.")),
  email: emailField,
  phone: phoneText.pipe(z.string().min(1, "Please add a phone or WhatsApp number so we can reach you.")),
  nationality: line(80).pipe(z.string().min(2, "Please tell us your nationality.")),
  country: line(80).pipe(z.string().min(2, "Please tell us which country you live in.")),
  contactPreference: z.enum(CONTACT_VALUES, { error: "Choose how you would like us to reach you." }),
  consent: z.literal(true, { error: "Please confirm so we can contact you about this request." }),
};

type Cross = { startDate?: string; phone?: string; contactPreference?: string };

/** Rules that look at more than one field. */
function crossChecks(data: Cross, ctx: z.RefinementCtx) {
  if (data.startDate && isPastDate(data.startDate)) {
    ctx.addIssue({ code: "custom", path: ["startDate"], message: "Please choose a date that is today or later." });
  }
  if ((data.contactPreference === "whatsapp" || data.contactPreference === "phone") && !data.phone) {
    ctx.addIssue({ code: "custom", path: ["phone"], message: "Please add a phone number so we can reach you that way." });
  }
}

export const tripSchema = z.object(tripShape);
export const detailsSchema = z.object(detailsShape).superRefine(crossChecks);
export const aboutSchema = z.object(aboutShape).superRefine(crossChecks);

/** Full request as the browser sends it. Bot traps and the idempotency key ride along. */
export const inquirySchema = z
  .object({
    ...tripShape,
    ...detailsShape,
    ...aboutShape,
    /** Honeypot: real people never see or fill this field. */
    website: z.string().max(200),
    /** When the form was opened (ms since epoch), to spot instant bot submissions. */
    startedAt: z.number().int(),
    /** Stable for one form session so a double send cannot create two requests. */
    idempotencyKey: z.string().min(8).max(80),
  })
  .superRefine(crossChecks);

export type InquiryInput = z.input<typeof inquirySchema>;
export type InquiryData = z.output<typeof inquirySchema>;

/** The shape the form keeps in state (strings for inputs, booleans and arrays where natural). */
export type InquiryFormValues = {
  packageSlug: string;
  destinationSlug: string;
  experienceTypes: string[];
  accommodation: string;
  travelers: string;
  startDate: string;
  flexibleDates: boolean;
  pickupPoint: string;
  duration: string;
  message: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  country: string;
  contactPreference: string;
  consent: boolean;
  website: string;
};

export const emptyInquiry: InquiryFormValues = {
  packageSlug: "",
  destinationSlug: "",
  experienceTypes: [],
  accommodation: "not-sure",
  travelers: "2",
  startDate: "",
  flexibleDates: false,
  pickupPoint: "",
  duration: "not-sure",
  message: "",
  fullName: "",
  email: "",
  phone: "",
  nationality: "",
  country: "",
  contactPreference: "email",
  consent: false,
  website: "",
};

/** Which field names belong to which step, so errors can send people back to the right one. */
export const STEP_FIELDS = [Object.keys(tripShape), Object.keys(detailsShape), Object.keys(aboutShape)] as const;
