export const brand = {
  name: "LUSTRE",
  wordmark: "LUSTRE",
  tagline: "Exterior. Interior. Done right.",
  description:
    "Professional hand washing at your doorstep. Exterior, interior or complete.",
  shortDescription:
    "Professional hand washing at your doorstep. Book a single wash, or become a member and pay less for every one.",
  serviceMode: "doorstep" as const,
  serviceModeLabel: "at your doorstep",
  currency: "INR",
  locale: "en-IN",
  domain: "https://lustre.in",
  themeColor: "#0A0A0B",
  founded: "2024",
} as const;

export type ServiceMode = typeof brand.serviceMode;
