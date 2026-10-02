import { Reveal } from "@/components/ui/Reveal";
import type { ItineraryDay } from "@/lib/content/types";
import styles from "./Timeline.module.css";

/**
 * Vertical day-by-day itinerary. Each day eases in as it scrolls into view and draws the line down to the next.
 * `label` names each entry ("Day" for itineraries, "Step" for the custom-tour process).
 */
export function Timeline({ days, label = "Day" }: { days: ItineraryDay[]; label?: string }) {
  return (
    <ol role="list" className={styles.timeline}>
      {days.map((d, i) => (
        <Reveal as="li" key={d.day} delay={i % 2 === 0 ? 0 : 80} className={styles.day}>
          <span className={styles.marker} aria-hidden="true">
            {d.day}
          </span>
          <span className={styles.line} aria-hidden="true" />
          <div className={styles.body}>
            <p className={styles.label}>
              {label} {d.day}
            </p>
            <h3 className={styles.title}>{d.title}</h3>
            <p className={styles.text}>{d.description}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
