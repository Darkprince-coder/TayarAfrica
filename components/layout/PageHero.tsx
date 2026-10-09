import Link from "next/link";
import type { ReactNode } from "react";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { cn } from "@/lib/cn";
import type { ImageRef } from "@/lib/content/types";
import styles from "./PageHero.module.css";

/**
 * How wide a 3:2 photograph is drawn when it covers the hero: on tall (portrait) screens it is
 * about 1.5x the hero's height, not the screen width. Telling the browser keeps phones sharp.
 */
const COVER_SIZES = {
  tall: "(max-aspect-ratio: 3/2) 140vh, 100vw",
  medium: "(max-aspect-ratio: 3/2) 110vh, 100vw",
  short: "(max-aspect-ratio: 3/2) 85vh, 100vw",
} as const;

type Props = {
  image: ImageRef;
  /** Small line above the title. */
  kicker?: string;
  /** Wrap words in *asterisks* for the italic accent. */
  title: string;
  lead?: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  /** Buttons or links under the lead. */
  actions?: ReactNode;
  /** tall: destination and tour pages. medium: section index pages. short: forms and legal pages. */
  size?: "tall" | "medium" | "short";
};

/**
 * The opening photograph for every inner page: graded like the homepage hero, words low on the
 * left, the navigation transparent over it. Photography leads on every page.
 */
export function PageHero({ image, kicker, title, lead, breadcrumb, actions, size = "medium" }: Props) {
  return (
    <section className={cn(styles.hero, styles[size])} aria-labelledby="page-title">
      <div className={styles.media}>
        <Parallax shift="4%" scale={1.08}>
          <ImageFrame
            src={image.src}
            alt={image.alt}
            sizes={COVER_SIZES[size]}
            priority
            quality={85}
            focus={image.focus}
            focusMobile={image.focusMobile}
            className={styles.frame}
            imageClassName={styles.image}
          />
        </Parallax>
      </div>
      <span className={styles.grade} aria-hidden="true" />

      <div className={styles.content}>
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <ol role="list">
              <li>
                <Link href="/">Home</Link>
              </li>
              {breadcrumb.map((c) => (
                <li key={c.label}>{c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
              ))}
            </ol>
          </nav>
        )}
        {kicker && (
          <Reveal variant="fade">
            <p className={styles.kicker}>{kicker}</p>
          </Reveal>
        )}
        <RevealText as="h1" id="page-title" text={title} className={styles.title} delay={120} />
        {lead && (
          <Reveal delay={380}>
            <p className={styles.lead}>{lead}</p>
          </Reveal>
        )}
        {actions && (
          <Reveal delay={520}>
            <div className={styles.actions}>{actions}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
