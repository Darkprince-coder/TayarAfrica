import type { Metadata } from "next";
import { ActionForm } from "@/components/admin/ActionForm";
import { PageHead } from "@/components/admin/Shell";
import styles from "@/components/admin/Shell.module.css";
import { TextField } from "@/components/ui/Field";
import { requireStaff } from "@/lib/admin/session";
import { changePassword, updateName } from "../../auth-actions";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const me = await requireStaff();
  return (
    <>
      <PageHead title="My account" lead={`Signed in as ${me.email}.`} />

      <section className={styles.card} aria-labelledby="name-title">
        <h2 id="name-title" className={styles.cardTitle}>
          Your name
        </h2>
        <ActionForm action={updateName} submitLabel="Save name" variant="secondary">
          <TextField label="Name shown to the team" name="fullName" defaultValue={me.fullName} required />
        </ActionForm>
      </section>

      <section className={styles.card} aria-labelledby="password-title">
        <h2 id="password-title" className={styles.cardTitle}>
          Change your password
        </h2>
        <p className={styles.muted}>Use at least 10 characters. Forgotten it? Sign out and use “Forgot your password?”, or ask a teammate for a reset link.</p>
        <ActionForm action={changePassword} submitLabel="Change password" pendingLabel="Changing…" variant="secondary">
          <TextField label="Current password" name="current" type="password" autoComplete="current-password" required />
          <TextField label="New password" name="password" type="password" autoComplete="new-password" minLength={10} required />
          <TextField label="New password again" name="confirm" type="password" autoComplete="new-password" minLength={10} required />
        </ActionForm>
      </section>
    </>
  );
}
