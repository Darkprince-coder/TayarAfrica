import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Container, Section } from "@/components/ui/Section";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    title: "Tell us",
    text: "Roughly when, roughly where, and who is coming. A short form or a WhatsApp message is enough to start.",
  },
  {
    title: "We plan",
    text: "We come back with a route, places to stay and a quote that says what is included. You change whatever you like.",
  },
  {
    title: "You experience",
    text: "You travel knowing who meets you and where you go next, with our WhatsApp line open day and night if anything changes.",
  },
];

/**
 * A quiet pause between the travel sections and the practical ones: one line, three steps on a
 * single hairline. Deliberately plain.
 */
export function HowItWorks({ id = "how-it-works" }: { id?: string }) {
  return (
    <Section tone="bone" labelledBy="process-title" id={id}>
      <Container>
        <div className={styles.head}>
          <Reveal variant="fade">
            <p className={styles.kicker}>How it works</p>
          </Reveal>
          <RevealText as="h2" id="process-title" className={styles.heading} text="You say where. *We get you there.*" delay={120} />
        </div>

        <ol role="list" className={styles.list}>
          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={200 + i * 160} className={styles.step}>
              <span className={styles.dot} aria-hidden="true" style={{ "--i": i } as CSSProperties} />
              <p className={styles.number} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
