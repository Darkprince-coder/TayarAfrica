"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { confirmTwoStep, startTwoStep, type TwoStepSetup as Setup } from "@/app/admin/auth-actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import adminStyles from "./Admin.module.css";
import styles from "./TwoStepSetup.module.css";

/** Turning two-step login on: scan the QR code, then confirm with the first code the app shows. */
export function TwoStepSetup() {
  const router = useRouter();
  const [setup, setSetup] = useState<Extract<Setup, { factorId: string }> | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [pending, start] = useTransition();

  const begin = () =>
    start(async () => {
      setMessage(null);
      const res = await startTwoStep();
      if ("error" in res) setMessage({ ok: false, text: res.error });
      else setSetup(res);
    });

  const confirm = (form: FormData) =>
    start(async () => {
      if (!setup) return;
      const res = await confirmTwoStep(setup.factorId, String(form.get("code") ?? ""));
      if (res?.error) return setMessage({ ok: false, text: res.error });
      setSetup(null);
      setMessage({ ok: true, text: res?.ok ?? "Two-step login is on." });
      router.refresh();
    });

  if (!setup) {
    return (
      <div className={adminStyles.form}>
        {message && <p className={message.ok ? adminStyles.ok : adminStyles.error} role={message.ok ? "status" : "alert"}>{message.text}</p>}
        {!message?.ok && (
          <Button type="button" variant="secondary" onClick={begin} disabled={pending}>
            {pending ? "Preparing…" : "Turn on two-step login"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <form action={confirm} className={styles.setup}>
      <ol className={styles.steps}>
        <li>
          Install an authenticator app on your phone if you do not have one: Google Authenticator, Microsoft Authenticator or 1Password all work.
        </li>
        <li>
          In the app, add an account and scan this code.
          <span className={styles.qr}>
            {/* An SVG data URL from Supabase; next/image adds nothing here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={setup.qr} alt="QR code to scan with your authenticator app" width={180} height={180} />
          </span>
          {showKey ? (
            <span className={styles.key}>
              Or type this key into the app: <code>{setup.secret.match(/.{1,4}/g)?.join(" ")}</code>
            </span>
          ) : (
            <button type="button" className={adminStyles.textButton} onClick={() => setShowKey(true)}>
              Cannot scan? Show a key to type instead
            </button>
          )}
        </li>
        <li>
          Type the six-digit code the app now shows for Tayari admin.
          <TextField label="Six-digit code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" maxLength={7} required />
        </li>
      </ol>
      {message && !message.ok && (
        <p className={adminStyles.error} role="alert">
          {message.text}
        </p>
      )}
      <div className={styles.actions}>
        <Button type="submit" disabled={pending}>
          {pending ? "Checking…" : "Confirm and turn on"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setSetup(null);
            setMessage(null);
          }}
          disabled={pending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
