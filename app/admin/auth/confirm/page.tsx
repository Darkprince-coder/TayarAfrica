import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ActionForm } from "@/components/admin/ActionForm";
import { AuthCard } from "@/components/admin/AuthCard";
import { continueFromLink } from "../../auth-actions";

export const metadata: Metadata = { title: "Continue" };

type Props = { searchParams: Promise<{ token_hash?: string; type?: string; code?: string; next?: string }> };

/**
 * Where invite and password-reset links land. Opening the page does NOT use the link: WhatsApp,
 * email apps and virus scanners open links in the background to build previews, and would use up
 * a one-time link before the person taps it. The link is only used when "Continue" is pressed.
 */
export default async function ConfirmPage({ searchParams }: Props) {
  await connection();
  const { token_hash, type, code, next } = await searchParams;

  if (!token_hash && !code) {
    return (
      <AuthCard title="This link is incomplete" lead="Part of the link seems to be missing. Copy the whole link again, or ask a teammate for a new one." foot={<Link href="/admin/login">Go to sign in</Link>}>
        {null}
      </AuthCard>
    );
  }

  const invite = type === "invite";
  return (
    <AuthCard
      title={invite ? "Welcome to the Tayari admin" : "Reset your password"}
      lead={invite ? "Press Continue to choose your password and open the admin." : "Press Continue to choose a new password."}
    >
      <ActionForm action={continueFromLink} submitLabel="Continue" pendingLabel="Checking the link…">
        {token_hash && <input type="hidden" name="token_hash" value={token_hash} />}
        {type && <input type="hidden" name="type" value={type} />}
        {code && <input type="hidden" name="code" value={code} />}
        {next && <input type="hidden" name="next" value={next} />}
      </ActionForm>
    </AuthCard>
  );
}
