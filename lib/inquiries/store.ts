import "server-only";
import { createHash } from "node:crypto";
import type { InquiryRecord, InquiryStore } from "./types";

/**
 * MOCK store for the board prototype. Records live in server memory only (they vanish on restart
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

function referenceFor(idempotencyKey: string): string {
  const hash = createHash("sha256").update(idempotencyKey).digest("hex").slice(0, 6).toUpperCase();
  return `TAY-${hash}`;
}

export const mockInquiryStore: InquiryStore = {
  async save(record, idempotencyKey) {
    const mode = process.env.MOCK_INQUIRY_MODE;
    await wait(mode === "slow" ? 9000 : 900);
    if (mode === "error") throw new Error("Mock store failure (MOCK_INQUIRY_MODE=error)");

    const reference = referenceFor(idempotencyKey);
    // Same key twice (double click, retry after a slow response) returns the same request.
    if (!records.has(reference)) {
      records.set(reference, { ...record, reference, status: "new", createdAt: new Date().toISOString() });
      // Log only non-personal facts.
      console.info(`[mock-inquiry] saved ${record.kind} ${reference}`);
    }
    return { reference };
  },
};

export const inquiryStore: InquiryStore = mockInquiryStore;
