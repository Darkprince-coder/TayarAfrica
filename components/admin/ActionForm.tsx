"use client";

import { useActionState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import type { FormState } from "@/app/admin/auth-actions";
import styles from "./Admin.module.css";

/**
 * A server-action form with a pending button and one message line (error or success).
 * Fields are plain children, so pages stay server-rendered.
 */
export function ActionForm({
  action,
  submitLabel,
  pendingLabel = "Working…",
  children,
  variant = "primary",
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  submitLabel: string;
  pendingLabel?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className={styles.form}>
      {children}
      {state?.error && (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className={styles.ok} role="status">
          {state.ok}
        </p>
      )}
      <Button type="submit" variant={variant} disabled={pending} fullWidth={variant === "primary"}>
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
