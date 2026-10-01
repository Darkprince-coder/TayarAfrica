"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { isActive, isGroupActive, type NavItem } from "@/lib/navigation";
import styles from "./NavDropdown.module.css";

type Props = { item: NavItem; pathname: string };

/**
 * Desktop dropdown. Opens on hover (mouse only) and on click or keyboard. Clicking while it
 * is open from hover "pins" it open instead of closing it. Escape, an outside click, or
 * moving focus away closes it.
 */
export function NavDropdown({ item, pathname }: Props) {
  const id = useId();
  const [state, setState] = useState<{ open: boolean; pinned: boolean }>({ open: false, pinned: false });
  const wrapRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const close = () => setState({ open: false, pinned: false });

  useEffect(() => {
    if (!state.open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [state.open]);

  // Close when the route changes (the group renders again with a new pathname).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (state.open) close();
  }

  const active = isGroupActive(pathname, item);

  return (
    <li
      ref={wrapRef}
      className={styles.wrap}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(leaveTimer.current);
        setState((s) => (s.open ? s : { open: true, pinned: false }));
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        leaveTimer.current = setTimeout(() => setState((s) => (s.pinned ? s : { open: false, pinned: false })), 160);
      }}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node | null)) close();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && state.open) {
          close();
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={cn(styles.trigger, active && styles.active)}
        aria-expanded={state.open}
        aria-controls={id}
        onClick={() => setState((s) => (s.open && s.pinned ? { open: false, pinned: false } : { open: true, pinned: true }))}
      >
        {item.label}
        <svg className={styles.chevron} width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div id={id} className={styles.panel} data-open={state.open} inert={!state.open}>
        <ul role="list" className={styles.list}>
          {item.children?.map((child) => (
            <li key={child.href}>
              <Link href={child.href} className={styles.item} aria-current={isActive(pathname, child.href) && !child.href.includes("#") ? "page" : undefined} onClick={close}>
                <span className={styles.itemLabel}>{child.label}</span>
                {child.description && <span className={styles.itemDesc}>{child.description}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
