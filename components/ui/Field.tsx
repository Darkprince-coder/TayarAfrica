import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import styles from "./Field.module.css";

type ShellProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (a11y: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
};

/** Wires label, hint and error to the control so validation is announced to assistive tech. */
function FieldShell({ label, hint, error, required, children }: ShellProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : <span className={styles.optional}> (optional)</span>}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type Base = { label: string; hint?: string; error?: string };

export function TextField({
  label,
  hint,
  error,
  required,
  className,
  ...props
}: Base & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "aria-describedby" | "aria-invalid">) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(styles.control, className)}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  required,
  className,
  ...props
}: Base & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "aria-describedby" | "aria-invalid">) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          rows={5}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(styles.control, styles.textarea, className)}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  required,
  options,
  placeholder,
  className,
  ...props
}: Base & {
  options: { value: string; label: string }[];
  placeholder?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "aria-describedby" | "aria-invalid" | "children">) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(styles.control, styles.select, className)}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

/** Pill-style radio / checkbox group — large touch targets for one-handed mobile use. */
export function ChoiceChips({
  legend,
  name,
  type,
  options,
  hint,
  error,
  defaultValue = [],
}: {
  legend: string;
  name: string;
  type: "radio" | "checkbox";
  options: { value: string; label: string }[];
  hint?: string;
  error?: string;
  defaultValue?: string[];
}) {
  const id = useId();
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset className={styles.fieldset} aria-describedby={describedBy} aria-invalid={Boolean(error) || undefined}>
      <legend className={styles.label}>{legend}</legend>
      <div className={styles.chips}>
        {options.map((o) => (
          <label key={o.value} className={styles.chip}>
            <input type={type} name={name} value={o.value} defaultChecked={defaultValue.includes(o.value)} className={styles.chipInput} />
            <span className={styles.chipLabel}>{o.label}</span>
          </label>
        ))}
      </div>
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function CheckboxField({
  name,
  error,
  required,
  children,
}: {
  name: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label className={styles.check}>
        <input
          type="checkbox"
          name={name}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span>{children}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
