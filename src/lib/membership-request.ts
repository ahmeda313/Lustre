import { z } from "zod";
import { normalisePhone } from "./format";
import type { VehicleSize } from "@/config/services";

export const membershipRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name")
    .max(80, "Use 80 characters or fewer"),
  phone: z
    .string()
    .transform(normalisePhone)
    .refine((value) => /^[6-9]\d{9}$/.test(value), "Enter a 10-digit mobile number"),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email")
    .email("Enter a valid email")
    .max(160, "Use 160 characters or fewer"),
  vehicle: z.enum(["hatchback", "sedan", "suv"]),
  vehicleNumber: z
    .string()
    .trim()
    .max(20, "Use 20 characters or fewer")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .trim()
    .min(10, "Enter your building, street and area")
    .max(220, "Use 220 characters or fewer"),
});

export type MembershipRequestValues = z.input<typeof membershipRequestSchema>;

export function initialMembershipValues(
  vehicle: VehicleSize,
): MembershipRequestValues {
  return {
    name: "",
    phone: "",
    email: "",
    vehicle,
    vehicleNumber: "",
    address: "",
  };
}
