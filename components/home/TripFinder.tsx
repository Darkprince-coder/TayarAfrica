import { Motif } from "@/components/ui/Motif";
import { cn } from "@/lib/cn";
import { LENGTH_OPTIONS, THEME_OPTIONS, WHERE_OPTIONS, type FinderQuery } from "@/lib/content/filter";
import styles from "./TripFinder.module.css";

const FIELDS = [
  { name: "where", label: "Where to", options: WHERE_OPTIONS },
  { name: "length", label: "For how long", options: LENGTH_OPTIONS },
  { name: "theme", label: "For what", options: THEME_OPTIONS },
] as const;

/**
 * Trip finder: three questions that filter tours and destinations on /explore. A dark glass strip
 * edged with the Tayari beadwork, set on the hero photograph (or on the results page, prefilled).
 * A plain GET form, so it works without JavaScript.
 */
export function TripFinder({ initial, variant = "hero" }: { initial?: FinderQuery; variant?: "hero" | "page" }) {
  return (
    <form action="/explore" method="get" className={cn(styles.finder, styles[variant])} aria-label="Find a trip">
      <span className={styles.edge}>
        <Motif size={10} />
      </span>
      <div className={styles.intro}>
        <p className={styles.kicker}>Find your trip</p>
        <p className={styles.title}>
          Three questions, <em>then the shortlist.</em>
        </p>
      </div>
      {FIELDS.map((f) => (
        <label key={f.name} className={styles.field}>
          <span className={styles.label}>{f.label}</span>
          <select name={f.name} defaultValue={initial?.[f.name] ?? ""} className={styles.select}>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      <button type="submit" className={styles.submit}>
        {variant === "page" ? "Update" : "Show me"}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  );
}
