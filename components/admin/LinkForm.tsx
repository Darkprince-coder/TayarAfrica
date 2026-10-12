"use client";

import { useActionState, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import type { LinkState } from "@/app/admin/(panel)/people/actions";
import admin from "./Admin.module.css";
import styles from "./Shell.module.css";

/** A server-action form whose result may include a link to copy and send (invites, resets). */
export function LinkForm({
  action,
  submitLabel,
  pendingLabel = "Working…",
  variant = "primary",
  confirm,
  children,
}: {
  action: (state: LinkState, form: FormData) => Promise<LinkState>;
  submitLabel: string;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "ghost";
  /** Asks before submitting, e.g. before removing someone. */
  confirm?: string;
  children?: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [copied, setCopied] = useState(false);
  return (
    <form
      action={formAction}
      className={admin.form}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {children}
      <div className={styles.row}>
        <Button type="submit" variant={variant} disabled={pending}>
          {pending ? pendingLabel : submitLabel}
        </Button>
      </div>
      {state?.error && (
        <p className={admin.error} role="alert">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <div className={state.link ? styles.linkBox : admin.ok} role="status">
          <span>{state.ok}</span>
          {state.link && (
            <>
              <code>{state.link}</code>
              <div className={styles.row}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={async () => {
                    await navigator.clipboard.writeText(state.link!);
                    setCopied(true);
                  }}
                >
                  {copied ? "Copied" : "Copy link"}
                </Button>
                <a href={`https://wa.me/?text=${encodeURIComponent(`Your Tayari admin link: ${state.link}`)}`} target="_blank" rel="noopener noreferrer">
                  Send on WhatsApp
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </form>
  );
}
