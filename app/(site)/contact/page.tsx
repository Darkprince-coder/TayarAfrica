import type { Metadata } from "next";
import { ContactForm } from "@/components/booking/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { getSiteSettings } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact TAYARI Africa Tours by phone, WhatsApp or email, or send a trip request and we will reply to plan your Kenya trip.",
};

export default async function ContactPage() {
  const { contact, social } = await getSiteSettings();
  const tel = contact.phone.replace(/\s/g, "");

  const rows = [
    { label: "Phone", value: contact.phone, href: `tel:${tel}` },
    { label: "WhatsApp", value: "Message us on WhatsApp", href: `https://wa.me/${contact.whatsapp}`, external: true },
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { label: "Based in", value: contact.location },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to us"
        lead="Ask a question, or tell us about the trip you have in mind. A person reads every message."
      />
      <Section tone="bone" labelledBy="reach-title">
        <Container>
          <div className={styles.grid}>
            <div>
              <h2 id="reach-title" className={styles.h2}>
                Reach us directly
              </h2>
              <dl className={styles.rows}>
                {rows.map((r, i) => (
                  <Reveal key={r.label} delay={i * 90} className={styles.row}>
                    <dt>{r.label}</dt>
                    <dd>
                      {r.href ? (
                        <a href={r.href} {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                          {r.value}
                        </a>
                      ) : (
                        r.value
                      )}
                    </dd>
                  </Reveal>
                ))}
              </dl>
              <Reveal delay={400}>
                <ul role="list" className={styles.social} aria-label="Social media">
                  {social.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className={styles.right}>
              <Reveal delay={200}>
                <h2 className={styles.h2}>Send us a message</h2>
                <ContactForm whatsapp={contact.whatsapp} />
              </Reveal>
              <Reveal delay={300} className={styles.panel}>
                <h2 className={styles.panelTitle}>Planning a trip?</h2>
                <p>The trip request form asks for your dates, group size and what you would like to see. It is the quickest way for us to come back with a useful plan.</p>
                <Button href="/plan-your-journey" size="lg" arrow>
                  Plan Your Journey
                </Button>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
