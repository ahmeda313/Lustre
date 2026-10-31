"use client";

import { motion, useReducedMotion } from "motion/react";
import { brand } from "@/config/brand";
import { membership } from "@/config/membership";
import { formatINR } from "@/lib/format";
import { getBreakEven } from "@/lib/membership";
import { Button } from "@/components/ui/Button";
import { MaskedHeading, EASE } from "@/components/ui/MaskedHeading";
import { useBooking } from "@/components/providers/BookingProvider";
import { useWashSelection } from "@/components/providers/WashSelectionProvider";

function MembershipCard() {
  const reduce = useReducedMotion();
  const memberWord = membership.memberLabel.split(" ")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: reduce ? 0.001 : 0.9,
        ease: EASE,
        delay: reduce ? 0 : 0.1,
      }}
      className="w-full max-w-[520px]"
    >
      <div
        role="img"
        aria-label={`${membership.name} membership card`}
        className="grain relative aspect-[1.586/1] w-full overflow-hidden rounded-[12px] border border-brass/60 bg-obsidian"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[1px] rounded-[11px] border border-bone/[0.06]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-0 h-px bg-bone/[0.1]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-4 left-0 w-px bg-bone/[0.05]"
        />

        <div
          aria-hidden="true"
          className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="font-sans text-[12px] font-medium leading-none tracking-[0.3em] text-bone">
              {brand.wordmark}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-stone">
              Member
            </span>
          </div>

          <div className="flex items-end justify-between gap-6">
            <p className="font-display text-[clamp(42px,6vw,64px)] italic leading-[0.85] text-brass">
              {memberWord}
            </p>
            <svg
              viewBox="0 0 90 130"
              fill="none"
              className="h-[72px] w-auto shrink-0 text-brass/70 sm:h-[86px]"
            >
              <path
                d="M12 8v106h66"
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div className="flex items-end justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.12em] text-stone">
            <span>Member no. {membership.card.memberNumber}</span>
            <span>Valid {membership.validityMonths} months</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function MembershipBand() {
  const { vehicle, vehicleLabel } = useWashSelection();
  const { openMembership } = useBooking();
  const breakEven = getBreakEven(vehicle, "complete");

  return (
    <>
      <div
        id="membership"
        className="dark-inset grain relative mt-16 overflow-hidden lg:mt-20"
      >
        <div className="relative z-10 px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="order-2 lg:order-1 lg:col-span-7">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 bg-brass" />
                <span className="label text-stone">Membership</span>
              </div>

              <MaskedHeading
                as="h3"
                lines={[
                  "Become a",
                  <em key="member" className="italic">
                    {membership.memberLabel}.
                  </em>,
                ]}
                className="mt-6 font-display text-[clamp(48px,5.4vw,80px)] leading-[0.92] tracking-[-0.025em] text-bone"
              />

              <p className="mt-6 max-w-[46ch] text-body text-stone">
                {membership.description}
              </p>

              <div className="mt-10 flex flex-wrap items-end gap-x-3 gap-y-1">
                <span className="font-display text-[clamp(44px,5vw,56px)] leading-none text-bone">
                  INR {formatINR(membership.annualFee)}
                </span>
                <span className="label pb-1.5 text-stone">
                  {membership.priceUnit}
                </span>
              </div>

              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-brass">
                Pays for itself in {breakEven} complete{" "}
                {breakEven === 1 ? "wash" : "washes"} ({vehicleLabel.toLowerCase()})
              </p>

              <Button
                className="mt-8 w-full sm:w-auto"
                onClick={() => openMembership(vehicle)}
              >
                Become a member
              </Button>

              <div className="mt-10 grid grid-cols-2 border-l border-t border-hairline-dark">
                {membership.perks.map((perk) => (
                  <div
                    key={perk.title}
                    className="border-b border-r border-hairline-dark p-4 sm:p-5"
                  >
                    <h4 className="font-sans text-[14px] font-medium leading-snug tracking-[-0.01em] text-bone">
                      {perk.title}
                    </h4>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-stone">
                      {perk.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 flex justify-center lg:order-2 lg:col-span-5 lg:justify-end">
              <MembershipCard />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 max-w-[92ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-stone-ink">
        {membership.footnote}
      </p>
    </>
  );
}
