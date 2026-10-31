import type { ServiceId, VehicleSize } from "./services";

export type MemberPriceOverrides = Partial<
  Record<ServiceId, Partial<Record<VehicleSize, number>>>
>;

const DISCOUNT_PERCENT = 25;
const VALIDITY_MONTHS = 12;
const MEMBER_LABEL = "Brass Member";

export const membership = {
  name: "Lustre Brass",
  memberLabel: MEMBER_LABEL,
  annualFee: 1999,
  validityMonths: VALIDITY_MONTHS,
  discountPercent: DISCOUNT_PERCENT,
  priceOverrides: {} as MemberPriceOverrides,
  vehiclesPerMembership: 1,
  description: `One yearly fee. ${DISCOUNT_PERCENT}% off every exterior, interior and complete wash for ${VALIDITY_MONTHS} months.`,
  pricingIntro: `Pay per wash, or become a ${MEMBER_LABEL} and take ${DISCOUNT_PERCENT}% off every wash for a year.`,
  priceUnit: "/ year",
  perks: [
    {
      title: `${DISCOUNT_PERCENT}% off every wash`,
      description: "Exterior, interior and complete. Every time, all year.",
    },
    {
      title: "Priority booking",
      description: "Members get first pick of slots, including weekends.",
    },
    {
      title: `Price locked for ${VALIDITY_MONTHS} months`,
      description: "Standard price rises will not affect you until renewal.",
    },
    {
      title: "Free rescheduling",
      description: "Move your booking up to 24 hours before at no cost.",
    },
  ],
  terms: {
    refund:
      "Cancel within 14 days of joining, before using the member rate, for a full refund. After that, the fee is not refunded, but the membership stays active for the full twelve months.",
    renewal:
      "We send a reminder before your membership ends. It does not renew automatically; you choose whether to continue.",
  },
  footnote:
    "Membership fee is paid once per year. Member pricing applies to all washes booked during the membership period. Terms apply.",
  card: {
    memberNumber: "0001",
  },
  drawer: {
    eyebrow: "MEMBERSHIP",
    title: "Become a member",
    description:
      "Membership request form. We confirm every membership on WhatsApp.",
    submit: "Continue to payment",
    paymentPlaceholder: "Secure payment will appear here.",
    confirmationEyebrow: "MEMBERSHIP REQUEST",
    confirmationTitle: "Request received.",
    confirmationBody:
      "We'll confirm your membership on WhatsApp shortly.",
    confirmationNote:
      "We'll send a secure payment link on WhatsApp. Your membership starts once payment is confirmed.",
    close: "Close",
  },
} as const;
