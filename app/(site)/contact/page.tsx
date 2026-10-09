import type { Metadata } from "next";
import { ContactForm } from "@/components/booking/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { getSiteSettings } from "@/lib/content";
import { AfricaMap, pinAt, viewFor } from "@/components/geo/AfricaMap";
import { directionsHref, telHref, whatsappHref } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Tayari Africa Tours Consultants at our headquarters in Nairobi, Kenya, or our client support in Maryland and Minnesota, USA, by phone, WhatsApp or email. 24/7 emergency WhatsApp for travellers.",
};

type Row = { label: string; value: string; href?: string; external?: boolean; note?: string };

/** East Africa, framed around Kenya. */
const EAST_AFRICA = viewFor([30.5, 5.6], [43.5, -7.2]);

export default async function ContactPage() {
  const { contact, social, pageImages } = await getSiteSettings();
  const pin = pinAt(contact.headOffice.pin);
  // Other African branches with a pin (e.g. Amboseli).
  const branches = contact.offices.filter((o) => o.pin).map((o) => ({ label: o.place.replace(/, Kenya$/, ""), xy: pinAt(o.pin!) }));
  // Pin and label are drawn in map units; scale them to how far the map is zoomed.
  const k = Number(EAST_AFRICA.split(" ")[2]) / 800;

  const rows: Row[] = [
    ...contact.offices.map((o) => ({ label: o.label, value: o.person ? `${o.person}, ${o.phone}` : o.phone, href: telHref(o.phone), note: o.place })),
    {
      label: "WhatsApp",
      value: "Message us on WhatsApp",
      href: whatsappHref(contact.whatsapp),
      external: true,
      note: `Emergencies while you are travelling: 24/7 on WhatsApp, ${contact.emergency}`,
    },
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { label: "Hours", value: contact.hours.join(". "), note: "East Africa Time" },
    { label: "Where we go", value: contact.coverage },
  ];

  return (
    <>
      <PageHero
        image={pageImages.contact}
        kicker="Contact"
        title="Talk to *us*"
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
                  <Reveal key={`${r.label}-${i}`} delay={Math.min(i, 5) * 90} className={styles.row}>
                    <dt>{r.label}</dt>
                    <dd>
                      {r.href ? (
                        <a href={r.href} {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                          {r.value}
                        </a>
                      ) : (
                        r.value
                      )}
                      {r.note && <span className={styles.note}>{r.note}</span>}
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

      <Section tone="deep" labelledBy="find-title">
        <Container>
          <div className={styles.find}>
            <Reveal variant="clip" className={styles.mapCard}>
              <AfricaMap
                highlight={["KE"]}
                view={EAST_AFRICA}
                label="Map of East Africa with Kenya highlighted, our head office marked in Nairobi and our branch in Amboseli"
                className={styles.map}
              >
                <circle cx={pin[0]} cy={pin[1]} r={16 * k} className={styles.pinHalo} />
                <circle cx={pin[0]} cy={pin[1]} r={8 * k} className={styles.pin} />
                <text x={pin[0] + 22 * k} y={pin[1] + 9 * k} fontSize={30 * k} className={styles.pinLabel}>
                  Nairobi
                </text>
                {branches.map((b) => (
                  <g key={b.label}>
                    <circle cx={b.xy[0]} cy={b.xy[1]} r={6 * k} className={styles.pin} />
                    <text x={b.xy[0] + 18 * k} y={b.xy[1] + 8 * k} fontSize={24 * k} className={styles.pinLabel}>
                      {b.label}
                    </text>
                  </g>
                ))}
              </AfricaMap>
            </Reveal>
            <div className={styles.findText}>
              <Reveal variant="fade">
                <p className={styles.findKicker}>Find us</p>
              </Reveal>
              <h2 id="find-title" className={styles.findTitle}>
                Our head office is in <em>Nairobi.</em>
              </h2>
              <address className={styles.address}>{contact.address}</address>
              <p className={styles.findCopy}>
                Most trips start in Nairobi, and so do we, with a branch at Amboseli too. Call or message before you visit so the right person is in. If
                you are in the USA, our client support team will help by phone and WhatsApp.
              </p>
              <Button href={directionsHref(contact.headOffice.directionsQuery)} variant="light" arrow target="_blank" rel="noopener noreferrer">
                Get directions
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
