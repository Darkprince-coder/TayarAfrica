"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Shell.module.css";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/inbox", label: "Booking requests", badge: true },
  { href: "/admin/content/tours", label: "Tours" },
  { href: "/admin/content/destinations", label: "Destinations" },
  { href: "/admin/content/team", label: "Team" },
  { href: "/admin/content/gallery", label: "Gallery" },
  { href: "/admin/content/testimonials", label: "Testimonials" },
  { href: "/admin/content/homepage-photo", label: "Homepage photo" },
  { href: "/admin/content/legal", label: "Legal pages" },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/people", label: "People" },
  { href: "/admin/account", label: "My account" },
];

export function AdminNav({ newCount }: { newCount: number }) {
  const path = usePathname();
  const current = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));
  return (
    <nav aria-label="Admin" className={styles.nav}>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={styles.link} aria-current={current(l.href) ? "page" : undefined}>
          {l.label}
          {l.badge && newCount > 0 && <span className={styles.badge}>{newCount}</span>}
        </Link>
      ))}
    </nav>
  );
}
