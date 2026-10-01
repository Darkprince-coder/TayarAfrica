"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { isActive, isOverlayRoute, navLinks, primaryCta } from "@/lib/navigation";
import styles from "./Navigation.module.css";

const FOCUSABLE = "a[href], button:not([disabled])";

export function Navigation({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The menu is "open" only for the page it was opened on, so navigating always closes it.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const overlay = isOverlayRoute(pathname);
  const solid = !open && (!overlay || scrolled);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenFor(null);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      // Keep keyboard focus inside the header and the open menu.
      const items = [
        ...(headerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
        ...(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
      ].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 62rem)");
    const onResize = () => desktop.matches && setOpenFor(null);

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <>
      <header ref={headerRef} className={cn(styles.header, solid ? styles.solid : styles.clear)}>
        <div className={styles.bar}>
          <Logo tone={solid ? "dark" : "light"} />

          <nav aria-label="Main" className={styles.desktopNav}>
            <ul role="list" className={styles.links}>
              {navLinks
                .filter((l) => l.desktop !== false)
                .map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={styles.link} aria-current={isActive(pathname, l.href) ? "page" : undefined}>
                      {l.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <Button href={primaryCta.href} className={styles.cta}>
              {primaryCta.label}
            </Button>
            <button
              ref={toggleRef}
              type="button"
              className={styles.toggle}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpenFor(open ? null : pathname)}
            >
              <span className={styles.burger} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" ref={panelRef} className={styles.panel} data-open={open} inert={!open} role="dialog" aria-modal="true" aria-label="Menu">
        <nav aria-label="Mobile" className={styles.panelInner}>
          <ul role="list" className={styles.panelLinks}>
            {navLinks.map((l, i) => (
              <li key={l.href} style={{ "--i": i } as React.CSSProperties}>
                <Link href={l.href} className={styles.panelLink} aria-current={isActive(pathname, l.href) ? "page" : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.panelFoot} style={{ "--i": navLinks.length } as React.CSSProperties}>
            <Button href={primaryCta.href} size="lg" fullWidth arrow>
              {primaryCta.label}
            </Button>
            <p className={styles.panelContact}>
              <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
              <a href={`https://wa.me/${whatsapp}`} rel="noopener noreferrer" target="_blank">
                WhatsApp us
              </a>
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
