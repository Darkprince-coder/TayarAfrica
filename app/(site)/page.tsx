import { ImageFrame } from "@/components/ui/ImageFrame";
import { Button } from "@/components/ui/Button";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getHeroSlides } from "@/lib/content";
import styles from "./page.module.css";

/**
 * Phase 2 shell preview: shows the transparent-to-solid navigation, the footer and the
 * motion utilities on a stand-in hero. The real homepage replaces this in Phase 3.
 */
export default async function HomePage() {
  const [slide] = await getHeroSlides();

  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.media}>
          <Parallax>
            <ImageFrame src={slide.image.src} alt={slide.image.alt} sizes="100vw" priority quality={85} className={styles.fill} />
          </Parallax>
        </div>
        <div className={styles.scrim} />
        <div className={styles.copy}>
          <h1 id="hero-title" className={styles.title}>
            {slide.title}
          </h1>
          <p className={styles.subtitle}>{slide.subtitle}</p>
          <Button href={slide.ctaHref} size="lg" arrow>
            {slide.ctaText}
          </Button>
        </div>
      </section>

      <Section tone="bone" labelledBy="shell-preview">
        <Container>
          <SectionHeading
            id="shell-preview"
            eyebrow="Shell preview"
            title="Scroll to see the navigation settle."
            lead="Navigation, loader, page fade and the footer are in place. The full homepage comes next."
          />
          <div className={styles.grid}>
            {["Fade up", "Staggered", "Staggered again"].map((label, i) => (
              <Reveal key={label} delay={i * 120}>
                <p className={styles.card}>{label}</p>
              </Reveal>
            ))}
          </div>
          <div className={styles.clip}>
            <Reveal variant="clip">
              <ImageFrame src="/images/destinations/maasai-mara/cover.jpg" alt="Maasai Mara plains" ratio="16 / 7" sizes="(min-width: 80rem) 80rem, 100vw" rounded />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
