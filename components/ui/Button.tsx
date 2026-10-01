import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./Button.module.css";

type Common = {
  /**
   * primary: the flagship action (ember). secondary: outlined. glass: translucent, for use over photographs.
   * link / linkLight: a text link with an animated underline, for tertiary actions on light / dark surfaces.
   */
  variant?: "primary" | "secondary" | "ghost" | "light" | "glass" | "link" | "linkLight";
  size?: "md" | "lg";
  fullWidth?: boolean;
  /** Shows a small arrow that nudges on hover. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

type AsLink = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common | "href">;
type AsButton = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common>;

export type ButtonProps = AsLink | AsButton;

function Arrow() {
  return (
    <svg className={styles.arrow} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", fullWidth, arrow, className, children, ...rest } = props;
  const classes = cn(styles.button, styles[variant], styles[size], fullWidth && styles.full, className);
  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {arrow && <Arrow />}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as Omit<AsLink, keyof Common>;
    const internal = href.startsWith("/") || href.startsWith("#");
    return internal ? (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    ) : (
      <a href={href} className={classes} {...anchorRest}>
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = rest as Omit<AsButton, keyof Common>;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
