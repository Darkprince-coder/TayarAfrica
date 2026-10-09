import type { LegalPage } from "@/lib/content/types";
import { siteConfig } from "@/lib/site";
import { siteSettings } from "./people-and-site";

/**
 * DRAFT legal texts, written from the client brief and from what this website actually does.
 * They must be reviewed and approved by the client (ideally with a lawyer) before launch; until
 * then each page shows a draft notice. Booking numbers come from siteSettings.booking.
 */
const { booking } = siteSettings;
const { contact } = siteConfig;
const company = siteConfig.legalName;
const methods = booking.paymentMethods.join(", ").replace(/, ([^,]*)$/, " or $1");
const UPDATED = "2026-10-09";

export const legalPages: LegalPage[] = [
  {
    slug: "terms",
    title: "Terms of Service",
    summary: "How a trip request becomes a booking, how payment works, and what each of us is responsible for.",
    updated: UPDATED,
    draft: true,
    sections: [
      {
        heading: "Who we are",
        paragraphs: [
          `${company} ("Tayari", "we", "us") is a tour consultancy with its head office at ${contact.address}. We plan trips and arrange stays, transport, guides and activities with providers in each destination.`,
          `You can reach us at ${contact.email} or on ${contact.phone}.`,
        ],
      },
      {
        heading: "A request is not a booking",
        paragraphs: [
          "Sending a trip request through this website, by email or on WhatsApp does not book anything. It starts a conversation: we reply with ideas, availability and a quote.",
          "Prices shown on the website are starting prices per person (per person sharing where stated). The price you pay is the one in your written quote, which depends on your dates, group size, the places you stay and availability.",
        ],
      },
      {
        heading: "Confirming your booking",
        paragraphs: [
          `Your booking is confirmed only when you have accepted our written quote and we have received a deposit of ${booking.depositPercent}% of the trip price. We then confirm in writing.`,
          `You can pay by ${methods}. We send payment details with your quote. The remaining balance is due ${booking.balanceDue}, unless your quote says otherwise.`,
          "A quote is valid for the period stated on it. After that, prices and availability may change.",
        ],
      },
      {
        heading: "Cancelling or changing your trip",
        paragraphs: [
          "If you need to cancel, the refund depends on how close to the start of your trip you tell us. The full rules are in our Cancellation Policy.",
          "If you want to change your trip after booking, ask us. We will do our best, but changes depend on availability and may change the price.",
        ],
      },
      {
        heading: "Your responsibilities",
        paragraphs: ["Before you travel, please make sure that:"],
        list: [
          "your passport is valid and you have any visas you need (a passport is required for cross-border trips such as Kenya to Tanzania)",
          "you have suitable travel insurance, including medical cover",
          "you have checked the health advice for the countries you visit",
          "the names and details you give us match your travel documents",
        ],
      },
      {
        heading: "Our providers",
        paragraphs: [
          "Lodges, camps, hotels, airlines, park authorities and some guides are independent providers. We choose them with care, but their own terms also apply to the services they provide.",
          "Wildlife sightings, weather and road conditions are outside anyone's control. We plan around the seasons, but we cannot guarantee particular sightings.",
        ],
      },
      {
        heading: "If we need to change your trip",
        paragraphs: [
          "Sometimes we have to change part of a trip, for example because a lodge is unavailable, roads are closed or a park changes its rules. We will tell you as soon as we can and offer the closest alternative we can find.",
        ],
      },
      {
        heading: "Law",
        paragraphs: ["These terms are governed by the laws of Kenya."],
      },
    ],
  },
  {
    slug: "cancellation",
    title: "Cancellation Policy",
    summary: "What happens if you need to cancel, and how refunds work.",
    updated: UPDATED,
    draft: true,
    sections: [
      {
        heading: "How refunds work",
        paragraphs: [
          `To confirm a trip you pay a ${booking.depositPercent}% deposit, and the balance is due ${booking.balanceDue}. If you cancel, the refund depends on how long before the start of your trip you tell us:`,
        ],
        list: booking.cancellation.map((c) => `${c.when}: ${c.refund.charAt(0).toLowerCase()}${c.refund.slice(1)}.`),
      },
      {
        heading: "How to cancel",
        paragraphs: [
          `Tell us in writing, by email to ${contact.email} or on WhatsApp to ${contact.phone}. The date we receive your message is the date we use to work out your refund.`,
        ],
      },
      {
        heading: "Costs we cannot get back",
        paragraphs: [
          "Some costs paid on your behalf, such as certain park permits and domestic flights, may not be refundable by the provider. If your trip includes any, we will tell you before you pay.",
        ],
      },
      {
        heading: "Refund payments",
        paragraphs: ["We return refunds by the method you paid with, where possible. Transfer charges from banks or payment services may apply."],
      },
      {
        heading: "If we cancel",
        paragraphs: [
          "If we have to cancel your trip for reasons within our control, you get a full refund of what you have paid us. If something outside anyone's control stops the trip, such as severe weather or official travel restrictions, we will offer new dates or the closest alternative we can arrange.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "What we collect when you contact us or request a trip, why, and your rights.",
    updated: UPDATED,
    draft: true,
    sections: [
      {
        heading: "Who looks after your information",
        paragraphs: [
          `${company}, ${contact.address}, is responsible for the personal information described here. Questions or requests go to ${contact.email}.`,
        ],
      },
      {
        heading: "What we collect",
        paragraphs: ["When you send a trip request or a message, we collect what you give us:"],
        list: [
          "your name, email address and phone or WhatsApp number",
          "your nationality and the country you live in",
          "your trip details: dates, number of travellers, pickup point, the places and kind of trip you are interested in, and anything else you tell us",
          "how you would like us to contact you",
        ],
      },
      {
        heading: "Why we use it",
        paragraphs: [
          "We use your information to reply to you, plan and quote your trip, make bookings with providers once you confirm, and look after you while you travel. Nationality and country help us advise on visas and park fees.",
          "We do not sell your information, and we do not use it for marketing unless you ask us to.",
        ],
      },
      {
        heading: "Who we share it with",
        paragraphs: [
          "Only what is needed, and only with people who help us deliver your trip: lodges, hotels, transport providers, guides and park authorities once you book, and the services we use to run this website and our email (for example our hosting, database and email providers).",
          "If you choose to message us on WhatsApp, or open directions in Google Maps, those services handle your information under their own policies.",
        ],
      },
      {
        heading: "How long we keep it",
        paragraphs: [
          "We keep requests and booking records for as long as we need them to plan and run your trip and to meet our legal and accounting duties, then delete them.",
        ],
      },
      {
        heading: "Cookies and analytics",
        paragraphs: [
          "If we use website analytics, it helps us understand which pages are useful. It does not tell us who you are.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          `You can ask to see the information we hold about you, correct it, or ask us to delete it, under Kenya's Data Protection Act, 2019. Write to ${contact.email} and we will reply.`,
        ],
      },
    ],
  },
];
