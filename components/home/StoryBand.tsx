import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import type { ImageRef } from "@/lib/content/types";
import styles from "./StoryBand.module.css";

/**
 * A full-bleed photograph with one line on it: a breath between the practical sections.
 * The words sit low on the left, under a soft shade, clear of the picture's subject.
 */
export function StoryBand({ image }: { image: ImageRef }) {
  return (
    <section className={styles.band} aria-labelledby="story-title">
      <div className={styles.media}>
        <Parallax shift="7%" scale={1.16}>
          <ImageFrame src={image.src} alt={image.alt} sizes="100vw" focus={image.focus} focusMobile={image.focusMobile} className={styles.frame} />
        </Parallax>
      </div>
      <span className={styles.shade} aria-hidden="true" />
      <div className={styles.inner}>
        <RevealText as="h2" id="story-title" className={styles.title} text="Some mornings start *above the plains.*" />
        <Reveal delay={350}>
          <p className={styles.text}>A sunrise balloon flight can be added to a Maasai Mara trip. Ask us when you plan yours.</p>
        </Reveal>
        <Reveal delay={500}>
          <Button href="/tours" variant="linkLight" arrow>
            Explore our tours
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
