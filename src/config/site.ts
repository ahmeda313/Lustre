export const nav = {
  links: [
    { label: "Services", href: "#services", id: "services", number: "01" },
    { label: "Pricing", href: "#pricing", id: "pricing", number: "02" },
    { label: "Membership", href: "#membership", id: "membership", number: null },
    { label: "FAQ", href: "#faq", id: "faq", number: "03" },
  ],
  cta: "Book a wash",
} as const;

export const booking = {
  title: "Book a wash",
  eyebrow: "BOOKING REQUEST",
  slots: ["8:00 — 10:00", "10:00 — 12:00", "12:00 — 14:00", "14:00 — 16:00", "16:00 — 18:00"],
  labels: {
    vehicle: "Vehicle size",
    service: "Wash type",
    date: "Date",
    time: "Time slot",
    name: "Name",
    phone: "Phone",
    address: "Address",
  },
  placeholders: {
    name: "Your name",
    phone: "10-digit mobile number",
    address: "Flat, building, street, area",
  },
  submit: "Send request",
  confirmation: {
    title: "Request received.",
    body: "We'll confirm on WhatsApp shortly.",
    note: "If your slot is unavailable, we will offer the nearest alternative.",
    close: "Close",
  },
  maxDaysAhead: 60,
  paymentNote: "Payment is arranged after we confirm your slot.",
} as const;

export const footer = {
  contactHeading: "Contact",
  hoursHeading: "Service hours",
  areasHeading: "Areas served",
  membershipLink: { label: "Membership", href: "/#membership" },
  finalCta: {
    eyebrowNumber: "04",
    eyebrowLabel: "BOOK",
    heading: "A clean car, on schedule.",
    headingItalic: "on schedule.",
    body: "One wash, or member pricing for the year. We come to you.",
  },
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  copyright: "LUSTRE",
} as const;
