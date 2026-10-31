import { membership } from "./membership";

const memberCars =
  membership.vehiclesPerMembership === 1
    ? "one car"
    : `${membership.vehiclesPerMembership} cars`;

export const faq = {
  eyebrowNumber: "03",
  eyebrowLabel: "FAQ",
  heading: "Questions, answered.",
  headingItalic: "answered.",
  items: [
    {
      id: "how-it-works",
      question: "How does doorstep service work?",
      answer:
        "We arrive with filtered water, our own power supply and everything else we need. You provide a parking spot with about two metres of clearance around the car. We connect, wash and leave the area as we found it.",
    },
    {
      id: "duration",
      question: "How long does a wash take?",
      answer:
        "An exterior wash is about sixty minutes. An interior wash is about fifty. A complete wash takes around one hour forty-five, depending on the size and condition of the car. We give you a closer estimate when we confirm.",
    },
    {
      id: "rain",
      question: "What if it rains?",
      answer:
        "Light rain does not stop us. We work under cover where the parking allows. In heavy rain we reschedule to the next available slot at no charge, and your booking stays in the queue.",
    },
    {
      id: "membership",
      question: `What is the ${membership.name} membership?`,
      answer: `${membership.name} is a yearly membership. You pay INR ${membership.annualFee.toLocaleString("en-IN")} once and get ${membership.discountPercent}% off every exterior, interior and complete wash for ${membership.validityMonths} months. There is no fixed schedule; you book a wash whenever you need one.`,
    },
    {
      id: "member-pricing",
      question: "How does the member discount work?",
      answer: `The member price is applied automatically to every wash you book while your membership is active. You do not need a code, and there is no minimum number of washes.`,
    },
    {
      id: "member-term",
      question:
        "How long does membership last, and what happens at the end?",
      answer: `Your membership lasts ${membership.validityMonths} months from the date it starts. ${membership.terms.renewal}`,
    },
    {
      id: "refunds",
      question: "Can I cancel or get a refund?",
      answer: membership.terms.refund,
    },
    {
      id: "multiple",
      question: "Can I use one membership for more than one car?",
      answer: `One membership covers ${memberCars}. If you have another car, it needs its own membership.`,
    },
  ],
} as const;

export type FaqItem = (typeof faq.items)[number];
