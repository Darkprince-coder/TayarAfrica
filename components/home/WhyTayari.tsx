import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import styles from "./WhyTayari.module.css";

/** DEMO COPY: replace with Tayari's own commitments before launch. No awards or statistics are claimed. */
const reasons = [
  {
    title: "You talk to people",
    text: "Questions go to a Tayari consultant who knows your plans, not to a booking form.",
  },
  {
    title: "Honest about what is included",
    text: "Each itinerary lists what the price covers and what it does not, so there are no surprises later.",
  },
  {
    title: "Built around your dates",
    text: "We start from your dates, group and budget, then suggest stays and activities that fit.",
  },
  {
    title: "Local arrangements handled",
    text: "Transfers, accommodation and activities are arranged with established providers in each destination.",
  },
];

export function WhyTayari() {
  return (
    <Section tone="forest" edge labelledBy="why-title">
      <Container>
        <div className={styles.grid}>
          <SectionHeading
            id="why-title"
            eyebrow="04 / Why Tayari"
            title="A trip is easier when *one team* looks after it"
            lead="Kenya has a lot to offer and a lot of moving parts. We take care of the parts so you can enjoy the place."
          />
          <ul role="list" className={styles.list}>
            {reasons.map((r, i) => (
              <Reveal as="li" key={r.title} delay={i * 130} className={styles.item}>
                <span className={styles.index} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className={styles.title}>{r.title}</h3>
                  <p className={styles.text}>{r.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
