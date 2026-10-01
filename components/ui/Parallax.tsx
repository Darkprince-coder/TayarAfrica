import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./Parallax.module.css";

/**
 * Subtle depth: the child drifts slowly as it scrolls through the viewport. Pure CSS
 * (scroll-driven animation), so it costs no JavaScript and is simply static in browsers
 * that lack support or when reduced motion is requested. Put it inside an element with
 * overflow: hidden, since the child is slightly scaled up to avoid exposing edges.
 */
export function Parallax({
  shift = "7%",
  scale = 1.18,
  className,
  children,
}: {
  shift?: string;
  scale?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn(styles.parallax, className)} style={{ "--shift": shift, "--scale": scale } as CSSProperties}>
      {children}
    </div>
  );
}
