import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm } from "@/components/admin/ActionForm";
import { AuthCard } from "@/components/admin/AuthCard";
import { TextField } from "@/components/ui/Field";
import { requestReset } from "../../auth-actions";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPage() {
  return (
    <AuthCard
      title="Reset your password"
      lead="Enter the email you sign in with and we will send you a link to choose a new password. A teammate can also give you a reset link from the People page."
      foot={<Link href="/admin/login">Back to sign in</Link>}
    >
      <ActionForm action={requestReset} submitLabel="Send reset link" pendingLabel="Sending…">
        <TextField label="Email" name="email" type="email" autoComplete="email" required />
      </ActionForm>
    </AuthCard>
  );
}
