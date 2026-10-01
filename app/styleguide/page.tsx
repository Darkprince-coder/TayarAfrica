import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckboxField, ChoiceChips, SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
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

      <section aria-labelledby="buttons">
        <h2 id="buttons" className={styles.h2}>
          Buttons & badges
        </h2>
        <div className={styles.row}>
          <Button arrow>Plan Your Journey</Button>
          <Button variant="secondary">Plan a Trip Here</Button>
          <Button variant="ghost" arrow>
            Read more
          </Button>
          <Button disabled>Sending…</Button>
          <Badge>Kenya</Badge>
          <Badge tone="sample">Sample content</Badge>
        </div>
        <div className={cn(styles.row, styles.darkRow)}>
          <Button variant="light" arrow size="lg">
            Request This Trip
          </Button>
          <Button variant="primary" size="lg">
            Plan Your Journey
          </Button>
          <Badge tone="dark">Featured</Badge>
        </div>
      </section>

      <section aria-labelledby="form">
        <h2 id="form" className={styles.h2}>
          Form fields
        </h2>
        <div className={styles.formDemo}>
          <TextField label="Full name" name="name" required autoComplete="name" placeholder="Your name" />
          <TextField label="Email" name="email" type="email" required error="Please enter a valid email address." defaultValue="not-an-email" />
          <SelectField
            label="Accommodation"
            name="stay"
            placeholder="Select a style"
            options={[
              { value: "budget", label: "Budget" },
              { value: "mid", label: "Mid-range" },
              { value: "luxury", label: "Luxury" },
              { value: "unsure", label: "Not sure" },
            ]}
          />
          <ChoiceChips
            legend="What kind of trip?"
            name="types"
            type="checkbox"
            defaultValue={["Safari"]}
            options={["Safari", "Beach", "Culture", "Adventure", "Wildlife", "Family", "Honeymoon", "Custom"].map((v) => ({ value: v, label: v }))}
          />
          <TextAreaField label="Tell us about your trip" name="message" hint="Dates, group size, anything that matters to you." />
          <CheckboxField name="consent">I agree to be contacted about my trip request.</CheckboxField>
        </div>
      </section>

      <section aria-labelledby="images">
        <h2 id="images" className={styles.h2}>
          Image frame (missing file → branded placeholder)
        </h2>
        <div className={styles.imageDemo}>
          <ImageFrame src="/images/does-not-exist.jpg" alt="Placeholder shown while photography is missing" ratio="4 / 5" sizes="(min-width: 700px) 16rem, 45vw" rounded />
          <ImageFrame src="/images/does-not-exist.jpg" alt="Wide placeholder" ratio="16 / 9" sizes="(min-width: 700px) 28rem, 90vw" rounded />
        </div>
        <p className={styles.muted}>
          Next: see the <Link href="/styleguide/images">image checklist</Link> for the exact filenames to use.
        </p>
      </section>

      <section aria-labelledby="reveal">
        <h2 id="reveal" className={styles.h2}>
          Scroll reveal
        </h2>
        <div className={styles.spacer} />
        <Reveal>
          <p className={styles.revealCard}>This block fades up as it enters the viewport (disabled for reduced motion).</p>
        </Reveal>
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
