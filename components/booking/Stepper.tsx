import { cn } from "@/lib/cn";
import styles from "./Stepper.module.css";

/** Progress through the form. Earlier steps can be revisited; later ones open via Next. */
export function Stepper({ steps, current, onJump }: { steps: string[]; current: number; onJump: (index: number) => void }) {
  return (
    <nav aria-label="Progress" className={styles.stepper}>
      <ol role="list" className={styles.list}>
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className={cn(styles.item, done && styles.done, active && styles.active)}>
              {done ? (
                <button type="button" className={styles.step} onClick={() => onJump(i)} aria-label={`Go back to step ${i + 1}: ${label}`}>
                  <span className={styles.dot} aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="m5 12 5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className={styles.label}>{label}</span>
                </button>
              ) : (
                <span className={styles.step} aria-current={active ? "step" : undefined}>
                  <span className={styles.dot} aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className={styles.label}>{label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.barFill} style={{ transform: `scaleX(${(current + 1) / steps.length})` }} />
      </div>
      <p className="visually-hidden">
        Step {current + 1} of {steps.length}: {steps[current]}
      </p>
    </nav>
  );
}
