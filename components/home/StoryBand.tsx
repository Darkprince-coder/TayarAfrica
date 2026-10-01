import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import type { ImageRef } from "@/lib/content/types";
import styles from "./StoryBand.module.css";

/** Full-bleed photograph with a short statement. DEMO COPY: replace with TAYARI's real story. */
export function StoryBand({ image }: { image: ImageRef }) {
  return (
    <section className={styles.band} aria-labelledby="story-title">
      <div className={styles.media}>
        <Parallax>
          <ImageFrame src={image.src} focus={image.focus} focusMobile={image.focusMobile} alt={image.alt} sizes="100vw" className={styles.frame} />
        </Parallax>
      </div>
      <div className={styles.scrim} />
      <div className={styles.content}>
        <Reveal variant="fade">
          <p className={styles.eyebrow}>Our approach</p>
        </Reveal>
        <RevealText as="h2" id="story-title" className={styles.title} text="A good trip is mostly good planning." delay={120} />
        <Reveal delay={400}>
          <p className={styles.copy}>
            The best moments on a trip usually come from small decisions made well in advance: which side of the park to stay on, when to
            leave for the morning drive, who is waiting at the airport. That is the part we take on.
          </p>
        </Reveal>
        <Reveal delay={550}>
          <Button href="/about#how-we-work" variant="light" arrow>
            How we plan a trip
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
