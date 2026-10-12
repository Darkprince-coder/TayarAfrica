"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Shell.module.css";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/inbox", label: "Booking requests", badge: true },
  { href: "/admin/people", label: "People" },
  { href: "/admin/account", label: "My account" },
];
/** Content editors arrive in the next step of this phase. */
const SOON = ["Tours", "Destinations", "Team", "Gallery", "Site settings"];

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
      {SOON.map((s) => (
        <span key={s} className={styles.link} aria-disabled="true">
          {s} <span className={styles.soon}>soon</span>
        </span>
      ))}
    </nav>
  );
}
