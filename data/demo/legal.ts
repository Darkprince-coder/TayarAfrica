import type { LegalPage } from "@/lib/content/types";
import { siteConfig } from "@/lib/site";
import { siteSettings } from "./people-and-site";

/**
 * Legal texts approved by the client (2026-10-31); the Cancellation and Refund Policy is the
 * client's own wording. The live copies are edited in the admin. Booking numbers come from siteSettings.booking.
 */
const { booking } = siteSettings;
const { contact } = siteConfig;
const company = siteConfig.legalName;
const methods = booking.paymentMethods.join(", ").replace(/, ([^,]*)$/, " or $1");
const UPDATED = "2026-10-31";

export const legalPages: LegalPage[] = [
  {
    slug: "terms",
    title: "Terms of Service",
    summary: "How a trip request becomes a booking, how payment works, and what each of us is responsible for.",
    updated: UPDATED,
    draft: false,
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
        heading: "Information on this website",
        paragraphs: [
          "We work to keep the descriptions, seasons and prices on this website accurate, but things change: lodges close for renovation, parks change their fees, and mistakes can happen. If anything on the website differs from your written quote, the quote is what counts.",
        ],
      },
      {
        heading: "Confirming your booking",
        paragraphs: [
          `Your booking is confirmed only when you have accepted our written quote and we have received a deposit of ${booking.depositPercent}% of the trip price. We then confirm in writing.`,
          `You can pay by ${methods}. We send payment details with your quote. The balance is due ${booking.balanceDue}. If you book within 45 days of travel, the full amount is due when you book.`,
          "A quote is valid for the period stated on it. After that, prices and availability may change.",
        ],
      },
      {
        heading: "Who can book",
        paragraphs: [
          "The person who makes a booking must be 18 or older and must have the agreement of everyone they are booking for.",
          "Travellers under 18 are welcome on our trips when they travel with a parent or legal guardian, or with another adult who has the written consent of a parent or guardian. Some lodges, camps and activities set their own minimum ages; we tell you about these when we plan your trip.",
        ],
      },
      {
        heading: "Messages count as writing",
        paragraphs: [
          "Quotes, confirmations and other messages we send by email or WhatsApp count as being in writing. When you accept a quote by email or WhatsApp, that is your written acceptance.",
        ],
      },
      {
        heading: "Cancelling or changing your trip",
        paragraphs: [
          "If you need to cancel or move your dates, the fees and rules are in our Cancellation and Refund Policy. Cancellations and changes must be made in writing, by email.",
          "For other changes after booking, ask us. We will do our best, but changes depend on availability and may change the price.",
        ],
      },
      {
        heading: "Your responsibilities",
        paragraphs: ["Before you travel, please make sure that:"],
        list: [
          "your passport is valid for at least six months after your trip ends, with blank pages for stamps (most countries we visit ask for this, and a passport is required for cross-border trips such as Kenya to Tanzania)",
          "you have any visas or electronic travel authorisations you need before you travel",
          "you have the vaccinations and certificates the countries on your route require (for example a yellow fever certificate at some borders), and you have asked a doctor about malaria prevention",
          "you have checked your own government's travel advice for the countries you will visit",
          "you have travel insurance that covers cancellation, interruption of your trip, medical treatment and emergency evacuation",
          "the names and details you give us match your travel documents",
        ],
      },
      {
        heading: "If entry is refused",
        paragraphs: [
          "We are happy to point you to the official sources, but entry and health rules are set by each country and can change at short notice. We cannot accept responsibility if a traveller is refused boarding or entry because of missing or incorrect documents, and our normal cancellation terms then apply.",
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
        heading: "Links to other services",
        paragraphs: [
          "This website links to services we do not run, such as WhatsApp, Google Maps, Instagram, Facebook and the websites of lodges and parks. Their own terms and privacy policies apply when you use them.",
        ],
      },
      {
        heading: "Our photos and text",
        paragraphs: [
          "The text, photos, maps and logo on this website belong to Tayari or to the photographers and partners who license them to us. Please do not copy or reuse them without our written permission.",
        ],
      },
      {
        heading: "Law",
        paragraphs: ["These terms are governed by the laws of Kenya.", "If any part of these terms is found to be invalid, the rest still applies."],
      },
      {
        heading: "Changes to these terms",
        paragraphs: [
          "We may update these terms from time to time. The version on this page on the day you confirm your booking is the one that applies to your trip.",
        ],
      },
    ],
  },
  {
    slug: "cancellation",
    title: "Cancellation and Refund Policy",
    summary: "At Tayari Africa Tours, we understand travel plans can change. Our policy is designed to be fair to our guests while protecting the small lodges and camps we work with.",
    updated: UPDATED,
    draft: false,
    sections: [
      { heading: "1. How to cancel", paragraphs: [`All cancellations and changes must be made in writing, by email to ${contact.email}. A cancellation takes effect on the date we receive it.`] },
      {
        heading: "2. Cancellation fees",
        paragraphs: ["What we charge depends on how long before your arrival date you cancel:"],
        list: [
          "61 days or more before arrival: we keep the deposit (30%) and refund any balance paid in full. Or you can change your dates for free instead.",
          "31 to 60 days before arrival: 50% of the total booking is charged.",
          "15 to 30 days before arrival: 75% of the total booking is charged.",
          "0 to 14 days before arrival, or no-show: 100% of the total booking is charged, with no refund.",
        ],
      },
      {
        heading: "3. Payment terms",
        paragraphs: ["How bookings are paid:"],
        list: [
          `A ${booking.depositPercent}% deposit is required to confirm every booking.`,
          `The balance is due ${booking.balanceDue}.`,
          "Bookings made within 45 days of travel are paid in full (100%) at the time of booking.",
        ],
      },
      { heading: "4. Early departure and unused services", paragraphs: ["There is no refund for early departure, late arrival, or unused nights or game drives."] },
      {
        heading: "5. Date changes",
        paragraphs: ["One free date change is allowed if you ask more than 30 days before arrival. It is subject to availability and to any difference in rates, and the new dates must be within 12 months."],
      },
      {
        heading: "6. Refunds",
        paragraphs: ["Where a refund applies, we process it within 14 working days to the original payment method, minus bank charges and a 5% administration fee."],
      },
      {
        heading: "7. Force majeure",
        paragraphs: [
          "Tayari Africa Tours cannot be held liable for circumstances beyond our control, including natural disasters, pandemics, government travel restrictions or park closures. In such events, we will offer a credit voucher for future travel, valid for 12 months.",
        ],
      },
      { heading: "Travel insurance", paragraphs: ["We strongly recommend that all travellers buy comprehensive travel insurance covering cancellation, medical care and baggage."] },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "What we collect when you contact us or request a trip, why, and your rights.",
    updated: UPDATED,
    draft: false,
    sections: [
      {
        heading: "Who looks after your information",
        paragraphs: [
          `${company}, ${contact.address}, is responsible for the personal information described here. Questions or requests go to ${contact.email}.`,
        ],
      },
      {
        heading: "What we collect",
        paragraphs: [
          "When you send a trip request or a message, we collect what you give us:",
        ],
        list: [
          "your name, email address and phone or WhatsApp number",
          "your nationality and the country you live in",
          "your trip details: dates, number of travellers, where to meet you or the city you would fly from, the places and kind of trip you are interested in, and anything else you tell us",
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
        heading: "Where it is stored",
        paragraphs: [
          "Trip requests and messages sent through this website are stored by our database and website hosting providers, whose servers are in the United States. They process the information only to run the website for us. By sending a request, you understand that your information is stored outside Kenya.",
        ],
      },
      {
        heading: "Keeping it safe",
        paragraphs: [
          "Only members of the Tayari team can see trip requests. Each person has their own account, can turn on two-step sign-in, and every connection to this website is encrypted. No system is perfectly secure, but we take reasonable care to protect your information.",
          "We never ask for card numbers or payment account details through this website.",
        ],
      },
      {
        heading: "How long we keep it",
        paragraphs: [
          "We keep requests and booking records for as long as we need them to plan and run your trip and to meet our legal and accounting duties, then delete them.",
        ],
      },
      {
        heading: "Children",
        paragraphs: [
          "This website is not meant for children to use on their own. We do not knowingly collect information from anyone under 18 except through a parent or guardian planning a trip for their family. If you think a child has sent us their details, contact us and we will delete them.",
        ],
      },
      {
        heading: "Messages from us",
        paragraphs: [
          "We contact you about your request and your trip. You can ask us to stop at any time by replying by email or on WhatsApp. After that we only contact you where we must for a booking you have already made.",
        ],
      },
      {
        heading: "Cookies and analytics",
        paragraphs: [
          "This website does not use advertising or tracking cookies. It keeps a few small settings in your browser, for example so the opening animation plays only once per visit. If we add website analytics such as Google Analytics, we will update this page first.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          `You can ask to see the information we hold about you, correct it, or ask us to delete it, under Kenya's Data Protection Act, 2019. Write to ${contact.email} and we will reply.`,
        ],
      },
      {
        heading: "Changes to this policy",
        paragraphs: ["We may update this policy from time to time. The date at the top of this page shows when it last changed."],
      },
    ],
  },
];
