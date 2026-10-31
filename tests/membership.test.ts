import { describe, expect, it } from "vitest";
import { membership } from "@/config/membership";
import { membershipRequestSchema } from "@/lib/membership-request";
import { priceByVehicle, type ServiceId, type VehicleSize } from "@/config/services";
import {
  getBreakEven,
  getMemberPrice,
  getMemberPriceFor,
  getMemberSaving,
} from "@/lib/membership";

const expectedMemberPrices: Record<
  VehicleSize,
  Record<ServiceId, number>
> = {
  hatchback: { exterior: 259, interior: 299, complete: 489 },
  sedan: { exterior: 339, interior: 379, complete: 599 },
  suv: { exterior: 409, interior: 489, complete: 749 },
};

describe("membership config", () => {
  it("keeps the fee, term and discount in one place", () => {
    expect(membership.annualFee).toBe(1999);
    expect(membership.validityMonths).toBe(12);
    expect(membership.discountPercent).toBe(25);
    expect(membership.name).toBe("Lustre Brass");
    expect(membership.memberLabel).toBe("Brass Member");
  });
});

describe("getMemberPrice", () => {
  it("rounds the discounted price to the nearest value ending in 9", () => {
    expect(getMemberPrice(349)).toBe(259);
    expect(getMemberPrice(449)).toBe(339);
    expect(getMemberPrice(399)).toBe(299);
    expect(getMemberPrice(649)).toBe(489);
    expect(getMemberPrice(799)).toBe(599);
    expect(getMemberPrice(999)).toBe(749);
  });

  it("uses an explicit override when one is configured", () => {
    expect(getMemberPrice(449, 329)).toBe(329);
  });

  it("stays below the standard price", () => {
    for (const service of Object.keys(priceByVehicle) as ServiceId[]) {
      for (const vehicle of Object.keys(priceByVehicle[service]) as VehicleSize[]) {
        expect(getMemberPriceFor(vehicle, service)).toBeLessThan(
          priceByVehicle[service][vehicle],
        );
      }
    }
  });
});

describe("getMemberPriceFor", () => {
  it("matches the agreed member price table", () => {
    for (const vehicle of Object.keys(expectedMemberPrices) as VehicleSize[]) {
      for (const service of Object.keys(
        expectedMemberPrices[vehicle],
      ) as ServiceId[]) {
        expect(getMemberPriceFor(vehicle, service)).toBe(
          expectedMemberPrices[vehicle][service],
        );
      }
    }
  });

  it("computes the saving from the configured prices", () => {
    expect(getMemberSaving("sedan", "complete")).toBe(200);
    expect(getMemberSaving("suv", "complete")).toBe(250);
    expect(getMemberSaving("hatchback", "exterior")).toBe(90);
  });
});

describe("getBreakEven", () => {
  it("divides the annual fee by the per-wash saving", () => {
    expect(getBreakEven("sedan", "complete")).toBe(10);
    expect(getBreakEven("suv", "complete")).toBe(8);
    expect(getBreakEven("hatchback", "exterior")).toBe(23);
  });
});

describe("membership request schema", () => {
  const valid = {
    name: "Asha Rao",
    phone: "9845021006",
    email: "asha@example.com",
    vehicle: "sedan" as const,
    vehicleNumber: "",
    address: "12, 4th Main, Indiranagar, Bengaluru",
  };

  it("accepts a complete request without a vehicle number", () => {
    expect(membershipRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = membershipRequestSchema.safeParse({
      ...valid,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "email")).toBe(true);
    }
  });
});
