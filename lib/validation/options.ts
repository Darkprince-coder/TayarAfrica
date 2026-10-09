/** Choices shared by the forms and the validation schemas, so they can never drift apart. */

export const EXPERIENCE_TYPES = ["Safari", "Beach", "Culture", "Adventure", "Wildlife", "Family", "Honeymoon", "Custom / Other"] as const;

export const ACCOMMODATION = [
  { value: "budget", label: "Budget" },
  { value: "mid-range", label: "Mid-range" },
  { value: "luxury", label: "Luxury" },
  { value: "not-sure", label: "Not sure" },
] as const;

export const DURATIONS = [
  { value: "2-3", label: "2 to 3 days" },
  { value: "4-5", label: "4 to 5 days" },
  { value: "6-7", label: "6 to 7 days" },
  { value: "8-10", label: "8 to 10 days" },
  { value: "11-14", label: "11 to 14 days" },
  { value: "15+", label: "15 days or more" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

/** Common pickup points, offered as suggestions; travellers can type anything. */
export const PICKUP_SUGGESTIONS = [
  "Nairobi: Jomo Kenyatta International Airport (JKIA)",
  "Nairobi: my hotel or home",
  "Nairobi: Wilson Airport",
  "Mombasa: Moi International Airport",
  "Mombasa: my hotel",
  "Arusha: Kilimanjaro International Airport",
  "Zanzibar: Abeid Amani Karume Airport",
] as const;

export const CONTACT_PREFERENCES = [
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Phone call" },
] as const;

export const ACCOMMODATION_VALUES = ACCOMMODATION.map((a) => a.value) as [string, ...string[]];
export const DURATION_VALUES = DURATIONS.map((d) => d.value) as [string, ...string[]];
export const CONTACT_VALUES = CONTACT_PREFERENCES.map((c) => c.value) as [string, ...string[]];

export const labelFor = (list: readonly { value: string; label: string }[], value: string) =>
  list.find((x) => x.value === value)?.label ?? value;
