import type { Metadata } from "next";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import styles from "./not-found.module.css";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className={styles.page}>
      <Logo tone="light" />
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>This path leads nowhere.</h1>
      <p className={styles.text}>The page you were looking for has moved or does not exist. Let us get you back on the route.</p>
      <div className={styles.actions}>
        <Button href="/" size="lg" arrow>
          Back to home
        </Button>
        <Button href="/destinations" variant="light" size="lg">
          Browse destinations
        </Button>
      </div>
    </main>
  );
}
