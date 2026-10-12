import type { Metadata } from "next";
import { ActionForm } from "@/components/admin/ActionForm";
import { AuthCard } from "@/components/admin/AuthCard";
import { TextField } from "@/components/ui/Field";
import { setPassword } from "../../auth-actions";

export const metadata: Metadata = { title: "Choose a password" };

export default function SetPasswordPage() {
  return (
    <AuthCard title="Choose your password" lead="Only you will know it. Use at least 10 characters; a short sentence is easy to remember and hard to guess.">
      <ActionForm action={setPassword} submitLabel="Save and continue" pendingLabel="Saving…">
        <TextField label="New password" name="password" type="password" autoComplete="new-password" minLength={10} required />
        <TextField label="Type it again" name="confirm" type="password" autoComplete="new-password" minLength={10} required />
      </ActionForm>
    </AuthCard>
  );
}
