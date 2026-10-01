import type { Metadata } from "next";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { getServices } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Our services",
  description:
    "What TAYARI arranges in Kenya: safari experiences, accommodation, airport and local transfers, transport, cultural experiences, beach holidays and private trips.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="What we *arrange* for you"
        lead="TAYARI is a consultancy. We plan the trip and coordinate the people who deliver each part of it."
      />
      <Section tone="bone">
        <Container>
          <ul role="list" className={styles.grid}>
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 4) * 110} className={styles.item}>
                <span className={styles.icon}>
                  <ServiceIcon name={s.icon} />
                </span>
                <h2 className={styles.title}>{s.title}</h2>
                <p className={styles.text}>{s.description}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand
        title="Tell us what you need"
        text="You can ask for one thing, such as an airport transfer, or for a whole trip."
        primary={{ label: "Plan Your Journey", href: "/plan-your-journey" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
