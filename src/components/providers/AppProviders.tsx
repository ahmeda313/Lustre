import type { ReactNode } from "react";
import { BookingProvider } from "./BookingProvider";
import { SmoothScroll } from "./SmoothScroll";
import { WashSelectionProvider } from "./WashSelectionProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <WashSelectionProvider>
      <BookingProvider>
        <SmoothScroll />
        {children}
      </BookingProvider>
    </WashSelectionProvider>
  );
}
