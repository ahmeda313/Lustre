export const vehicleSizes = [
  { id: "hatchback", label: "Hatchback" },
  { id: "sedan", label: "Sedan" },
  { id: "suv", label: "SUV" },
] as const;

export type VehicleSize = (typeof vehicleSizes)[number]["id"];

export type ServiceId = "exterior" | "interior" | "complete";

type Service = {
  id: ServiceId;
  name: string;
  promise: string;
  duration: string;
  includes: readonly string[];
  process?: readonly string[];
  note?: string;
  buttonLabel: string;
};

export const services: readonly Service[] = [
  {
    id: "exterior",
    name: "Exterior",
    promise:
      "A careful hand wash that leaves the paint clean, dry and free of streaks.",
    duration: "Approx. 60 min",
    includes: [
      "Hand wash with microfibre mitts",
      "Wheels, tyres and arches",
      "Door jambs wiped",
      "Streak-free exterior glass",
      "Hand dry and tyre dressing",
    ],
    process: [
      "Pre-rinse to lift loose dirt",
      "Snow-foam soak",
      "Two-bucket hand wash with microfibre mitts",
      "Wheels, tyres and arches cleaned",
      "Door jambs wiped",
      "Streak-free glass",
      "Hand dry, tyre dressing",
    ],
    buttonLabel: "Book exterior",
  },
  {
    id: "interior",
    name: "Interior",
    promise:
      "Every surface you touch, vacuumed, wiped and brushed clean.",
    duration: "Approx. 50 min",
    includes: [
      "Full vacuum, including the boot",
      "Dashboard and console wiped",
      "Vents and crevices brushed",
      "Floor mats cleaned",
      "Inside glass polished",
    ],
    process: [
      "Full vacuum: seats, carpets, boot",
      "Dashboard, console and door panels wiped",
      "Vents, cup holders and crevices detailed with brushes",
      "Floor mats cleaned",
      "Inside glass polished",
      "Light trim conditioning",
    ],
    note: "No fragrance sprays.",
    buttonLabel: "Book interior",
  },
  {
    id: "complete",
    name: "Complete",
    promise:
      "The exterior and the interior in one visit, for less than booking them separately.",
    duration: "Approx. 1 hr 45 min",
    includes: [
      "Full exterior hand wash",
      "Full interior clean",
      "Wheels and arches",
      "Glass, inside and out",
      "One visit, one price",
    ],
    buttonLabel: "Book complete",
  },
];

export const priceByVehicle: Record<
  ServiceId,
  Record<VehicleSize, number>
> = {
  exterior: { hatchback: 349, sedan: 449, suv: 549 },
  interior: { hatchback: 399, sedan: 499, suv: 649 },
  complete: { hatchback: 649, sedan: 799, suv: 999 },
};

export const pricingCopy = {
  eyebrowNumber: "02",
  eyebrowLabel: "PRICING",
  heading: ["Simple prices.", "Even less for members."],
  bestValue: "Best value",
  bestValueService: "complete",
  pricePrefix: "INR",
  perWash: "per wash",
  selectorLabel: "Vehicle size",
  completeLead: "Want both?",
  completeNote:
    "Complete wash combines exterior and interior in one visit.",
  completeLink: "See complete pricing",
} as const;

export function getService(id: ServiceId): Service {
  const service = services.find((entry) => entry.id === id);
  if (!service) {
    throw new Error(`Unknown service: ${id}`);
  }
  return service;
}
