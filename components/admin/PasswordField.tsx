"use client";

import { useState, type ComponentProps } from "react";
import { TextField } from "@/components/ui/Field";
import styles from "./PasswordField.module.css";

/** A password box with a Show / Hide button, for people who prefer to see what they type. */
export function PasswordField(props: Omit<ComponentProps<typeof TextField>, "type" | "className" | "hint" | "error">) {
  const [shown, setShown] = useState(false);
  return (
    <div className={styles.wrap}>
      <TextField {...props} type={shown ? "text" : "password"} className={styles.input} autoCapitalize="none" autoCorrect="off" spellCheck={false} />
      <button
        type="button"
        className={styles.toggle}
        aria-pressed={shown}
        aria-label={shown ? `Hide ${props.label.toLowerCase()}` : `Show ${props.label.toLowerCase()}`}
        onClick={() => setShown((v) => !v)}
      >
        {shown ? "Hide" : "Show"}
      </button>
    </div>
  );
}
