import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
import { flatNavLinks, legalLinks, primaryCta } from "@/lib/navigation";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import styles from "./Footer.module.css";

export async function Footer() {
  const site = await getSiteSettings();
  const { contact } = site;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo tone="light" />
          <p className={styles.blurb}>
            Safaris, beach holidays and cultural trips in Kenya, planned by people who will pick up the phone.
          </p>
          <Button href={primaryCta.href} variant="light" arrow>
            {primaryCta.label}
          </Button>
        </div>

        <nav aria-label="Footer" className={styles.col}>
          <h2 className={styles.heading}>Explore</h2>
          <ul role="list" className={styles.list}>
            {flatNavLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.heading}>Talk to us</h2>
          <ul role="list" className={styles.list}>
            <li>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
            </li>
            <li>
              <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li className={styles.muted}>{contact.location}</li>
          </ul>
        </div>

        <div className={styles.col}>
          <h2 className={styles.heading}>Follow</h2>
          <ul role="list" className={styles.list}>
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>
          &copy; {new Date().getFullYear()} {site.legalName}
        </p>
        <ul role="list" className={styles.legal}>
          {legalLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
