import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./Badge.module.css";

/** Small label. `sample` is used to flag demo content so it is never mistaken for real. */
export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "sample" | "dark"; children: ReactNode }) {
  return <span className={cn(styles.badge, styles[tone])}>{children}</span>;
}
