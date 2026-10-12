import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm } from "@/components/admin/ActionForm";
import { AuthCard } from "@/components/admin/AuthCard";
import { TextField } from "@/components/ui/Field";
import { signIn } from "../../auth-actions";

export const metadata: Metadata = { title: "Sign in" };

const NOTICES: Record<string, string> = {
  link: "That link has already been used or has expired. Sign in, or ask for a new link.",
  "not-staff": "This account is not on the Tayari team. Ask a teammate to invite you.",
};

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next = "/admin", error } = await searchParams;
  return (
    <AuthCard title="Sign in" lead={error && NOTICES[error] ? NOTICES[error] : "For the Tayari team only."} foot={<Link href="/admin/forgot">Forgot your password?</Link>}>
      <ActionForm action={signIn} submitLabel="Sign in" pendingLabel="Signing in…">
        <input type="hidden" name="next" value={next} />
        <TextField label="Email" name="email" type="email" autoComplete="email" required />
        <TextField label="Password" name="password" type="password" autoComplete="current-password" required />
      </ActionForm>
    </AuthCard>
  );
}
