import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    title: "Tell us",
    text: "Share when you want to travel, how many of you are going and what you would like to see. A short form or a WhatsApp message is enough.",
  },
  {
    title: "We plan",
    text: "We put together a proposed itinerary, arrange stays, transfers and activities with local providers, and explain what is and is not included.",
  },
  {
    title: "You experience",
    text: "You travel knowing who is meeting you and where you are going next, with a TAYARI contact to call if anything changes.",
  },
];

export function HowItWorks() {
  return (
    <Section tone="sand" labelledBy="process-title" id="how-it-works">
      <Container>
        <SectionHeading id="process-title" eyebrow="How it works" title="Three steps from idea to departure" />
        <Reveal as="div" variant="fade" className={styles.steps}>
          <span className={styles.line} aria-hidden="true" />
          <ol role="list" className={styles.list}>
            {steps.map((step, i) => (
              <li key={step.title} className={styles.step} style={{ "--n": i } as React.CSSProperties}>
                <span className={styles.number} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.text}>{step.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </Section>
  );
}
