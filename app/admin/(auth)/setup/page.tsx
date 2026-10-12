import type { Metadata } from "next";
import { connection } from "next/server";
import { AuthCard } from "@/components/admin/AuthCard";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isServiceConfigured } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Setup" };

/** Shown instead of the admin until the Supabase keys are in place. */
export default async function SetupPage() {
  await connection();
  const rows = [
    ["Supabase URL and public key", isSupabaseConfigured],
    ["Supabase service key", isServiceConfigured()],
  ] as const;
  return (
    <AuthCard title="The admin is not connected yet" lead="Add the keys to .env.local (see docs/admin-setup.md) and restart the server.">
      <ul role="list" style={{ display: "grid", gap: "0.5rem" }}>
        {rows.map(([label, ok]) => (
          <li key={label}>
            {ok ? "✓" : "✗"} {label}
          </li>
        ))}
      </ul>
    </AuthCard>
  );
}
