"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { VehicleSize } from "@/config/services";
import type { BookingIntent } from "@/lib/booking";
import { BookingDrawer } from "@/components/booking/BookingDrawer";
import { MembershipDrawer } from "@/components/booking/MembershipDrawer";

type BookingContextValue = {
  openBooking: (intent: BookingIntent) => void;
  closeBooking: () => void;
  openMembership: (vehicle: VehicleSize) => void;
  closeMembership: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

function focusWhenConnected(element: HTMLElement | null, fallbackSelector?: string) {
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    if (element?.isConnected) {
      element.focus();
      return;
    }
    if (fallbackSelector) {
      document.querySelector<HTMLElement>(fallbackSelector)?.focus();
    }
  }, 0);
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [membershipVehicle, setMembershipVehicle] =
    useState<VehicleSize>("sedan");
  const [intent, setIntent] = useState<BookingIntent>({
    vehicle: "sedan",
    service: "complete",
    pricingMode: "standard",
  });
  const bookingTrigger = useRef<HTMLElement | null>(null);
  const membershipTrigger = useRef<HTMLElement | null>(null);

  const openBooking = useCallback((next: BookingIntent) => {
    const active = document.activeElement;
    if (active instanceof HTMLElement) bookingTrigger.current = active;
    setMembershipOpen(false);
    setIntent(next);
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => setOpen(false), []);

  const openMembership = useCallback((vehicle: VehicleSize) => {
    const active = document.activeElement;
    if (active instanceof HTMLElement) membershipTrigger.current = active;
    setOpen(false);
    setMembershipVehicle(vehicle);
    setMembershipOpen(true);
  }, []);

  const closeMembership = useCallback(() => setMembershipOpen(false), []);

  const handleBookingOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      focusWhenConnected(bookingTrigger.current);
    }
  }, []);

  const handleMembershipOpenChange = useCallback((next: boolean) => {
    setMembershipOpen(next);
    if (!next) {
      focusWhenConnected(
        membershipTrigger.current,
        "#membership button",
      );
    }
  }, []);

  const value = useMemo(
    () => ({
      openBooking,
      closeBooking,
      openMembership,
      closeMembership,
    }),
    [openBooking, closeBooking, openMembership, closeMembership],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingDrawer
        open={open}
        onOpenChange={handleBookingOpenChange}
        intent={intent}
        onBecomeMember={openMembership}
      />
      <MembershipDrawer
        open={membershipOpen}
        onOpenChange={handleMembershipOpenChange}
        vehicle={membershipVehicle}
      />
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }
  return context;
}
