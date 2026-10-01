"use server";

import { allowRequest, clientKey, submittedTooFast } from "@/lib/inquiries/guard";
import { inquiryStore } from "@/lib/inquiries/store";
import type { SubmitResult } from "@/lib/inquiries/types";
import { fieldErrors } from "@/lib/validation/common";
import { contactSchema } from "@/lib/validation/contact";

/** Receives a contact-form message. Validated again on the server, with the same bot protection as trip requests. */
export async function submitContact(input: unknown): Promise<SubmitResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, code: "validation", message: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }
  const data = parsed.data;

  if (data.website.trim() !== "" || submittedTooFast(data.startedAt, 3000)) return { ok: true, reference: "MSG-000000" };

  if (!allowRequest(await clientKey())) {
    return { ok: false, code: "busy", message: "You have sent several messages recently. Please wait a few minutes, or contact us on WhatsApp." };
  }

  try {
    const { reference } = await inquiryStore.save(
      { kind: "contact", payload: { fullName: data.fullName, email: data.email, phone: data.phone || null, message: data.message } },
      data.idempotencyKey,
    );
    return { ok: true, reference: reference.replace("TAY-", "MSG-") };
  } catch (error) {
    console.error("[contact] save failed", error instanceof Error ? error.message : error);
    return { ok: false, code: "unavailable", message: "We could not send your message just now." };
  }
}
