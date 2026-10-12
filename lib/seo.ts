import type { Metadata } from "next";
import { destinationHref, formatPriceLine } from "@/lib/content/format";
import type { Destination, ImageRef, SiteSettings, TravelPackage } from "@/lib/content/types";
import { siteConfig } from "@/lib/site";

/**
 * Search and sharing: page metadata (canonical address, Open Graph, cards) and schema.org data for
 * Google. Everything is built from the content, so pages added in the admin are covered too.
 * Facts only: no ratings, reviews or prices beyond what the client gave.
 */

/** Absolute URL on the site (or an absolute image URL left as it is). */
export const absolute = (path: string) => new URL(path, siteConfig.url).toString();

/**
 * A share image through the image optimiser: a 1200px file instead of the full-size original.
 * WhatsApp and some others skip previews for large images.
 */
export function shareImage(img: ImageRef) {
  return { url: absolute(`/_next/image?url=${encodeURIComponent(img.src)}&w=1200&q=75`), width: 1200, alt: img.alt };
}

type PageMetaInput = {
  /** The page's own address, e.g. "/tours" (the canonical address search engines should list). */
  path: string;
  title: string;
  description: string;
  image: ImageRef;
  /** The homepage passes its full title as-is instead of "Title | Company". */
  absoluteTitle?: boolean;
  type?: "website" | "article";
};

/** Title, description, canonical address and share previews for one page. */
export function pageMeta({ path, title, description, image, absoluteTitle, type = "website" }: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  const images = [shareImage(image)];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, siteName: siteConfig.name, locale: "en_GB", title: fullTitle, description, images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}

// ─── schema.org ────────────────────────────────────────────────────────────────

const ORG_ID = () => absolute("/#organization");

/** Only real profile addresses (a Facebook search link is not the page itself). */
const profiles = (social: SiteSettings["social"]) =>
  social.map((s) => s.href).filter((href) => /^https:\/\//.test(href) && !/\/search\b|[?&]q=/.test(href));

/** The company: a travel agency in Nairobi serving the whole of Africa. Homepage and Contact. */
export function organizationLd(site: SiteSettings) {
  const { contact } = site;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": ORG_ID(),
        name: site.legalName,
        alternateName: siteConfig.shortName,
        url: absolute("/"),
        logo: absolute("/brand/icon-512.png"),
        image: absolute(site.seo.ogImage.src),
        description: site.description,
        email: contact.email,
        telephone: contact.phone,
        address: { "@type": "PostalAddress", streetAddress: contact.address, addressLocality: "Nairobi", addressCountry: "KE" },
        geo: { "@type": "GeoCoordinates", latitude: contact.headOffice.pin[1], longitude: contact.headOffice.pin[0] },
        areaServed: { "@type": "Continent", name: "Africa" },
        contactPoint: [{ "@type": "ContactPoint", contactType: "customer service", telephone: contact.phone, email: contact.email, availableLanguage: ["English"] }],
        sameAs: profiles(site.social),
      },
      {
        "@type": "WebSite",
        "@id": absolute("/#website"),
        url: absolute("/"),
        name: site.companyName,
        publisher: { "@id": ORG_ID() },
        inLanguage: "en",
      },
    ],
  };
}

/** "Home › Tours › Maasai Mara Great Migration" as Google shows it under a result. */
export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absolute(c.path) })),
  };
}

/** A tour, its day-by-day route, and its starting price only when the client gave one. */
export function tourLd(trip: TravelPackage) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trip.title,
    description: trip.shortDescription,
    url: absolute(`/tours/${trip.slug}`),
    image: absolute(trip.cover.src),
    touristType: trip.experienceTypes,
    provider: { "@id": ORG_ID() },
    ...(trip.itinerary.length > 0 && {
      itinerary: {
        "@type": "ItemList",
        numberOfItems: trip.itinerary.length,
        itemListElement: trip.itinerary.map((day, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "TouristAttraction", name: `Day ${day.day}: ${day.title}`, description: day.description },
        })),
      },
    }),
    ...(trip.price && {
      offers: {
        "@type": "Offer",
        price: trip.price.amount,
        priceCurrency: trip.price.currency,
        description: formatPriceLine(trip.price),
        url: absolute(`/plan-your-journey?package=${trip.slug}`),
        seller: { "@id": ORG_ID() },
      },
    }),
  };
}

/** A destination with its own page. */
export function destinationLd(d: Destination) {
  const [lon, lat] = d.coordinates[0] ?? [];
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: d.name,
    description: d.shortDescription,
    url: absolute(destinationHref(d)),
    image: absolute(d.cover.src),
    touristType: d.themes,
    containedInPlace: { "@type": "Country", name: d.country },
    ...(lat !== undefined && { geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lon } }),
  };
}
