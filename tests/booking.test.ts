import { describe, expect, it } from "vitest";
import { bookingSchema, initialBookingValues } from "@/lib/booking";
import { maxDateISO, normalisePhone, todayISO } from "@/lib/format";

const valid = {
  vehicle: "sedan",
  service: "complete",
  pricingMode: "standard",
  date: todayISO(),
  time: "10:00 — 12:00",
  name: "A Rao",
  phone: "+91 79750 52435",
  address: "12, 4th Main, Indiranagar, Bengaluru",
};

describe("normalisePhone", () => {
  it("strips spaces, punctuation, +91 and a leading zero", () => {
    expect(normalisePhone("+91 79750 52435")).toBe("7975052435");
    expect(normalisePhone("079750-52435")).toBe("7975052435");
    expect(normalisePhone("(79750) 52435")).toBe("7975052435");
  });
});

describe("bookingSchema", () => {
  it("accepts a complete, valid request", () => {
    const result = bookingSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("7975052435");
      expect(result.data.name).toBe("A Rao");
    }
  });

  it("rejects an invalid mobile number", () => {
    const result = bookingSchema.safeParse({ ...valid, phone: "12345" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/10-digit/);
    }
  });

  it("rejects a past date and a date beyond the booking window", () => {
    const past = bookingSchema.safeParse({ ...valid, date: "2000-01-01" });
    expect(past.success).toBe(false);

    const far = bookingSchema.safeParse({
      ...valid,
      date: maxDateISO(400),
    });
    expect(far.success).toBe(false);
  });

  it("requires a date, slot, name and address", () => {
    const result = bookingSchema.safeParse({
      ...valid,
      date: "",
      time: "",
      name: "A",
      address: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.issues.map((issue) => issue.path[0]);
      expect(fields).toContain("date");
      expect(fields).toContain("time");
      expect(fields).toContain("name");
      expect(fields).toContain("address");
    }
  });

  it("rejects a service outside the wash menu", () => {
    const result = bookingSchema.safeParse({ ...valid, service: "wax" });
    expect(result.success).toBe(false);
  });
});

describe("initialBookingValues", () => {
  it("prefills the intent and the first available slot", () => {
    const values = initialBookingValues({
      vehicle: "suv",
      service: "complete",
      pricingMode: "member",
    });
    expect(values.vehicle).toBe("suv");
    expect(values.service).toBe("complete");
    expect(values.pricingMode).toBe("member");
    expect(values.date).toBe(todayISO());
    expect(values.time.length).toBeGreaterThan(0);
    expect(values.name).toBe("");
  });
});
