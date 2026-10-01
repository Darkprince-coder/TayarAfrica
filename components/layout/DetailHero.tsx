import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import type { ImageRef } from "@/lib/content/types";
import styles from "./DetailHero.module.css";

type Props = {
  image: ImageRef;
  eyebrow: string;
  title: string;
  subtitle: string;
  breadcrumb: { label: string; href?: string }[];
  cta?: { label: string; href: string };
};

/** Full-bleed opening for a destination or trip page. The navigation sits transparent over it. */
export function DetailHero({ image, eyebrow, title, subtitle, breadcrumb, cta }: Props) {
  return (
    <section className={styles.hero} aria-labelledby="detail-title">
      <div className={styles.media}>
        <Parallax>
          <ImageFrame
            src={image.src}
            alt={image.alt}
            sizes="100vw"
            priority
            quality={85}
            focus={image.focus}
            focusMobile={image.focusMobile}
            className={styles.frame}
          />
        </Parallax>
      </div>
      <div className={styles.scrim} />
      <div className={styles.content}>
        <nav aria-label="Breadcrumb" className={styles.crumbs}>
          <ol role="list">
            <li>
              <Link href="/">Home</Link>
            </li>
            {breadcrumb.map((c) => (
              <li key={c.label}>
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <Reveal variant="fade">
          <p className={styles.eyebrow}>{eyebrow}</p>
        </Reveal>
        <RevealText as="h1" id="detail-title" text={title} className={styles.title} delay={150} />
        <Reveal delay={450}>
          <p className={styles.subtitle}>{subtitle}</p>
        </Reveal>
        {cta && (
          <Reveal delay={650}>
            <Button href={cta.href} size="lg" arrow>
              {cta.label}
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
