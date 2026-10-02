import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Container, Section } from "@/components/ui/Section";
import type { ImageRef } from "@/lib/content/types";
import styles from "./FinalCta.module.css";

/** Closing call to action: big words on forest green, with a tall photograph beside them (no text over the picture). */
export function FinalCta({ image, whatsapp }: { image: ImageRef; whatsapp: string }) {
  return (
    <Section tone="forest" edge labelledBy="final-cta-title" className={styles.section}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <Reveal variant="fade">
              <p className={styles.eyebrow}>Ready when you are</p>
            </Reveal>
            <RevealText as="h2" id="final-cta-title" className={styles.title} text="Tell us where you *want to go*." delay={120} />
            <Reveal delay={450}>
              <p className={styles.text}>It takes a couple of minutes. Share your dates and ideas, and a Tayari consultant will reply to plan the rest with you.</p>
            </Reveal>
            <Reveal delay={600}>
              <div className={styles.actions}>
                <Button href="/plan-your-journey" size="lg" arrow>
                  Plan Your Journey
                </Button>
                <Button href={`https://wa.me/${whatsapp}`} variant="ghost" size="lg" target="_blank" rel="noopener noreferrer">
                  or chat on WhatsApp
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal variant="right" delay={200} className={styles.photo}>
            <ImageFrame
              src={image.src}
              alt={image.alt}
              sizes="(min-width: 62rem) 40vw, 100vw"
              focus={image.focus}
              focusMobile={image.focusMobile}
              rounded
              className={styles.frame}
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
