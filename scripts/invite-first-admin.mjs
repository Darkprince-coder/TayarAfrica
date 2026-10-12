// Creates the FIRST admin account (after that, people invite each other from /admin/people).
// Usage:  node scripts/invite-first-admin.mjs you@example.com "Your Name"
// Reads the Supabase keys from .env.local and prints a link to choose your password.
import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);

const [email, fullName = ""] = process.argv.slice(2);
if (!email) {
  console.error('Usage: node scripts/invite-first-admin.mjs you@example.com "Your Name"');
  process.exit(1);
}
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local first.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });
const { data, error } = await db.auth.admin.generateLink({ type: "invite", email, options: { data: { full_name: fullName } } });
if (error) {
  console.error("Could not create the invite:", error.message);
  process.exit(1);
}
const { error: staffError } = await db.from("staff").upsert({ id: data.user.id, email, full_name: fullName });
if (staffError) {
  console.error("Account created but not added to the team:", staffError.message, "(did you run supabase/migrations/0001_init.sql?)");
  process.exit(1);
}
await db.from("audit_log").insert({ actor_email: "setup script", action: "invited", target: email });

const site = env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
console.log(`\n${fullName || email} is set up. Open this link to choose your password (works once, 24 hours):\n`);
console.log(`${site}/admin/auth/confirm?token_hash=${encodeURIComponent(data.properties.hashed_token)}&type=invite&next=/admin/set-password\n`);
