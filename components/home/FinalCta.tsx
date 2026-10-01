import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import type { ImageRef } from "@/lib/content/types";
import styles from "./FinalCta.module.css";

export function FinalCta({ image, whatsapp }: { image: ImageRef; whatsapp: string }) {
  return (
    <section className={styles.cta} aria-labelledby="final-cta-title">
      <div className={styles.media}>
        <Parallax>
          <ImageFrame src={image.src} focus={image.focus} focusMobile={image.focusMobile} alt={image.alt} sizes="100vw" className={styles.frame} />
        </Parallax>
      </div>
      <div className={styles.scrim} />
      <div className={styles.content}>
        <RevealText as="h2" id="final-cta-title" className={styles.title} text="Tell us where you want to go." />
        <Reveal delay={350}>
          <p className={styles.copy}>It takes a couple of minutes. Share your dates and ideas, and a TAYARI consultant will reply to plan the rest with you.</p>
        </Reveal>
        <Reveal delay={500}>
          <div className={styles.actions}>
            <Button href="/plan-your-journey" size="lg" arrow>
              Plan Your Journey
            </Button>
            <Button href={`https://wa.me/${whatsapp}`} variant="light" size="lg" target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
