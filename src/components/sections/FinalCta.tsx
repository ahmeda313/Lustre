"use client";

import { footer } from "@/config/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { Button } from "@/components/ui/Button";
import { useBooking } from "@/components/providers/BookingProvider";
import { useWashSelection } from "@/components/providers/WashSelectionProvider";

export function FinalCta() {
  const { openBooking } = useBooking();
  const { vehicle, pricingMode } = useWashSelection();

  return (
    <section className="grain section-pad border-t border-hairline-dark bg-obsidian">
      <div className="container-x">
        <Eyebrow
          number={footer.finalCta.eyebrowNumber}
          label={footer.finalCta.eyebrowLabel}
        />

        <div className="mt-10 border-t border-hairline-dark pt-12 lg:mt-12 lg:pt-16">
          <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-6">
            <MaskedHeading
              as="h2"
              lines={[
                "A clean car,",
                <em key="italic" className="italic">
                  {footer.finalCta.headingItalic}
                </em>,
              ]}
              className="text-h2 text-bone lg:col-span-8"
            />

            <div className="lg:col-span-4 lg:col-start-9">
              <p className="max-w-[32ch] text-body text-stone">{footer.finalCta.body}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  className="w-full sm:w-auto lg:w-full"
                  onClick={() =>
                    openBooking({ vehicle, service: "complete", pricingMode })
                  }
                >
                  Book a wash
                </Button>
                <Button
                  variant="secondary"
                  href="#membership"
                  className="w-full sm:w-auto lg:w-full"
                >
                  Become a member
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
