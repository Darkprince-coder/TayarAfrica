import { connection } from "next/server";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Keeps the Supabase project awake. Free projects pause after 7 days without activity; Vercel calls
 * this once a day (vercel.json "crons") and it makes one real, uncached database read.
 *
 * With CRON_SECRET set in Vercel, only Vercel's scheduler may call it (Vercel sends the secret as
 * a Bearer token). It reads one public row, so even an open call reveals and costs nothing.
 */
export async function GET(request: Request) {
  await connection();
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!isSupabaseConfigured) return Response.json({ ok: false, reason: "Supabase is not configured" }, { status: 503 });

  const started = Date.now();
  const res = await fetch(`${supabaseUrl}/rest/v1/site_settings?select=id&limit=1`, {
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
    cache: "no-store",
  });
  const ok = res.ok;
  if (!ok) console.error("[keep-alive] Supabase answered", res.status);
  return Response.json({ ok, status: res.status, ms: Date.now() - started, at: new Date().toISOString() }, { status: ok ? 200 : 502 });
}
