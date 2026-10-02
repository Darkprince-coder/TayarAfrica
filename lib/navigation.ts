export type NavChild = { label: string; href: string; description?: string };

export type NavItem = {
  label: string;
  /** A plain link. Omit when the item is a group with children. */
  href?: string;
  /** Group of related links shown in a dropdown (desktop) or accordion (mobile). */
  children?: NavChild[];
};

/**
 * Main navigation. Keep the top level short: related pages (anything about the company,
 * and any future section) go inside a group instead of adding another top-level item.
 */
export const navItems: NavItem[] = [
  { label: "Tours", href: "/tours" },
  { label: "Destinations", href: "/destinations" },
  {
    label: "About",
    children: [
      { label: "About Tayari", href: "/about", description: "Who we are and what we arrange" },
      { label: "How we plan a trip", href: "/about#how-we-work", description: "From first message to departure" },
      { label: "Meet the team", href: "/team", description: "The people behind your trip" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

/** Every link in the navigation, flattened (used by the footer). */
export const flatNavLinks: { label: string; href: string }[] = navItems.flatMap((item) =>
  item.children ? item.children.map(({ label, href }) => ({ label, href })) : item.href ? [{ label: item.label, href: item.href }] : [],
);

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export const primaryCta = { label: "Plan Your Journey", href: "/plan-your-journey" };

/**
 * Routes whose first screen is a full-bleed photograph, so the nav starts transparent
 * over it. Everywhere else the nav is solid from the start.
 */
export function isOverlayRoute(pathname: string): boolean {
  return pathname === "/" || pathname === "/explore" || pathname.startsWith("/destinations/") || pathname.startsWith("/tours/");
}

export function isActive(pathname: string, href: string): boolean {
  const path = href.split("#")[0];
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function isGroupActive(pathname: string, item: NavItem): boolean {
  return Boolean(item.children?.some((c) => isActive(pathname, c.href)));
}
