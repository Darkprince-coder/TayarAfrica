import "server-only";
import { headers } from "next/headers";

/** Light spam protection for public forms. In-memory, so it is per server instance (fine for the prototype). */
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;

export async function clientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "local";
}

/** Returns false when this client has sent too many requests recently. */
export function allowRequest(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

/** Real people need a few seconds to fill a form; instant submissions are bots. */
export function submittedTooFast(startedAt: number, minMs: number, now = Date.now()): boolean {
  return now - startedAt < minMs;
}
