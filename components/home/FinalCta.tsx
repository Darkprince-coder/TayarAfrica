import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { whatsappHref } from "@/lib/site";
import type { ImageRef } from "@/lib/content/types";
import styles from "./FinalCta.module.css";

/**
 * The close of the homepage: the start of a conversation, not a sales push. A full-bleed split,
 * photograph to the edge on one side, the invitation on deep green on the other.
 */
export function FinalCta({ image, whatsapp }: { image: ImageRef; whatsapp: string }) {
  return (
    <section className={styles.section} aria-labelledby="final-cta-title">
      <div className={styles.photo}>
        <Parallax shift="5%" scale={1.12}>
          <ImageFrame src={image.src} alt={image.alt} sizes="(min-width: 62rem) 50vw, 100vw" focus={image.focus} focusMobile={image.focusMobile} className={styles.frame} />
        </Parallax>
      </div>

      <div className={styles.panel}>
        <div className={styles.copy}>
          <Reveal variant="fade">
            <p className={styles.kicker}>Tayari means ready</p>
          </Reveal>
          <RevealText as="h2" id="final-cta-title" className={styles.title} text="Ready *when you are.*" delay={120} />
          <Reveal delay={350}>
            <p className={styles.text}>Tell us roughly when and roughly where. That is enough for us to start, and there is no commitment until you say yes.</p>
          </Reveal>
          <Reveal delay={500}>
            <div className={styles.actions}>
              <Button href="/plan-your-journey" size="lg" arrow>
                Plan Your Journey
              </Button>
              <Button
                href={whatsappHref(whatsapp, "Hello Tayari, I would like to plan a trip.")}
                variant="linkLight"
                target="_blank"
                rel="noopener noreferrer"
              >
                Or message us on WhatsApp
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
