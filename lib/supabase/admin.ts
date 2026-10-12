import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

/**
 * Full-access client using the service key. ONLY for things the database rules deliberately do not
 * allow from a browser session: saving website enquiries, and inviting or removing team members
 * (after the caller has been checked). Never import this into client code.
 */
export function serviceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !key) throw new Error("Supabase service key is not configured.");
  return createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const isServiceConfigured = () => Boolean(supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY);
