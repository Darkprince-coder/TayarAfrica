import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Two-step login: optional, per person, with an authenticator app (Google Authenticator,
 * Microsoft Authenticator, 1Password...). Supabase stores the app link as a "TOTP factor".
 */

/** The person's confirmed authenticator app, if they have turned two-step login on. */
export function appFactor(user: Pick<User, "factors">) {
  return user.factors?.find((f) => f.factor_type === "totp" && f.status === "verified") ?? null;
}

/**
 * True when the person has two-step login on but this session has not passed the code step yet.
 * `user` must come from getUser() (fresh from Supabase), not from the cookie.
 */
export async function needsCode(supabase: SupabaseClient, user: User): Promise<boolean> {
  if (!appFactor(user)) return false;
  const { data } = await supabase.auth.getClaims();
  return data?.claims.aal !== "aal2";
}

/**
 * Checks a password without touching the current session (signing in again on the session
 * client would drop a two-step session back to password-only).
 */
export async function passwordMatches(email: string, password: string): Promise<boolean> {
  const probe = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await probe.auth.signInWithPassword({ email, password });
  if (error) return false;
  await probe.auth.signOut({ scope: "local" });
  return true;
}

/** Six digits, spaces allowed (apps often show "123 456"). */
export const cleanCode = (v: FormDataEntryValue | null) => {
  const s = typeof v === "string" ? v.replace(/\s+/g, "") : "";
  return /^\d{6}$/.test(s) ? s : null;
};
