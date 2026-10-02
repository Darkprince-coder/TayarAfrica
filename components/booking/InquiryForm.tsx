"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { submitInquiry } from "@/app/(site)/plan-your-journey/actions";
import { Button } from "@/components/ui/Button";
import { CheckboxField, ChoiceChips, SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { fieldErrors as toFieldErrors } from "@/lib/validation/common";
import {
  aboutSchema,
  detailsSchema,
  emptyInquiry,
  STEP_FIELDS,
  tripSchema,
  type InquiryFormValues,
} from "@/lib/validation/inquiry";
import { ACCOMMODATION, CONTACT_PREFERENCES, DURATIONS, EXPERIENCE_TYPES } from "@/lib/validation/options";
import type { ImageRef } from "@/lib/content/types";
import { Stepper } from "./Stepper";
import { SuccessPanel } from "./SuccessPanel";
import { TripSummary } from "./TripSummary";
import form from "./Form.module.css";
import styles from "./InquiryForm.module.css";

/** `length` is pre-formatted, e.g. "3 days, 2 nights" or "Flexible length"; `days` is null for made-to-order tours. */
export type PackageOption = { slug: string; title: string; days: number | null; length: string; types: string[]; cover: ImageRef };
type Props = {
  packages: PackageOption[];
  destinations: { slug: string; name: string }[];
  initialPackage: string;
  initialDestination: string;
  /** Today as YYYY-MM-DD, computed on the server so the date picker's minimum matches the server check. */
  today: string;
  whatsapp: string;
};

const STEPS = ["The trip", "The details", "About you"];
const SCHEMAS = [tripSchema, detailsSchema, aboutSchema];
const SEND_TIMEOUT_MS = 45_000;

type Status = "idle" | "submitting" | "success";
type Failure = { message: string; code: "validation" | "busy" | "unavailable" };

function subset(values: InquiryFormValues, keys: readonly string[]) {
  return Object.fromEntries(keys.map((k) => [k, (values as Record<string, unknown>)[k]]));
}

export function InquiryForm({ packages, destinations, initialPackage, initialDestination, today, whatsapp }: Props) {
  const startPackage = packages.find((p) => p.slug === initialPackage);
  const [values, setValues] = useState<InquiryFormValues>(() => ({
    ...emptyInquiry,
    packageSlug: startPackage?.slug ?? "",
    destinationSlug: destinations.some((d) => d.slug === initialDestination) ? initialDestination : "",
    experienceTypes: startPackage ? startPackage.types.filter((t) => (EXPERIENCE_TYPES as readonly string[]).includes(t)) : [],
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [status, setStatus] = useState<Status>("idle");
  const [slow, setSlow] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [reference, setReference] = useState("");

  // Stable for this visit: lets the server ignore a double send.
  const [startedAt] = useState(() => Date.now());
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const submittingRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  const selectedPackage = packages.find((p) => p.slug === values.packageSlug);
  const selectedDestination = destinations.find((d) => d.slug === values.destinationSlug);

  // Move focus to the new step's heading so keyboard and screen reader users land in the right place.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    formRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step]);

  function set<K extends keyof InquiryFormValues>(name: K, value: InquiryFormValues[K]) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => {
      if (!(name in e)) return e;
      const rest = { ...e };
      delete rest[name as string];
      return rest;
    });
  }

  const field = (name: keyof InquiryFormValues) => ({
    name,
    value: values[name] as string,
    error: errors[name],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => set(name, e.target.value as never),
  });

  function validate(index: number): Record<string, string> {
    const result = SCHEMAS[index].safeParse(subset(values, STEP_FIELDS[index]));
    return result.success ? {} : toFieldErrors(result.error);
  }

  function focusFirstInvalid() {
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      const target = el?.tagName === "FIELDSET" ? el.querySelector<HTMLElement>("input") : el;
      target?.focus();
    });
  }

  function goTo(index: number, dir: "forward" | "back") {
    setDirection(dir);
    setStep(index);
  }

  function next() {
    const found = validate(step);
    if (Object.keys(found).length) {
      setErrors(found);
      focusFirstInvalid();
      return;
    }
    setErrors({});
    goTo(step + 1, "forward");
  }

  async function send() {
    if (submittingRef.current) return;

    // Check every step again (in case someone skipped around), then jump to the first problem.
    for (let i = 0; i < SCHEMAS.length; i++) {
      const found = validate(i);
      if (Object.keys(found).length) {
        setErrors(found);
        if (i !== step) goTo(i, "back");
        focusFirstInvalid();
        return;
      }
    }

    submittingRef.current = true;
    setStatus("submitting");
    setFailure(null);
    const slowTimer = window.setTimeout(() => setSlow(true), 6000);

    try {
      const timeout = new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error("timeout")), SEND_TIMEOUT_MS));
      const result = await Promise.race([submitInquiry({ ...values, startedAt, idempotencyKey }), timeout]);

      if (result.ok) {
        setReference(result.reference);
        setStatus("success");
        return;
      }
      setStatus("idle");
      setFailure({ message: result.message, code: result.code });
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
        const bad = STEP_FIELDS.findIndex((keys) => keys.some((k) => result.fieldErrors?.[k]));
        if (bad >= 0) goTo(bad, "back");
        focusFirstInvalid();
      }
    } catch {
      // Network drop or a very slow server. The same key makes a retry safe.
      setStatus("idle");
      setFailure({ message: "We could not reach the server. Your details are still here, so you can try again.", code: "unavailable" });
    } finally {
      window.clearTimeout(slowTimer);
      setSlow(false);
      submittingRef.current = false;
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    if (step < STEPS.length - 1) next();
    else void send();
  }

  if (status === "success") {
    const firstName = values.fullName.trim().split(/\s+/)[0];
    return (
      <div className={styles.done}>
        <SuccessPanel
          title="Your African journey starts here."
          reference={reference}
          nextSteps={[
            "We read your request and may come back with a few questions.",
            "We send you a proposed itinerary and a quote.",
            "We adjust the plan with you until it feels right.",
          ]}
          actions={[
            { label: "Explore destinations", href: "/destinations" },
            { label: "Back to home", href: "/", variant: "secondary" },
          ]}
        >
          <p>
            Thank you, {firstName}. We have received your trip request, and a Tayari consultant will contact you by{" "}
            {values.contactPreference === "whatsapp" ? "WhatsApp" : values.contactPreference === "phone" ? "phone" : "email"} to talk through the details.
          </p>
          <p>This is a request, not a booking. Nothing is confirmed until we agree a plan with you.</p>
        </SuccessPanel>
      </div>
    );
  }

  const waText = encodeURIComponent(
    `Hello Tayari, I tried to send a trip request${selectedPackage ? ` for "${selectedPackage.title}"` : ""} but it did not go through.`,
  );
  const submitting = status === "submitting";

  return (
    <div className={styles.layout}>
      <form ref={formRef} className={form.form} onSubmit={onSubmit} noValidate aria-busy={submitting}>
        <Stepper steps={STEPS} current={step} onJump={(i) => goTo(i, "back")} />

        <div className={form.card}>
          {/* key re-runs the entrance animation for each step */}
          <div key={step} className={form.stepBody} data-dir={direction === "back" ? "back" : undefined}>
            {step === 0 && (
              <>
                <header className={form.stepHead}>
                  <h2 ref={headingRef} tabIndex={-1} className={form.stepTitle}>
                    What kind of trip do you have in mind?
                  </h2>
                  <p className={form.stepLead}>Rough ideas are fine. You can change anything later.</p>
                </header>

                <SelectField
                  label="A trip you like the look of"
                  {...field("packageSlug")}
                  onChange={(e) => {
                    const slug = e.target.value;
                    const pkg = packages.find((p) => p.slug === slug);
                    setValues((v) => ({
                      ...v,
                      packageSlug: slug,
                      destinationSlug: slug ? "" : v.destinationSlug,
                      experienceTypes: pkg && v.experienceTypes.length === 0 ? pkg.types.filter((t) => (EXPERIENCE_TYPES as readonly string[]).includes(t)) : v.experienceTypes,
                    }));
                  }}
                  placeholder="No specific trip yet"
                  options={packages.map((p) => ({ value: p.slug, label: p.days ? `${p.title} (${p.days} days)` : p.title }))}
                  hint="Optional. Choose one of our sample trips as a starting point."
                />

                {selectedPackage && (
                  <div className={form.selected}>
                    <ImageFrame src={selectedPackage.cover.src} alt="" ratio="4 / 3" sizes="96px" className={form.selectedImg} focus={selectedPackage.cover.focus} focusMobile={selectedPackage.cover.focusMobile} />
                    <div>
                      <p className={form.selectedTitle}>{selectedPackage.title}</p>
                      <p className={form.selectedMeta}>{selectedPackage.length}</p>
                    </div>
                    <button type="button" className={form.linkButton} onClick={() => set("packageSlug", "")}>
                      Remove
                    </button>
                  </div>
                )}

                {!selectedPackage && (
                  <SelectField
                    label="Where would you like to go?"
                    {...field("destinationSlug")}
                    placeholder="Not sure yet"
                    options={destinations.map((d) => ({ value: d.slug, label: d.name }))}
                    hint="Optional."
                  />
                )}

                <ChoiceChips
                  legend="What would you like from the trip?"
                  name="experienceTypes"
                  type="checkbox"
                  options={EXPERIENCE_TYPES.map((t) => ({ value: t, label: t }))}
                  value={values.experienceTypes}
                  onChange={(v) => set("experienceTypes", v)}
                  error={errors.experienceTypes}
                  hint="Pick as many as you like."
                />

                <ChoiceChips
                  legend="Where would you like to stay?"
                  name="accommodation"
                  type="radio"
                  options={ACCOMMODATION.map((a) => ({ value: a.value, label: a.label }))}
                  value={[values.accommodation]}
                  onChange={([v]) => set("accommodation", v)}
                  error={errors.accommodation}
                />
              </>
            )}

            {step === 1 && (
              <>
                <header className={form.stepHead}>
                  <h2 ref={headingRef} tabIndex={-1} className={form.stepTitle}>
                    When and who?
                  </h2>
                  <p className={form.stepLead}>An approximate idea is enough. We will confirm dates with you.</p>
                </header>

                <div className={form.row2}>
                  <TextField label="Number of travellers" type="number" inputMode="numeric" min={1} max={50} required {...field("travelers")} />
                  <SelectField label="How long?" required {...field("duration")} options={DURATIONS.map((d) => ({ value: d.value, label: d.label }))} />
                </div>

                <TextField label="Preferred start date" type="date" min={today} {...field("startDate")} hint="Leave blank if you are still deciding." />
                <CheckboxField name="flexibleDates" checked={values.flexibleDates} onChange={(c) => set("flexibleDates", c)}>
                  My dates are flexible
                </CheckboxField>

                <TextAreaField
                  label="Anything else we should know?"
                  {...field("message")}
                  hint="Places you want to see, special occasions, mobility needs, budget range."
                />
              </>
            )}

            {step === 2 && (
              <>
                <header className={form.stepHead}>
                  <h2 ref={headingRef} tabIndex={-1} className={form.stepTitle}>
                    How can we reach you?
                  </h2>
                  <p className={form.stepLead}>We only use these details to reply to this request.</p>
                </header>

                <TextField label="Full name" required autoComplete="name" {...field("fullName")} />
                <div className={form.row2}>
                  <TextField label="Email" type="email" required autoComplete="email" inputMode="email" {...field("email")} />
                  <TextField label="Phone or WhatsApp" type="tel" autoComplete="tel" inputMode="tel" {...field("phone")} hint="Include the country code." />
                </div>
                <TextField label="Country you live in" required autoComplete="country-name" {...field("country")} />

                <ChoiceChips
                  legend="How would you like us to contact you?"
                  name="contactPreference"
                  type="radio"
                  options={CONTACT_PREFERENCES.map((c) => ({ value: c.value, label: c.label }))}
                  value={[values.contactPreference]}
                  onChange={([v]) => set("contactPreference", v)}
                  error={errors.contactPreference}
                />

                <CheckboxField name="consent" required checked={values.consent} onChange={(c) => set("consent", c)} error={errors.consent}>
                  I agree that Tayari may contact me about this request. See the{" "}
                  <Link href="/privacy" target="_blank">
                    privacy policy
                  </Link>
                  .
                </CheckboxField>

                {/* Honeypot: invisible to people. */}
                <div className={form.trap} aria-hidden="true">
                  <label>
                    Website
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
                  </label>
                </div>
              </>
            )}
          </div>

          <div className={form.status} aria-live="polite">
            {submitting && slow && <p className={form.slow}>This is taking longer than usual. Please keep this page open while we send it.</p>}
            {failure && (
              <div className={form.failure} role="alert">
                <strong>{failure.message}</strong>
                {failure.code !== "validation" && (
                  <div className={form.failureActions}>
                    {failure.code === "unavailable" && (
                      <Button type="button" onClick={() => void send()} disabled={submitting}>
                        Try again
                      </Button>
                    )}
                    <a href={`https://wa.me/${whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer">
                      Message us on WhatsApp instead
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`${form.actions} ${step === 0 ? form.actionsEnd : ""}`}>
            {step > 0 && (
              <Button type="button" variant="ghost" onClick={() => goTo(step - 1, "back")} disabled={submitting}>
                Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button type="submit" size="lg" arrow>
                Continue
              </Button>
            ) : (
              <Button type="submit" size="lg" disabled={submitting} aria-disabled={submitting}>
                {submitting ? (
                  <>
                    <span className={form.spinner} aria-hidden="true" /> Sending…
                  </>
                ) : (
                  "Send My Trip Request"
                )}
              </Button>
            )}
          </div>
        </div>
      </form>

      <div className={styles.aside}>
        <TripSummary values={values} lookup={{ packageTitle: selectedPackage?.title, destinationName: selectedDestination?.name }} />
      </div>
    </div>
  );
}
