"use client";

import { pricingCopy, services } from "@/config/services";
import { membership } from "@/config/membership";
import { formatINR } from "@/lib/format";
import { getMemberPriceFor, getMemberSaving } from "@/lib/membership";
import { getWashPrice } from "@/lib/pricing";
import { cn } from "@/lib/cn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { VehicleIcon } from "@/components/ui/VehicleIcon";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { Button } from "@/components/ui/Button";
import { TickIcon } from "@/components/ui/icons";
import { MembershipBand } from "@/components/sections/MembershipBand";
import { useWashSelection } from "@/components/providers/WashSelectionProvider";
import { useBooking } from "@/components/providers/BookingProvider";
import { vehicleSizes } from "@/config/services";
import type { PricingMode } from "@/lib/membership";

const vehicleOptions = vehicleSizes.map((vehicle) => ({
  value: vehicle.id,
  label: vehicle.label,
  icon: (
    <VehicleIcon
      vehicle={vehicle.id}
      className="h-auto w-[80px] max-[380px]:w-[64px]"
    />
  ),
}));

const pricingModeOptions = [
  { value: "standard" as const, label: "Standard" },
  {
    value: "member" as const,
    label: membership.memberLabel,
    meta: `-${membership.discountPercent}%`,
    metaTone: "brass" as const,
  },
];

export function Pricing() {
  const {
    vehicle,
    setVehicle,
    vehicleLabel,
    pricingMode,
    setPricingMode,
  } = useWashSelection();
  const { openBooking } = useBooking();
  const isMember = pricingMode === "member";

  return (
    <section id="pricing" className="surface-bone section-pad">
      <div className="container-x">
        <SectionHeader
          tone="light"
          number={pricingCopy.eyebrowNumber}
          label={pricingCopy.eyebrowLabel}
          lines={[
            pricingCopy.heading[0],
            <em key="italic" className="italic">
              {pricingCopy.heading[1]}
            </em>,
          ]}
          intro={membership.pricingIntro}
        />

        <div className="mt-14 border-y border-hairline-light py-6 lg:mt-20">
          <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-6">
            <div className="lg:col-span-3">
              <span className="label text-stone-ink">Price type</span>
            </div>
            <div className="mt-4 lg:col-span-8 lg:col-start-5 lg:mt-0">
              <SegmentedControl
                tone="light"
                label="Price type"
                value={pricingMode}
                onValueChange={(next) => setPricingMode(next as PricingMode)}
                options={pricingModeOptions}
                itemsClassName="py-4 lg:py-5"
              />
            </div>
          </div>

          <div className="mt-6 border-t border-hairline-light pt-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-6">
            <div className="lg:col-span-3">
              <span className="label text-stone-ink">
                {pricingCopy.selectorLabel}
              </span>
            </div>
            <div className="mt-4 lg:col-span-8 lg:col-start-5 lg:mt-0">
              <SegmentedControl
                tone="light"
                label={pricingCopy.selectorLabel}
                value={vehicle}
                onValueChange={setVehicle}
                options={vehicleOptions}
                itemsClassName="px-2 py-4 sm:px-4 lg:py-5"
              />
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {isMember ? "Member prices. " : "Standard prices. "}
          {services
            .map(
              (service) =>
                `${service.name} for ${vehicleLabel}: ${formatINR(
                  isMember
                    ? getMemberPriceFor(vehicle, service.id)
                    : getWashPrice(vehicle, service.id),
                )} rupees`,
            )
            .join(". ")}
          .
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 lg:mt-20">
          {services.map((service, index) => {
            const standardPrice = getWashPrice(vehicle, service.id);
            const memberPrice = getMemberPriceFor(vehicle, service.id);
            const saving = getMemberSaving(vehicle, service.id);
            const price = isMember ? memberPrice : standardPrice;
            const isBest = service.id === pricingCopy.bestValueService;
            const isLast = index === services.length - 1;

            return (
              <div
                key={service.id}
                className={cn(
                  "relative flex flex-col",
                  !isLast &&
                    "border-b border-hairline-light pb-12 md:border-b-0 md:pb-0",
                  index > 0 &&
                    "pt-12 md:border-l md:border-hairline-light md:pl-6 md:pt-0 lg:pl-10",
                  index < services.length - 1 && "md:pr-6 lg:pr-10",
                )}
              >
                <div className="mb-3 flex h-4 items-center justify-end">
                  {isBest ? (
                    <span className="flex items-center gap-2 text-ink">
                      <span aria-hidden="true" className="h-1.5 w-1.5 bg-brass" />
                      <span className="label text-[10px]">
                        {pricingCopy.bestValue}
                      </span>
                    </span>
                  ) : null}
                </div>

                <div className="relative h-[2px] w-full" aria-hidden="true">
                  <span
                    className={cn(
                      "absolute inset-x-0 top-0 w-full",
                      isBest ? "h-[2px] bg-ink" : "h-px bg-hairline-light",
                    )}
                  />
                </div>

                <div className="flex flex-1 flex-col pt-7">
                  <h3 className="font-display text-[40px] leading-none tracking-[-0.02em] text-ink">
                    {service.name}
                  </h3>
                  <span className="label mt-3 text-stone-ink">
                    {service.duration}
                  </span>

                  <div className="mt-8">
                    <div className="flex min-h-[20px] items-center justify-between gap-3">
                      <span
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-[0.12em] text-brass",
                          !isMember && "invisible",
                        )}
                      >
                        Member price
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[11px] tracking-[0.06em] text-stone-ink line-through",
                          !isMember && "invisible",
                        )}
                      >
                        INR {formatINR(standardPrice)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-start gap-2">
                      <span className="label mt-[0.9rem] text-stone-ink">
                        {pricingCopy.pricePrefix}
                      </span>
                      <RollingNumber
                        value={price}
                        format={formatINR}
                        className="font-display text-price text-ink"
                        srLabel={`${formatINR(price)} rupees`}
                      />
                    </div>

                    <div className="mt-2 flex min-h-[16px] items-center">
                      <span className="label text-stone-ink">
                        {pricingCopy.perWash}
                      </span>
                    </div>

                    <div className="mt-2 min-h-[16px]">
                      <span
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-[0.1em] text-brass xl:text-[11px] xl:tracking-[0.12em]",
                          !isMember && "invisible",
                        )}
                      >
                        You save INR {formatINR(saving)} per wash
                      </span>
                    </div>
                  </div>

                  <div className="my-7 h-px bg-hairline-light" aria-hidden="true" />

                  <ul className="space-y-3">
                    {service.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[15px] leading-snug"
                      >
                        <TickIcon
                          size={12}
                          className="mt-[5px] shrink-0 text-stone-ink"
                        />
                        <span className="text-ink/85">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-10">
                    <Button
                      variant={isBest ? "primary" : "secondary"}
                      tone="light"
                      className="w-full"
                      withArrow
                      onClick={() =>
                        openBooking({
                          vehicle,
                          service: service.id,
                          pricingMode,
                        })
                      }
                    >
                      {service.buttonLabel}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <MembershipBand />
      </div>
    </section>
  );
}
