import "server-only";
import { createHash } from "node:crypto";
import { isServiceConfigured, serviceClient } from "@/lib/supabase/admin";
import type { InquiryRecord, InquiryStore } from "./types";

/**
 * MOCK store, used when Supabase is not configured. Records live in server memory only (they vanish on restart
 * and are not shared between serverless instances). Replace with a Supabase-backed store later.
 *
 * Demo switch (server env var MOCK_INQUIRY_MODE):
 *   unset / "ok"  respond normally after a short delay
 *   "slow"        take ~9 seconds, to preview the slow-network message
 *   "error"       always fail, to preview the failure state
 */
const globalStore = globalThis as unknown as { __tayariInquiries?: Map<string, InquiryRecord> };
const records = (globalStore.__tayariInquiries ??= new Map<string, InquiryRecord>());

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** TAY-… for trip requests, MSG-… for contact messages: the same reference the visitor sees and the inbox shows. */
function referenceFor(idempotencyKey: string, kind: InquiryRecord["kind"]): string {
  const hash = createHash("sha256").update(idempotencyKey).digest("hex").slice(0, 6).toUpperCase();
  return `${kind === "contact" ? "MSG" : "TAY"}-${hash}`;
}

export const mockInquiryStore: InquiryStore = {
  async save(record, idempotencyKey) {
    const mode = process.env.MOCK_INQUIRY_MODE;
    await wait(mode === "slow" ? 9000 : 900);
    if (mode === "error") throw new Error("Mock store failure (MOCK_INQUIRY_MODE=error)");

    const reference = referenceFor(idempotencyKey, record.kind);
    // Same key twice (double click, retry after a slow response) returns the same request.
    const created = !records.has(reference);
    if (created) {
      records.set(reference, { ...record, reference, status: "new", createdAt: new Date().toISOString() });
      // Log only non-personal facts.
      console.info(`[mock-inquiry] saved ${record.kind} ${reference}`);
    }
    return { reference, created };
  },
};

/**
 * Supabase store: one row per request in `inquiries`, inserted with the service key (visitors
 * have no write access). The idempotency key is unique, so a double send returns the first row.
 */
export const supabaseInquiryStore: InquiryStore = {
  async save(record, idempotencyKey) {
    const db = serviceClient();
    const reference = referenceFor(idempotencyKey, record.kind);
    const { data, error } = await db
      .from("inquiries")
      .upsert({ reference, kind: record.kind, payload: record.payload, idempotency_key: idempotencyKey }, { onConflict: "idempotency_key", ignoreDuplicates: true })
      .select("reference");
    if (error) throw new Error(`Saving inquiry failed: ${error.message}`);
    // A duplicate is skipped, so no row comes back.
    return { reference, created: (data?.length ?? 0) > 0 };
  },
};

export const inquiryStore: InquiryStore = isServiceConfigured() ? supabaseInquiryStore : mockInquiryStore;
