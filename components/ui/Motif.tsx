import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import styles from "./Motif.module.css";

/**
 * Tayari pattern: an original, simplified take on East African beadwork (diamonds, dots and
 * zigzags). It is drawn as a mask, so it takes the surrounding text colour, scales cleanly and
 * costs one tiny inline image. Purely decorative.
 */
export function Motif({
  variant = "diamonds",
  size = 16,
  align = "full",
  className,
}: {
  variant?: "diamonds" | "zigzag";
  /** Height in px. */
  size?: number;
  /** full: spans the width. center: a short ornament. */
  align?: "full" | "center";
  className?: string;
}) {
  return (
    <span
      className={cn(styles.motif, styles[variant], align === "center" && styles.center, className)}
      style={{ "--motif-size": `${size}px` } as CSSProperties}
      aria-hidden="true"
    />
  );
}
