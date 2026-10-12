import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ActionForm } from "@/components/admin/ActionForm";
import { AuthCard } from "@/components/admin/AuthCard";
import styles from "@/components/admin/Admin.module.css";
import { TextField } from "@/components/ui/Field";
import { needsCode } from "@/lib/admin/two-step";
import { sessionClient } from "@/lib/supabase/server";
import { signOut, verifyCode } from "../../auth-actions";

export const metadata: Metadata = { title: "Enter your code" };

type Props = { searchParams: Promise<{ next?: string }> };

/** The second step of signing in, for people who have turned two-step login on. */
export default async function VerifyPage({ searchParams }: Props) {
  await connection();
  const { next = "/admin" } = await searchParams;
  const supabase = await sessionClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");
  if (!(await needsCode(supabase, data.user))) redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");

  return (
    <AuthCard
      title="Enter your code"
      lead="Open your authenticator app and type the six-digit code shown for Tayari admin."
      foot={
        <>
          <p>Lost or replaced your phone? Ask a teammate to press “Reset two-step” next to your name on the People page.</p>
          <form action={signOut}>
            <button type="submit" className={styles.textButton}>
              Sign out
            </button>
          </form>
        </>
      }
    >
      <ActionForm action={verifyCode} submitLabel="Continue" pendingLabel="Checking…">
        <input type="hidden" name="next" value={next} />
        <TextField label="Six-digit code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" maxLength={7} autoFocus required />
      </ActionForm>
    </AuthCard>
  );
}
