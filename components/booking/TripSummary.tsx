import { ACCOMMODATION, DURATIONS, labelFor } from "@/lib/validation/options";
import type { InquiryFormValues } from "@/lib/validation/inquiry";
import styles from "./TripSummary.module.css";

type Lookup = { packageTitle?: string; destinationName?: string };

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** "Your request so far": reassures people that their choices are captured. Shown beside the form on wide screens. */
export function TripSummary({ values, lookup }: { values: InquiryFormValues; lookup: Lookup }) {
  const rows: [string, string][] = [];
  if (lookup.packageTitle) rows.push(["Trip", lookup.packageTitle]);
  else if (lookup.destinationName) rows.push(["Destination", lookup.destinationName]);
  if (values.experienceTypes.length) rows.push(["Kind of trip", values.experienceTypes.join(", ")]);
  rows.push(["Stay", labelFor(ACCOMMODATION, values.accommodation)]);
  if (values.travelers) rows.push(["Travellers", values.travelers]);
  if (values.startDate) rows.push(["Starting", formatDate(values.startDate) + (values.flexibleDates ? " (flexible)" : "")]);
  if (values.arrival === "flights" && values.departureCity.trim()) rows.push(["Flights from", values.departureCity.trim()]);
  if (values.arrival === "pickup" && values.pickupPoint.trim()) rows.push(["Meet at", values.pickupPoint.trim()]);
  else if (values.flexibleDates) rows.push(["Dates", "Flexible"]);
  if (values.duration !== "not-sure") rows.push(["Length", labelFor(DURATIONS, values.duration)]);

  return (
    <aside className={styles.summary} aria-label="Your request so far">
      <h2 className={styles.title}>Your request so far</h2>
      <dl className={styles.list}>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.note}>This is a request, not a booking. We reply with a plan and a quote, and nothing is confirmed until you agree to it.</p>
    </aside>
  );
}
