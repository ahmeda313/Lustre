import { describe, expect, it } from "vitest";
import { getBundleSaving, getWashPrice } from "@/lib/pricing";
import { priceByVehicle } from "@/config/services";

describe("getWashPrice", () => {
  it("returns the configured price for every vehicle and service", () => {
    for (const service of Object.keys(priceByVehicle) as Array<
      keyof typeof priceByVehicle
    >) {
      for (const vehicle of Object.keys(priceByVehicle[service]) as Array<
        keyof (typeof priceByVehicle)[typeof service]
      >) {
        expect(getWashPrice(vehicle, service)).toBe(
          priceByVehicle[service][vehicle],
        );
      }
    }
  });

  it("matches the agreed price table", () => {
    expect(getWashPrice("hatchback", "exterior")).toBe(349);
    expect(getWashPrice("sedan", "exterior")).toBe(449);
    expect(getWashPrice("suv", "exterior")).toBe(549);

    expect(getWashPrice("hatchback", "interior")).toBe(399);
    expect(getWashPrice("sedan", "interior")).toBe(499);
    expect(getWashPrice("suv", "interior")).toBe(649);

    expect(getWashPrice("hatchback", "complete")).toBe(649);
    expect(getWashPrice("sedan", "complete")).toBe(799);
    expect(getWashPrice("suv", "complete")).toBe(999);
  });

  it("keeps the complete wash cheaper than booking the two separately", () => {
    expect(getBundleSaving("hatchback")).toBeGreaterThan(0);
    expect(getBundleSaving("sedan")).toBeGreaterThan(0);
    expect(getBundleSaving("suv")).toBeGreaterThan(0);
  });
});
