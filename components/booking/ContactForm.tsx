"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { submitContact } from "@/app/(site)/contact/actions";
import { Button } from "@/components/ui/Button";
import { CheckboxField, TextAreaField, TextField } from "@/components/ui/Field";
import { fieldErrors as toFieldErrors } from "@/lib/validation/common";
import { contactSchema, emptyContact, type ContactFormValues } from "@/lib/validation/contact";
import { SuccessPanel } from "./SuccessPanel";
import form from "./Form.module.css";

const SEND_TIMEOUT_MS = 45_000;

export function ContactForm({ whatsapp }: { whatsapp: string }) {
  const [values, setValues] = useState<ContactFormValues>(emptyContact);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [slow, setSlow] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const submittingRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  function set<K extends keyof ContactFormValues>(name: K, value: ContactFormValues[K]) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => {
      if (!(name in e)) return e;
      const rest = { ...e };
      delete rest[name as string];
      return rest;
    });
  }
  const field = (name: keyof ContactFormValues) => ({
    name,
    value: values[name] as string,
    error: errors[name],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(name, e.target.value as never),
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;

    const parsed = contactSchema.safeParse({ ...values, startedAt, idempotencyKey });
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");
    setFailure(null);
    const slowTimer = window.setTimeout(() => setSlow(true), 6000);
    try {
      const timeout = new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error("timeout")), SEND_TIMEOUT_MS));
      const result = await Promise.race([submitContact({ ...values, startedAt, idempotencyKey }), timeout]);
      if (result.ok) {
        setReference(result.reference);
        setStatus("success");
        return;
      }
      setStatus("idle");
      setFailure(result.message);
      if (result.fieldErrors) setErrors(result.fieldErrors);
    } catch {
      setStatus("idle");
      setFailure("We could not reach the server. Your message is still here, so you can try again.");
    } finally {
      window.clearTimeout(slowTimer);
      setSlow(false);
      submittingRef.current = false;
    }
  }

  if (status === "success") {
    return (
      <SuccessPanel
        title="Message received."
        reference={reference}
        actions={[{ label: "Plan a trip", href: "/plan-your-journey" }, { label: "Back to home", href: "/", variant: "secondary" }]}
      >
        <p>Thank you, {values.fullName.trim().split(/\s+/)[0]}. A Tayari team member will reply to {values.email}.</p>
      </SuccessPanel>
    );
  }

  const submitting = status === "submitting";

  return (
    <form ref={formRef} className={form.card} onSubmit={onSubmit} noValidate aria-busy={submitting}>
      <TextField label="Full name" required autoComplete="name" {...field("fullName")} />
      <div className={form.row2}>
        <TextField label="Email" type="email" required autoComplete="email" inputMode="email" {...field("email")} />
        <TextField label="Phone or WhatsApp" type="tel" autoComplete="tel" inputMode="tel" {...field("phone")} />
      </div>
      <TextAreaField label="Your message" required {...field("message")} />
      <CheckboxField name="consent" required checked={values.consent} onChange={(c) => set("consent", c)} error={errors.consent}>
        I agree that Tayari may contact me about this message.
      </CheckboxField>

      <div className={form.trap} aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <div className={form.status} aria-live="polite">
        {submitting && slow && <p className={form.slow}>This is taking longer than usual. Please keep this page open while we send it.</p>}
        {failure && (
          <div className={form.failure} role="alert">
            <strong>{failure}</strong>
            <div className={form.failureActions}>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                Message us on WhatsApp instead
              </a>
            </div>
          </div>
        )}
      </div>

      <div className={`${form.actions} ${form.actionsEnd}`}>
        <Button type="submit" size="lg" disabled={submitting} aria-disabled={submitting}>
          {submitting ? (
            <>
              <span className={form.spinner} aria-hidden="true" /> Sending…
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </div>
    </form>
  );
}
