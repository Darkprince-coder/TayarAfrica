"use server";

import { getDestinationBySlug, getPackageBySlug } from "@/lib/content";
import { allowRequest, clientKey, submittedTooFast } from "@/lib/inquiries/guard";
import { inquiryStore } from "@/lib/inquiries/store";
import type { SubmitResult } from "@/lib/inquiries/types";
import { fieldErrors } from "@/lib/validation/common";
import { inquirySchema } from "@/lib/validation/inquiry";

/** Fake-looking success for bots, so they learn nothing from a rejection. */
const botResult = (): SubmitResult => ({ ok: true, reference: "TAY-000000" });

/**
 * Receives a trip request. Everything is validated again here: the browser is not trusted,
 * and status or other privileged fields are never read from it.
 */
export async function submitInquiry(input: unknown): Promise<SubmitResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, code: "validation", message: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }
  const data = parsed.data;

  // Bot traps: filled honeypot, or finished far too quickly.
  if (data.website.trim() !== "" || submittedTooFast(data.startedAt, 4000)) return botResult();

  if (!allowRequest(await clientKey())) {
    return { ok: false, code: "busy", message: "You have sent several requests recently. Please wait a few minutes, or contact us on WhatsApp." };
  }

  // Only accept trips and destinations that really exist.
  if (data.packageSlug && !(await getPackageBySlug(data.packageSlug))) {
    return { ok: false, code: "validation", message: "That trip is no longer available.", fieldErrors: { packageSlug: "Please choose another trip." } };
  }
  if (data.destinationSlug && !(await getDestinationBySlug(data.destinationSlug))) {
    return { ok: false, code: "validation", message: "That destination is no longer available.", fieldErrors: { destinationSlug: "Please choose another destination." } };
  }

  try {
    const { reference } = await inquiryStore.save(
      {
        kind: "trip",
        payload: {
          packageSlug: data.packageSlug || null,
          destinationSlug: data.destinationSlug || null,
          experienceTypes: data.experienceTypes,
          accommodation: data.accommodation,
          travelers: data.travelers,
          startDate: data.startDate,
          flexibleDates: data.flexibleDates,
          pickupPoint: data.pickupPoint,
          duration: data.duration,
          message: data.message,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          nationality: data.nationality,
          country: data.country,
          contactPreference: data.contactPreference,
        },
      },
      data.idempotencyKey,
    );
    return { ok: true, reference };
  } catch (error) {
    // Details stay in the server log; the visitor only ever sees a friendly message.
    console.error("[inquiry] save failed", error instanceof Error ? error.message : error);
    return { ok: false, code: "unavailable", message: "We could not send your request just now." };
  }
}
