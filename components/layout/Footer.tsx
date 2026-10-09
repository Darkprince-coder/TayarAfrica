import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
import { flatNavLinks, legalLinks, primaryCta } from "@/lib/navigation";
import { telHref, whatsappHref } from "@/lib/site";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { Motif } from "@/components/ui/Motif";
import styles from "./Footer.module.css";

export async function Footer() {
  const site = await getSiteSettings();
  const { contact } = site;

  return (
    <footer className={styles.footer}>
      <div className={styles.band}>
        <Motif size={16} />
      </div>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo tone="light" />
          <p className={styles.blurb}>
            Safaris, culture, beaches and cross-border trips across Africa, planned by people who will pick up the phone.
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
              <a href={telHref(contact.phone)}>{contact.phone}</a>
            </li>
            <li>
              <a href={whatsappHref(contact.whatsapp)} target="_blank" rel="noopener noreferrer">
                WhatsApp, 24/7 for emergencies
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className={styles.email}>
                {contact.email}
              </a>
            </li>
            <li className={styles.muted}>
              {contact.location}
              <br />
              Branch in Amboseli, Kenya
              <br />
              Client support in Maryland and Minnesota, USA
            </li>
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

      <p className={styles.signoff}>
        Planned in Kenya. <em>Travelled across Africa.</em>
      </p>

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
