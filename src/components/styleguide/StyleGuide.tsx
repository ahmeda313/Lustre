"use client";

import { useState } from "react";
import Image from "next/image";
import { brand } from "@/config/brand";
import { images } from "@/config/images";
import { priceByVehicle, pricingCopy, vehicleSizes } from "@/config/services";
import { membership } from "@/config/membership";
import { formatINR } from "@/lib/format";
import { getWashPrice } from "@/lib/pricing";
import { getMemberPriceFor, type PricingMode } from "@/lib/membership";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { VehicleIcon } from "@/components/ui/VehicleIcon";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { TextLink } from "@/components/ui/TextLink";
import { TickIcon } from "@/components/ui/icons";
import { useBooking } from "@/components/providers/BookingProvider";
import type { VehicleSize } from "@/config/services";

const palette = [
  { name: "Obsidian", token: "--obsidian", value: "#0A0A0B", text: "bone" },
  { name: "Graphite", token: "--graphite", value: "#111113", text: "bone" },
  { name: "Carbon", token: "--carbon", value: "#1A1A1D", text: "bone" },
  { name: "Bone", token: "--bone", value: "#EDE9E1", text: "ink" },
  { name: "Stone", token: "--stone", value: "#9A968E", text: "ink" },
  { name: "Stone Ink", token: "--stone-ink", value: "#5E5B55", text: "bone" },
  { name: "Brass", token: "--brass", value: "#C6A664", text: "ink" },
];

const vehicleOptions = vehicleSizes.map((vehicle) => ({
  value: vehicle.id,
  label: vehicle.label,
  icon: <VehicleIcon vehicle={vehicle.id} className="h-auto w-[72px]" />,
}));

