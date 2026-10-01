import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Container, Section } from "@/components/ui/Section";
import styles from "./Intro.module.css";

export function Intro() {
  return (
    <Section tone="bone" labelledBy="intro-title">
      <Container>
        <div className={styles.grid}>
          <RevealText
            as="h2"
            id="intro-title"
            className={styles.statement}
            text="We plan trips across Kenya, so you do not have to piece them together yourself."
          />
          <div className={styles.side}>
            <Reveal delay={300}>
              <p className={styles.copy}>
                TAYARI is a travel consultancy. You tell us where you want to go and what you want to do. We arrange the stays,
                transfers and activities with established local providers, and we stay in touch until you are home.
              </p>
            </Reveal>
            <Reveal delay={450}>
              <Button href="/about" variant="secondary" arrow>
                About TAYARI
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
