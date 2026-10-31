import { z } from "zod";
import { booking } from "@/config/site";
import { maxDateISO, normalisePhone, todayISO } from "./format";
import type { ServiceId, VehicleSize } from "@/config/services";
import type { PricingMode } from "./membership";

export type BookingIntent = {
  vehicle: VehicleSize;
  service: ServiceId;
  pricingMode: PricingMode;
};

export const bookingSchema = z.object({
  vehicle: z.enum(["hatchback", "sedan", "suv"]),
  service: z.enum(["exterior", "interior", "complete"]),
  pricingMode: z.enum(["standard", "member"]),
  date: z
    .string()
    .min(1, "Choose a date")
    .refine((value) => value >= todayISO(), "Choose today or a later date")
    .refine(
      (value) => value <= maxDateISO(booking.maxDaysAhead),
      `Choose a date within ${booking.maxDaysAhead} days`,
    ),
  time: z.string().min(1, "Choose a time slot"),
  name: z
    .string()
    .trim()
    .min(2, "Enter your name")
    .max(80, "Use 80 characters or fewer"),
  phone: z
    .string()
    .transform(normalisePhone)
    .refine((value) => /^[6-9]\d{9}$/.test(value), "Enter a 10-digit mobile number"),
  address: z
    .string()
    .trim()
    .min(10, "Enter your building, street and area")
    .max(220, "Use 220 characters or fewer"),
});

export type BookingValues = z.input<typeof bookingSchema>;

export function initialBookingValues(intent: BookingIntent): BookingValues {
  return {
    vehicle: intent.vehicle,
    service: intent.service,
    pricingMode: intent.pricingMode,
    date: todayISO(),
    time: booking.slots[0] ?? "",
    name: "",
    phone: "",
    address: "",
  };
}
