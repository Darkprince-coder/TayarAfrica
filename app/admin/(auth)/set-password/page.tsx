import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ActionForm } from "@/components/admin/ActionForm";
import { AuthCard } from "@/components/admin/AuthCard";
import { TextField } from "@/components/ui/Field";
import { needsCode } from "@/lib/admin/two-step";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { sessionClient } from "@/lib/supabase/server";
import { setPassword } from "../../auth-actions";

export const metadata: Metadata = { title: "Choose a password" };

export default async function SetPasswordPage() {
  await connection();
  if (isSupabaseConfigured) {
    // A reset link proves the email, not the phone: people with two-step login on enter a code first.
    const supabase = await sessionClient();
    const { data } = await supabase.auth.getUser();
    if (data.user && (await needsCode(supabase, data.user))) redirect("/admin/verify?next=/admin/set-password");
  }
  return (
    <AuthCard title="Choose your password" lead="Only you will know it. Use at least 10 characters; a short sentence is easy to remember and hard to guess.">
      <ActionForm action={setPassword} submitLabel="Save and continue" pendingLabel="Saving…">
        <TextField label="New password" name="password" type="password" autoComplete="new-password" minLength={10} required />
        <TextField label="Type it again" name="confirm" type="password" autoComplete="new-password" minLength={10} required />
      </ActionForm>
    </AuthCard>
  );
}
