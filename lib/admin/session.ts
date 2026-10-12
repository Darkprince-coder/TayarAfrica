import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { sessionClient } from "@/lib/supabase/server";
import { appFactor, needsCode } from "./two-step";

export type StaffUser = { id: string; email: string; fullName: string; twoStep: boolean };

/**
 * The signed-in team member, or a redirect to the login page. Call it at the top of every admin
 * page and server action: the proxy's check is only a convenience, this one is the real gate.
 */
export const requireStaff = cache(async (): Promise<StaffUser> => {
  // Always per request: never prerender an admin page, keys or not.
  await connection();
  if (!isSupabaseConfigured) redirect("/admin/setup");
  const supabase = await sessionClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");
  // Two-step login on, but only the password given so far.
  if (await needsCode(supabase, data.user)) redirect("/admin/verify");
  const { data: row } = await supabase.from("staff").select("full_name, email").eq("id", data.user.id).maybeSingle();
  // Signed in but no longer (or never) on the team: sign out and stop.
  if (!row) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-staff");
  }
  return { id: data.user.id, email: row.email || data.user.email || "", fullName: row.full_name, twoStep: Boolean(appFactor(data.user)) };
});

/** Site origin for links we build (invite and reset links), from the request when possible. */
export async function siteOrigin(): Promise<string> {
  const { headers } = await import("next/headers");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) return `${h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
