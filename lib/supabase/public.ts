import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** Cache tag on every public content read. Admin saves invalidate it so changes appear straight away. */
export const CONTENT_TAG = "content";

/**
 * Reads published content for the public pages. No cookies, so pages stay cacheable; each request
 * is tagged and kept in Next's cache until an admin save invalidates CONTENT_TAG.
 */
export function publicClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { tags: [CONTENT_TAG], revalidate: 3600 } }),
    },
  });
}
