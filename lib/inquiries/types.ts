export type SubmitResult =
  | { ok: true; reference: string }
  | {
      ok: false;
      /** validation: fix the fields. busy: too many attempts. unavailable: try again or use WhatsApp. */
      code: "validation" | "busy" | "unavailable";
      message: string;
      fieldErrors?: Record<string, string>;
    };

/** What gets stored for a trip request. `status` is always set by the server, never by the browser. */
export type InquiryRecord = {
  kind: "trip" | "contact";
  reference: string;
  status: "new";
  createdAt: string;
  payload: Record<string, unknown>;
};

/**
 * Storage adapter. The board prototype uses the in-memory mock below; after approval a Supabase
 * implementation replaces it without touching the forms or the actions.
 */
export interface InquiryStore {
  save(record: Omit<InquiryRecord, "reference" | "status" | "createdAt">, idempotencyKey: string): Promise<{ reference: string }>;
}
