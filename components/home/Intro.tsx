import { Button } from "@/components/ui/Button";
import { Motif } from "@/components/ui/Motif";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Container, Section } from "@/components/ui/Section";
import styles from "./Intro.module.css";

/** A single big sentence on its own: the first quiet beat after the hero. */
export function Intro() {
  return (
    <Section tone="bone" size="lg" labelledBy="intro-title">
      <Container>
        <div className={styles.stage}>
          <Reveal variant="fade">
            <div className={styles.ornament}>
              <Motif size={14} />
            </div>
          </Reveal>
          <RevealText
            as="h2"
            id="intro-title"
            className={styles.statement}
            text="We plan trips across *Kenya*, so you do not have to piece them together yourself."
          />
          <Reveal delay={350}>
            <p className={styles.copy}>
              TAYARI is a travel consultancy. You tell us where you want to go and what you want to do. We arrange the stays, transfers and
              activities with established local providers, and we stay in touch until you are home.
            </p>
          </Reveal>
          <Reveal delay={500}>
            <Button href="/about" variant="link" arrow>
              Read about TAYARI
            </Button>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
