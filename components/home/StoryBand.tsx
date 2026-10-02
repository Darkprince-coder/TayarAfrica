import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Container, Section } from "@/components/ui/Section";
import type { ImageRef } from "@/lib/content/types";
import styles from "./StoryBand.module.css";

/**
 * Editorial split: a tall photograph on one side and a forest-green panel that overlaps it on the
 * other, so the words never sit on top of the picture's subject. DEMO COPY: replace with Tayari's story.
 */
export function StoryBand({ image }: { image: ImageRef }) {
  return (
    <Section tone="bone" labelledBy="story-title" className={styles.section}>
      <Container>
        <div className={styles.grid}>
          <Reveal variant="clip" className={styles.photo}>
            <div className={styles.photoInner}>
              <Parallax>
                <ImageFrame
                  src={image.src}
                  alt={image.alt}
                  sizes="(min-width: 62rem) 58vw, 100vw"
                  focus={image.focus}
                  focusMobile={image.focusMobile}
                  className={styles.frame}
                />
              </Parallax>
            </div>
          </Reveal>

          <div className={styles.panel}>
            <Reveal variant="fade">
              <p className={styles.eyebrow}>Our approach</p>
            </Reveal>
            <RevealText as="h2" id="story-title" className={styles.title} text="A good trip is mostly *good planning*." delay={120} />
            <Reveal delay={400}>
              <p className={styles.copy}>
                The best moments on a trip usually come from small decisions made well in advance: which side of the park to stay on, when to
                leave for the morning drive, who is waiting at the airport. That is the part we take on.
              </p>
            </Reveal>
            <Reveal delay={550}>
              <Button href="/about#how-we-work" variant="linkLight" arrow>
                See how we plan a trip
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
