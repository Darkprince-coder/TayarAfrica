import { Button } from "@/components/ui/Button";
import styles from "../not-found.module.css";

/**
 * "Not found" inside the site (a tour or destination that was removed or renamed, an old link).
 * The site layout already provides the navigation, footer and <main>, so this is a section only;
 * the root app/not-found.tsx stays for addresses outside the site.
 */
export default function SiteNotFound() {
  return (
    <section className={`${styles.page} ${styles.inSite}`} aria-labelledby="not-found-title">
      <p className={styles.code}>404</p>
      <h1 id="not-found-title" className={styles.title}>
        This path leads nowhere.
      </h1>
      <p className={styles.text}>The page you were looking for has moved or does not exist. Let us get you back on the route.</p>
      <div className={styles.actions}>
        <Button href="/" size="lg" arrow>
          Back to home
        </Button>
        <Button href="/destinations" variant="light" size="lg">
          Browse destinations
        </Button>
      </div>
    </section>
  );
}
