export const INQUIRY_STATUSES = ["new", "in_progress", "quoted", "booked", "closed"] as const;

/** Labels for request statuses and the fields stored in a request, in reading order. */
export const STATUS_LABEL: Record<string, string> = {
  new: "New",
  in_progress: "In progress",
  quoted: "Quote sent",
  booked: "Booked",
  closed: "Closed",
};

export const FIELD_LABEL: Record<string, string> = {
  fullName: "Name",
  email: "Email",
  phone: "Phone / WhatsApp",
  nationality: "Nationality",
  country: "Lives in",
  contactPreference: "Prefers",
  packageSlug: "Tour",
  destinationSlug: "Destination",
  experienceTypes: "Interested in",
  accommodation: "Stay style",
  travelers: "Travellers",
  startDate: "Start date",
  flexibleDates: "Flexible dates",
  duration: "Length",
  arrival: "Getting here",
  pickupPoint: "Meet at",
  departureCity: "Flights from",
  message: "Message",
};

/** A stored value as readable text. */
export function show(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (value === "flights") return "Include flights in the quote";
  if (value === "pickup") return "Meet on arrival";
  return String(value);
}
