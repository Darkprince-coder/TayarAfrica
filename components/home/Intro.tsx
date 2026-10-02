import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Container, Section } from "@/components/ui/Section";
import type { ImageRef } from "@/lib/content/types";
import styles from "./Intro.module.css";

/**
 * The first beat after the hero: who plans the trip and why that matters. Asymmetric on wide
 * screens (a tall photograph set against a sand block, words to the right), stacked on phones.
 */
export function Intro({ image }: { image: ImageRef }) {
  return (
    <Section tone="bone" size="lg" labelledBy="intro-title">
      <Container>
        <div className={styles.layout}>
          <div className={styles.figure}>
            <span className={styles.block} aria-hidden="true" />
            <Reveal variant="clip" className={styles.photoWrap}>
              <div className={styles.photo}>
                <Parallax shift="6%" scale={1.14}>
                  <ImageFrame
                    src={image.src}
                    alt={image.alt}
                    focus={image.focus}
                    focusMobile={image.focusMobile}
                    sizes="(min-width: 62rem) 40vw, 100vw"
                    className={styles.frame}
                  />
                </Parallax>
              </div>
            </Reveal>
          </div>

          <div className={styles.text}>
            <Reveal variant="fade">
              <p className={styles.kicker}>Planned in Kenya</p>
            </Reveal>
            <RevealText as="h2" id="intro-title" className={styles.title} text="A good trip is mostly *good planning.*" delay={120} />
            <Reveal delay={300}>
              <p className={styles.lead}>
                We know which camps face the river, when the herds are likely to cross and how long the road north really takes. That is the
                part of a trip you never see, and the reason the rest of it works.
              </p>
            </Reveal>
            <Reveal delay={420}>
              <p className={styles.body}>
                You plan with real people in Kenya, and with client support in the USA if you are travelling from there. The same team stays
                with you from the first message until you are home, and our emergency line on WhatsApp is open day and night while you
                travel.
              </p>
            </Reveal>
            <Reveal delay={540}>
              <Button href="/about#how-we-work" variant="link" arrow>
                How we plan a trip
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
