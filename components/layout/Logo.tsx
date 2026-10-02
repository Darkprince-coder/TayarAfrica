import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import styles from "./Logo.module.css";

/**
 * Emblem (map of Africa + acacia) plus a text wordmark echoing the logo: "Tayari" in the
 * display serif over a spaced "Africa Tours". The wordmark is live text (sharper, selectable,
 * easy to change) so only the emblem image depends on the logo file.
 */
export function Logo({ tone = "dark", className, onClick }: { tone?: "dark" | "light"; className?: string; onClick?: () => void }) {
  const emblem = tone === "light" ? "/brand/logo-emblem-light.png" : "/brand/logo-emblem.png";
  return (
    <Link href="/" className={cn(styles.logo, tone === "light" && styles.light, className)} aria-label="Tayari Africa Tours, home" onClick={onClick}>
      <Image src={emblem} alt="" width={96} height={104} className={styles.emblem} priority />
      <span className={styles.word}>
        <span className={styles.name}>Tayari</span>
        <span className={styles.sub}>Africa Tours</span>
      </span>
    </Link>
  );
}
