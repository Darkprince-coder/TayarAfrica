"use client";

import { Fragment, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./SuccessPanel.module.css";

type Props = {
  /** Words of the headline, animated one by one. */
  title: string;
  /** What we are telling the visitor, in plain words. */
  children: React.ReactNode;
  reference: string;
  nextSteps?: string[];
  actions?: { label: string; href: string; variant?: "primary" | "light" | "secondary" }[];
};

/**
 * Shown after a successful send. It always says "request received", never "booking confirmed",
 * because nothing is booked until Tayari and the traveller agree a plan.
 */
export function SuccessPanel({ title, children, reference, nextSteps, actions }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  return (
    <div className={styles.panel}>
      <svg className={styles.check} width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <circle className={styles.ring} cx="36" cy="36" r="33" stroke="currentColor" strokeWidth="2" />
        <path className={styles.tick} d="m22 37 10 10 18-21" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <h2 ref={headingRef} tabIndex={-1} className={styles.title}>
        {title.split(" ").map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className={styles.word}>
              <span className={styles.inner} style={{ "--i": i } as React.CSSProperties}>
                {word}
              </span>
            </span>{" "}
          </Fragment>
        ))}
      </h2>

      <div className={styles.body}>{children}</div>

      <p className={styles.ref}>
        Reference <strong>{reference}</strong>
      </p>

      {nextSteps && nextSteps.length > 0 && (
        <ol role="list" className={styles.steps}>
          {nextSteps.map((s, i) => (
            <li key={s}>
              <span aria-hidden="true">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      )}

      {actions && (
        <div className={styles.actions}>
          {actions.map((a) => (
            <Button key={a.href} href={a.href} variant={a.variant ?? "primary"}>
              {a.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
