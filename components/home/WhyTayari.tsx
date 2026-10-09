import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Container, Section } from "@/components/ui/Section";
import styles from "./WhyTayari.module.css";

/** Plain commitments, no awards or statistics. Each reads as a statement first, explanation second. */
const reasons = [
  {
    title: "Planned for you, not from a brochure.",
    text: "We start from your dates, your group and your budget, and build the trip from there.",
  },
  {
    title: "Handled on the ground.",
    text: "Stays, drivers, guides and park fees are arranged with providers we work with in each country.",
  },
  {
    title: "Straight answers.",
    text: "Every quote says what is included and what is not. If something does not suit the season, we will say so.",
  },
  {
    title: "Easy to change.",
    text: "Another night by the river, a beach at the end, a slower pace. We reshape the plan around you.",
  },
  {
    title: "A person on the other end.",
    text: "You write to people, not a booking engine, and our WhatsApp line is open day and night while you travel.",
  },
];

/** Why travel with us: type and spacing carry it. No cards, no icons. */
export function WhyTayari() {
  return (
    <Section tone="forest" labelledBy="why-title">
      <Container>
        <div className={styles.layout}>
          <div className={styles.head}>
            <Reveal variant="fade">
              <p className={styles.kicker}>Why travel with us</p>
            </Reveal>
            <RevealText as="h2" id="why-title" className={styles.heading} text="We handle the details. *You keep the view.*" delay={120} />
          </div>

          <ul role="list" className={styles.list}>
            {reasons.map((r, i) => (
              <Reveal as="li" key={r.title} delay={i * 110} className={styles.item}>
                <h3 className={styles.title}>{r.title}</h3>
                <p className={styles.text}>{r.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
