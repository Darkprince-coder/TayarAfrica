import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Container, Section } from "@/components/ui/Section";
import styles from "./CtaBand.module.css";

type Props = {
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string; external?: boolean };
};

/** Closing call to action for inner pages. */
export function CtaBand({ title, text, primary, secondary }: Props) {
  return (
    <Section tone="forest" labelledBy="cta-band-title" className={styles.band}>
      <Container>
        <div className={styles.inner}>
          <RevealText as="h2" id="cta-band-title" text={title} className={styles.title} />
          <Reveal delay={300}>
            <p className={styles.text}>{text}</p>
          </Reveal>
          <Reveal delay={450}>
            <div className={styles.actions}>
              <Button href={primary.href} size="lg" arrow>
                {primary.label}
              </Button>
              {secondary && (
                <Button
                  href={secondary.href}
                  variant="light"
                  size="lg"
                  {...(secondary.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {secondary.label}
                </Button>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
