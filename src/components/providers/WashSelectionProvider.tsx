"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { VehicleSize } from "@/config/services";
import { vehicleSizes } from "@/config/services";
import type { PricingMode } from "@/lib/membership";

type WashSelection = {
  vehicle: VehicleSize;
  setVehicle: (vehicle: VehicleSize) => void;
  vehicleLabel: string;
  pricingMode: PricingMode;
  setPricingMode: (mode: PricingMode) => void;
};

const WashSelectionContext = createContext<WashSelection | null>(null);

export function WashSelectionProvider({ children }: { children: ReactNode }) {
  const [vehicle, setVehicleState] = useState<VehicleSize>("sedan");
  const [pricingMode, setPricingModeState] = useState<PricingMode>("standard");

  const setVehicle = useCallback((next: VehicleSize) => {
    setVehicleState(next);
  }, []);

  const setPricingMode = useCallback((next: PricingMode) => {
    setPricingModeState(next);
  }, []);

  const value = useMemo<WashSelection>(() => {
    const match = vehicleSizes.find((entry) => entry.id === vehicle);
    return {
      vehicle,
      setVehicle,
      vehicleLabel: match?.label ?? "Sedan",
      pricingMode,
      setPricingMode,
    };
  }, [vehicle, setVehicle, pricingMode, setPricingMode]);

  return (
    <WashSelectionContext.Provider value={value}>
      {children}
    </WashSelectionContext.Provider>
  );
}

export function useWashSelection(): WashSelection {
  const context = useContext(WashSelectionContext);
  if (!context) {
    throw new Error("useWashSelection must be used inside WashSelectionProvider");
  }
  return context;
}
