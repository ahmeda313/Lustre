import {
  priceByVehicle,
  type ServiceId,
  type VehicleSize,
} from "@/config/services";

export function getWashPrice(vehicle: VehicleSize, service: ServiceId): number {
  return priceByVehicle[service][vehicle];
}

export function getBundleSaving(vehicle: VehicleSize): number {
  return (
    priceByVehicle.exterior[vehicle] +
    priceByVehicle.interior[vehicle] -
    priceByVehicle.complete[vehicle]
  );
}
