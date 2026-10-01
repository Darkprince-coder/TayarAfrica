export type NavLink = {
  label: string;
  href: string;
  /** Set false to keep a link out of the desktop bar (it still appears in the mobile menu and footer). */
  desktop?: boolean;
};

export const navLinks: NavLink[] = [
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team", desktop: false },
  { label: "Contact", href: "/contact" },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export const primaryCta = { label: "Plan Your Journey", href: "/plan-your-journey" };

/**
 * Routes whose first screen is a full-bleed photograph, so the nav starts transparent
 * over it. Everywhere else the nav is solid from the start.
 */
export function isOverlayRoute(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/destinations/") || pathname.startsWith("/experiences/");
}

export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
