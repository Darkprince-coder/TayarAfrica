import Link from "next/link";
import { Container, Section } from "@/components/ui/Section";
import type { ImageRef, LegalPage } from "@/lib/content/types";
import { legalLinks } from "@/lib/navigation";
import { PageHero } from "./PageHero";
import styles from "./LegalArticle.module.css";

const formatDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** A legal page: short photo opening, a draft notice until approved, then plain readable sections. */
export function LegalArticle({ page, image }: { page: LegalPage; image: ImageRef }) {
  const others = legalLinks.filter((l) => l.href !== `/${page.slug}`);
  return (
    <>
      <PageHero size="short" image={image} kicker="The small print" title={page.title} lead={page.summary} />
      <Section tone="bone" labelledBy="page-title">
        <Container>
          <div className={styles.layout}>
            <article className={styles.article}>
              {page.draft && (
                <p className={styles.draft} role="note">
                  <strong>Draft for review.</strong> This text is waiting for approval and may change before it takes effect.
                </p>
              )}
              <p className={styles.updated}>Last updated {formatDate(page.updated)}</p>
              {page.sections.map((s) => (
                <section key={s.heading} className={styles.section}>
                  <h2 className={styles.heading}>{s.heading}</h2>
                  {s.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  {s.list && (
                    <ul className={styles.list}>
                      {s.list.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </article>
            <aside className={styles.aside} aria-label="Related pages">
              <p className={styles.asideTitle}>Also read</p>
              <ul role="list">
                {others.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/contact">Questions? Contact us</Link>
                </li>
              </ul>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
