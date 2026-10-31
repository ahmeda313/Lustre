import { membership } from "@/config/membership";
import {
  priceByVehicle,
  type ServiceId,
  type VehicleSize,
} from "@/config/services";
import { getWashPrice } from "./pricing";

export type PricingMode = "standard" | "member";

function roundToEndingNine(value: number): number {
  return Math.max(9, Math.round((value + 1) / 10) * 10 - 1);
}

export function getMemberPrice(standardPrice: number, override?: number): number {
  if (override !== undefined) return override;
  if (!Number.isFinite(standardPrice) || standardPrice <= 0) return 0;

  const discounted = standardPrice * (1 - membership.discountPercent / 100);
  return roundToEndingNine(discounted);
}

export function getMemberPriceFor(
  vehicle: VehicleSize,
  service: ServiceId,
): number {
  return getMemberPrice(
    priceByVehicle[service][vehicle],
    membership.priceOverrides[service]?.[vehicle],
  );
}

export function getMemberSaving(
  vehicle: VehicleSize,
  service: ServiceId,
): number {
  return getWashPrice(vehicle, service) - getMemberPriceFor(vehicle, service);
}

export function getBreakEven(
  vehicle: VehicleSize,
  service: ServiceId,
): number {
  const saving = getMemberSaving(vehicle, service);
  if (saving <= 0) {
    throw new Error("Member price must be lower than the standard price");
  }
  return Math.ceil(membership.annualFee / saving);
}