export function StyleGuide() {
  const { openBooking, openMembership } = useBooking();
  const [vehicle, setVehicle] = useState<VehicleSize>("sedan");
  const [wash, setWash] = useState("complete");
  const [pricingMode, setPricingMode] = useState<PricingMode>("standard");

  return (
    <div className="bg-obsidian">
      <section className="grain pb-16 pt-[calc(var(--nav-height)+56px)] lg:pb-24 lg:pt-[calc(var(--nav-height)+96px)]">
        <div className="container-x">
          <Eyebrow number="SG" label="Design system" />
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
            <h1 className="text-h2 text-bone lg:col-span-8">
              Obsidian
              <br />
              <em className="italic">&amp; Bone.</em>
            </h1>
            <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="max-w-[38ch] text-body text-stone">
                The working parts of the {brand.name} identity: colour, type,
                rhythm and the small set of controls used across the site.
              </p>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-stone">
                Internal reference / v1.0
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline-dark py-16 lg:py-24">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-3">
            <span className="label text-stone">01 / Colour</span>
            <h2 className="mt-4 font-display text-[clamp(30px,3vw,40px)] leading-none text-bone">
              Three darks,
              <br />
              <em className="italic">one light.</em>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-px border border-hairline-dark bg-hairline-dark sm:grid-cols-3 lg:col-span-8 lg:col-start-5 lg:grid-cols-4">
            {palette.map((colour) => (
              <div key={colour.name} className="bg-obsidian p-4">
                <div
                  className="h-24 w-full border border-hairline-dark"
                  style={{ backgroundColor: colour.value }}
                />
                <p className="mt-3 font-sans text-[13px] text-bone">
                  {colour.name}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-stone">
                  {colour.value}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-stone/60">
                  {colour.token}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-hairline-dark py-16 lg:py-24">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-3">
            <span className="label text-stone">02 / Type</span>
            <h2 className="mt-4 font-display text-[clamp(30px,3vw,40px)] leading-none text-bone">
              Serif for voice.
              <br />
              <em className="italic">Sans for work.</em>
            </h2>
            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-stone">
              Instrument Serif at 400, Geist for body and interface, Geist Mono
              for labels and figures. Two weights only: regular and medium.
            </p>
          </div>

          <div className="space-y-10 lg:col-span-8 lg:col-start-5">
            <div className="border-t border-hairline-dark pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <span className="label text-stone">Instrument Serif</span>
                <span className="font-mono text-[10px] text-stone">400 / display</span>
              </div>
              <p className="mt-5 font-display text-[clamp(56px,8vw,104px)] leading-[0.9] tracking-[-0.025em] text-bone">
                Clean, on <em className="italic">schedule.</em>
              </p>
            </div>

            <div className="border-t border-hairline-dark pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <span className="label text-stone">Geist</span>
                <span className="font-mono text-[10px] text-stone">400 / 17px</span>
              </div>
              <p className="mt-5 max-w-[58ch] text-body text-bone">
                {brand.shortDescription}
              </p>
              <p className="mt-3 max-w-[58ch] text-body text-stone">
                Secondary copy sits in stone and never drops below 13px on a
                phone.
              </p>
            </div>

            <div className="border-t border-hairline-dark pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <span className="label text-stone">Geist Mono</span>
                <span className="font-mono text-[10px] text-stone">400 / 10–12px</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                <span className="label text-stone">01 / Exterior</span>
                <span className="label text-stone">INR 449</span>
                <span className="label text-brass">Best value</span>
                <span className="label text-stone">60 min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline-dark py-16 lg:py-24">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-3">
            <span className="label text-stone">03 / Controls</span>
            <h2 className="mt-4 font-display text-[clamp(30px,3vw,40px)] leading-none text-bone">
              A small kit,
              <br />
              <em className="italic">used strictly.</em>
            </h2>
          </div>

          <div className="space-y-12 lg:col-span-8 lg:col-start-5">
            <div>
              <span className="label text-stone">Buttons</span>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button size="nav" withArrow={false}>
                  Nav
                </Button>
                <Button disabled>Disabled</Button>
              </div>
              <div className="surface-bone mt-6 inline-flex flex-wrap items-center gap-3 p-5">
                <Button tone="light">Primary</Button>
                <Button tone="light" variant="secondary">
                  Secondary
                </Button>
              </div>
            </div>

            <div>
              <span className="label text-stone">Text links</span>
              <div className="mt-4 flex flex-wrap items-center gap-8">
                <TextLink href="#top">See complete pricing</TextLink>
                <a
                  href="#top"
                  data-active="true"
                  className="link-rule text-bone"
                >
                  Active rule
                </a>
              </div>
            </div>

            <div>
              <span className="label text-stone">Segmented control</span>
              <div className="mt-4 space-y-5">
                <SegmentedControl
                  label="Vehicle size"
                  options={vehicleOptions}
                  value={vehicle}
                  onValueChange={setVehicle}
                />
                <SegmentedControl
                  label="Wash type"
                  options={[
                    { value: "exterior", label: "Exterior" },
                    { value: "interior", label: "Interior" },
                    { value: "complete", label: "Complete" },
                  ]}
                  value={wash}
                  onValueChange={setWash}
                  size="compact"
                />
                <SegmentedControl
                  label="Price type"
                  options={[
                    { value: "standard", label: "Standard" },
                    {
                      value: "member",
                      label: membership.memberLabel,
                      meta: `-${membership.discountPercent}%`,
                      metaTone: "brass",
                    },
                  ]}
                  value={pricingMode}
                  onValueChange={setPricingMode}
                  size="compact"
                />
              </div>
            </div>

            <div>
              <span className="label text-stone">Price display</span>
              <div className="mt-4 flex flex-wrap items-end gap-10">
                <div>
                  <div className="flex items-start gap-2">
                    <span className="label mt-[0.9rem] text-stone">
                      {pricingCopy.pricePrefix}
                    </span>
                    <RollingNumber
                      value={getWashPrice(vehicle, "complete")}
                      format={formatINR}
                      className="font-display text-price text-bone"
                    />
                  </div>
                  <span className="label mt-2 block text-stone">
                    {pricingCopy.perWash}
                  </span>
                </div>
                <div>
                  {vehicleSizes.map((size) => (
                    <p key={size.id} className="font-mono text-[11px] text-stone">
                      {size.label}: INR{" "}
                      {formatINR(priceByVehicle.complete[size.id])} / member INR{" "}
                      {formatINR(getMemberPriceFor(size.id, "complete"))}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <span className="label text-stone">Lists and marks</span>
              <ul className="mt-4 max-w-[44ch] space-y-3 border-t border-hairline-dark pt-5">
                {[
                  "Hairlines, not shadows",
                  "Radii from zero to four pixels",
                  "Brass for value, never for decoration",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-bone">
                    <TickIcon size={12} className="mt-[5px] shrink-0 text-stone" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="label text-stone">Drawers</span>
              <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-stone">
                Every booking and membership action opens a right-hand drawer.
                Test the validation, member pricing and the confirmation state.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    openBooking({ vehicle, service: "complete", pricingMode })
                  }
                >
                  Open wash drawer
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => openMembership(vehicle)}
                >
                  Open membership drawer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline-dark py-16 lg:py-24">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-3">
            <span className="label text-stone">04 / Image</span>
            <h2 className="mt-4 font-display text-[clamp(30px,3vw,40px)] leading-none text-bone">
              Grade once,
              <br />
              <em className="italic">hold it.</em>
            </h2>
            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-stone">
              Slight desaturation, lifted contrast, a touch of warmth. No
              duotone, no colour wash, no heavy vignette.
            </p>
          </div>
          <div className="lg:col-span-8 lg:col-start-5">
            <div className="relative aspect-[16/10] overflow-hidden bg-graphite">
              <Image
                src={images.exteriorDetail.src}
                alt={images.exteriorDetail.alt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                placeholder="blur"
                blurDataURL={images.exteriorDetail.blurDataURL}
                className="photo-grade object-cover"
              />
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-stone">
              hero / exterior / interior detail
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline-dark py-16 lg:py-24">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-3">
            <span className="label text-stone">05 / Rhythm</span>
            <h2 className="mt-4 font-display text-[clamp(30px,3vw,40px)] leading-none text-bone">
              Space is
              <br />
              <em className="italic">the material.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px border border-hairline-dark bg-hairline-dark sm:grid-cols-3 lg:col-span-8 lg:col-start-5">
            {[
              { size: "160", label: "Desktop", detail: "1280 and above" },
              { size: "112", label: "Tablet", detail: "768 to 1279" },
              { size: "80", label: "Phone", detail: "Below 768" },
            ].map((step) => (
              <div key={step.size} className="bg-obsidian p-5">
                <span className="font-display text-[56px] leading-none text-bone">
                  {step.size}
                </span>
                <p className="mt-4 font-sans text-[13px] text-bone">{step.label}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-stone">
                  px / {step.detail}
                </p>
                <div className="mt-6 h-px w-full bg-hairline-dark" />
                <p className="mt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-stone">
                  container 1320 / gutter 48 desktop, 24 phone
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
