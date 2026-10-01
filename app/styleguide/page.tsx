import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const swatches = [
  ["Bone", "--color-bone", "#FAF6EE"],
  ["Sand", "--color-sand", "#EFE6D6"],
  ["Sand deep", "--color-sand-deep", "#E2D5BD"],
  ["Forest", "--color-forest", "#1F3A2E"],
  ["Forest deep", "--color-forest-deep", "#14261E"],
  ["Ink", "--color-ink", "#1B1A17"],
  ["Ember (CTA)", "--color-ember", "#B4501E"],
  ["Gold", "--color-gold", "#C9A15A"],
  ["Sage", "--color-sage", "#7D9380"],
] as const;

/** Internal review page for the design system. Not linked anywhere; noindex. */
export default function StyleguidePage() {
  return (
    <main id="main" className={styles.page}>
      <header>
        <h1 className={styles.title}>Design foundations</h1>
        <p className={styles.muted}>Internal review page — Phase 0.</p>
      </header>

      <section aria-labelledby="palette">
        <h2 id="palette" className={styles.h2}>
          Palette — Savanna Dusk
        </h2>
        <ul role="list" className={styles.swatches}>
          {swatches.map(([name, token, hex]) => (
            <li key={token} className={styles.swatch}>
              <div className={styles.chip} style={{ background: `var(${token})` }} />
              <div className={styles.meta}>
                <strong>{name}</strong>
                <code>{hex}</code>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="contrast">
        <h2 id="contrast" className={styles.h2}>
          Text on surfaces
        </h2>
        <div className={styles.pairs}>
          <div className={styles.pair} style={{ background: "var(--color-bone)" }}>
            Ink on bone — body copy
          </div>
          <div className={styles.pair} style={{ background: "var(--color-sand)", color: "var(--color-text-muted)" }}>
            Muted on sand — captions
          </div>
          <div className={styles.pair} style={{ background: "var(--color-forest)", color: "var(--color-text-on-dark)" }}>
            Cream on forest — dark sections
          </div>
          <div className={styles.pair} style={{ background: "var(--color-ember)", color: "#fff" }}>
            White on ember — primary CTA
          </div>
        </div>
      </section>

      <section aria-labelledby="type" className={styles.type}>
        <h2 id="type" className={styles.h2}>
          Typography — Fraunces + Manrope
        </h2>
        <p className={styles.display}>Africa, arranged around you.</p>
        <h3 style={{ fontSize: "var(--text-2xl)" }}>Maasai Mara, Amboseli, Diani</h3>
        <p style={{ fontSize: "var(--text-lg)" }}>
          Lead paragraph in Manrope — warm, modern and highly readable at every size, built for long itineraries and
          quick mobile reads alike.
        </p>
        <p>
          Body copy. TAYARI coordinates stays, transfers and experiences through established partners, so your journey
          feels effortless from the first message to the last sunset.
        </p>
      </section>

      <section aria-labelledby="logo">
        <h2 id="logo" className={styles.h2}>
          Logo assets
        </h2>
        <div className={styles.logos}>
          <div className={styles.logoDark}>
            <Image src="/brand/logo-full.png" alt="TAYARI logo, full colour" width={160} height={195} />
          </div>
          <div className={styles.logoLight}>
            <Image src="/brand/logo-full-light.png" alt="TAYARI logo, light version" width={160} height={195} />
          </div>
          <div className={styles.logoDark}>
            <Image src="/brand/logo-emblem.png" alt="TAYARI emblem" width={120} height={117} />
          </div>
          <div className={styles.logoLight}>
            <Image src="/brand/logo-emblem-light.png" alt="TAYARI emblem, light version" width={120} height={117} />
          </div>
        </div>
      </section>
    </main>
  );
}
