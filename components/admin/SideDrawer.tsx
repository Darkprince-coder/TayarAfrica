"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Shell.module.css";

/**
 * The admin sidebar. On wide screens it is always there; on phones and tablets it hides behind a
 * slim top bar and slides in from the left when "Menu" is pressed. Closes on Escape, on the
 * backdrop, and when a page is chosen.
 */
export function SideDrawer({ newCount, children }: { newCount: number; children: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [seenPath, setSeenPath] = useState(path);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  // A new page was opened: put the menu away.
  if (path !== seenPath) {
    setSeenPath(path);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    (panel.current?.querySelector<HTMLElement>("nav a[aria-current='page']") ?? panel.current?.querySelector<HTMLElement>("nav a"))?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = before;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className={styles.topbar}>
        <Link href="/admin" className={styles.brand}>
          <Image src="/brand/logo-emblem-light.png" alt="" width={26} height={28} />
          <span>
            <strong>Tayari</strong> admin
          </span>
        </Link>
        <button ref={button} type="button" className={styles.menuButton} aria-expanded={open} aria-controls="admin-menu" onClick={() => setOpen(true)}>
          <span className={styles.burger} aria-hidden="true" />
          Menu
          {newCount > 0 && (
            <span className={styles.badge} aria-label={`${newCount} new booking ${newCount === 1 ? "request" : "requests"}`}>
              {newCount}
            </span>
          )}
        </button>
      </header>

      <div className={styles.backdrop} data-open={open || undefined} onClick={() => setOpen(false)} aria-hidden="true" />

      <aside
        ref={panel}
        id="admin-menu"
        className={styles.side}
        data-open={open || undefined}
        aria-label="Admin menu"
        onClick={(e) => {
          // Choosing the page you are already on does not change the path, so close here too.
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => {
            setOpen(false);
            button.current?.focus();
          }}
        >
          Close <span aria-hidden="true">×</span>
        </button>
        {children}
      </aside>
    </>
  );
}
