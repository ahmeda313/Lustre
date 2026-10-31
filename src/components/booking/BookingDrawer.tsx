"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import { booking } from "@/config/site";
import { membership } from "@/config/membership";
import {
  getService,
  vehicleSizes,
  type ServiceId,
  type VehicleSize,
} from "@/config/services";
import { formatDateLabel, formatINR, maxDateISO, todayISO } from "@/lib/format";
import {
  bookingSchema,
  initialBookingValues,
  type BookingIntent,
  type BookingValues,
} from "@/lib/booking";
import { getMemberPriceFor, getMemberSaving } from "@/lib/membership";
import { getWashPrice } from "@/lib/pricing";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { CloseIcon } from "@/components/ui/icons";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intent: BookingIntent;
  onBecomeMember: (vehicle: VehicleSize) => void;
};

const vehicleOptions = vehicleSizes.map((vehicle) => ({
  value: vehicle.id,
  label: vehicle.label,
}));

const washOptions = [
  { value: "exterior" as const, label: "Exterior" },
  { value: "interior" as const, label: "Interior" },
  { value: "complete" as const, label: "Complete" },
];

const inputClass =
  "mt-2 block h-11 w-full rounded-none border-0 border-b border-hairline-dark bg-transparent p-0 text-[16px] text-bone placeholder:text-stone/60 focus:border-bone";

export function BookingDrawer({
  open,
  onOpenChange,
  intent,
  onBecomeMember,
}: Props) {
  const [values, setValues] = useState<BookingValues>(() =>
    initialBookingValues(intent),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"form" | "done">("form");
  const [submitted, setSubmitted] = useState<BookingValues | null>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setValues(initialBookingValues(intent));
    setErrors({});
    setStatus("form");
    setSubmitted(null);
  }, [open, intent]);

  useEffect(() => {
    if (status !== "done") return;
    confirmationRef.current?.focus();
  }, [status]);

  function update<K extends keyof BookingValues>(key: K, value: BookingValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = bookingSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      const first = Object.keys(nextErrors)[0];
      if (first) {
        const field =
          document.getElementById(`field-${first}`) ??
          document.querySelector<HTMLElement>(
            `[data-field="${first}"] [role="radio"], [data-field="${first}"] input`,
          );
        field?.focus();
      }
      return;
    }

    setSubmitted(result.data);
    setStatus("done");
  }

  const isMember = values.pricingMode === "member";
  const standardPrice = getWashPrice(values.vehicle, values.service);
  const memberPrice = getMemberPriceFor(values.vehicle, values.service);
  const saving = getMemberSaving(values.vehicle, values.service);
  const activePrice = isMember ? memberPrice : standardPrice;
  const selectedVehicle =
    vehicleSizes.find((entry) => entry.id === values.vehicle)?.label ?? "Sedan";
  const selectedService = getService(values.service).name;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="drawer-overlay fixed inset-0 z-[90] bg-obsidian/75"
          onClick={() => onOpenChange(false)}
        />
        <Dialog.Content
          className="drawer-content fixed inset-y-0 right-0 z-[100] flex w-full flex-col border-l border-hairline-dark bg-obsidian text-bone sm:max-w-[560px]"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            document.getElementById("drawer-close")?.focus();
          }}
        >
          <div className="flex shrink-0 items-start justify-between gap-6 border-b border-hairline-dark px-6 py-5">
            <div>
              <span className="label text-stone">{booking.eyebrow}</span>
              <Dialog.Title className="mt-2 font-display text-[32px] leading-none tracking-[-0.02em] text-bone">
                {booking.title}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                id="drawer-close"
                type="button"
                className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-stone transition-colors duration-ui ease-luxe hover:text-bone"
                aria-label="Close"
              >
                <CloseIcon size={20} />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">
            Booking request form. We confirm every request on WhatsApp.
          </Dialog.Description>

          {status === "form" ? (
            <div className="shrink-0 border-b border-hairline-dark bg-graphite px-6 py-5">
              <div className="flex items-baseline justify-between gap-4">
                <span
                  className={cn(
                    "label",
                    isMember ? "text-brass" : "text-stone",
                  )}
                >
                  {isMember ? "Member price" : "Standard price"}
                </span>
                <span className="label text-stone">
                  {selectedVehicle} / {selectedService}
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  {isMember ? (
                    <p className="font-mono text-[11px] tracking-[0.06em] text-stone line-through">
                      INR {formatINR(standardPrice)}
                    </p>
                  ) : null}
                  <p className="font-display text-[34px] leading-none text-bone">
                    INR {formatINR(activePrice)}
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em]",
                      isMember ? "text-brass" : "text-stone",
                    )}
                  >
                    {isMember
                      ? `You save INR ${formatINR(saving)} per wash`
                      : "Per wash"}
                  </p>
                </div>
              </div>

              {isMember ? (
                <p className="mt-3 text-[11px] leading-relaxed text-stone">
                  Member pricing applies for {membership.validityMonths} months.
                  You pay the member price each time you book.
                </p>
              ) : (
                <div className="mt-3 border-t border-hairline-dark pt-3">
                  <p className="text-[11px] leading-relaxed text-stone">
                    Members pay INR {formatINR(memberPrice)} for this wash. Join
                    for INR {formatINR(membership.annualFee)} a year.
                  </p>
                  <button
                    type="button"
                    onClick={() => onBecomeMember(values.vehicle)}
                    className="link-rule mt-1 inline-flex min-h-[44px] items-center text-[12px] text-bone"
                  >
                    Become a member
                  </button>
                </div>
              )}
            </div>
          ) : null}

          <div
            className="flex-1 overflow-y-auto overscroll-contain px-6 py-7"
            data-lenis-prevent
          >
            {status === "done" && submitted ? (
              <div
                ref={confirmationRef}
                tabIndex={-1}
                className="flex min-h-full flex-col justify-center py-8 outline-none"
              >
                <span className="label text-stone">Booking request</span>
                <h3 className="mt-4 font-display text-[clamp(38px,6vw,48px)] leading-[0.95] tracking-[-0.02em] text-bone">
                  {booking.confirmation.title}
                </h3>
                <p className="mt-5 max-w-[40ch] text-body text-stone">
                  {booking.confirmation.body}
                </p>

                <dl className="mt-10 space-y-3 border-t border-hairline-dark pt-5 font-mono text-[10px] uppercase tracking-[0.12em]">
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone">Vehicle</dt>
                    <dd className="text-right text-bone">
                      {
                        vehicleSizes.find(
                          (v) => v.id === submitted.vehicle,
                        )?.label
                      }
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone">Wash</dt>
                    <dd className="text-right text-bone">
                      {getService(submitted.service as ServiceId).name}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone">Date</dt>
                    <dd className="text-right text-bone">
                      {formatDateLabel(submitted.date)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone">Time</dt>
                    <dd className="text-right text-bone">{submitted.time}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-hairline-dark pt-3">
                    <dt className="text-stone">
                      {submitted.pricingMode === "member"
                        ? "Member price"
                        : "Price"}
                    </dt>
                    <dd className="text-right text-bone">
                      INR{" "}
                      {formatINR(
                        submitted.pricingMode === "member"
                          ? getMemberPriceFor(
                              submitted.vehicle,
                              submitted.service,
                            )
                          : getWashPrice(
                              submitted.vehicle,
                              submitted.service,
                            ),
                      )}
                    </dd>
                  </div>
                </dl>

                <p className="mt-5 text-sm leading-relaxed text-stone">
                  {booking.confirmation.note}
                </p>

                <Button
                  variant="secondary"
                  className="mt-10 w-full"
                  onClick={() => onOpenChange(false)}
                >
                  {booking.confirmation.close}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-8">
                <fieldset data-field="vehicle">
                  <legend className="label text-stone">{booking.labels.vehicle}</legend>
                  <SegmentedControl
                    label={booking.labels.vehicle}
                    options={vehicleOptions}
                    value={values.vehicle as VehicleSize}
                    onValueChange={(next) => update("vehicle", next)}
                    tone="dark"
                    size="compact"
                    className="mt-3"
                  />
                </fieldset>

                <fieldset data-field="service">
                  <legend className="label text-stone">{booking.labels.service}</legend>
                  <SegmentedControl
                    label={booking.labels.service}
                    options={washOptions}
                    value={values.service as ServiceId}
                    onValueChange={(next) => update("service", next)}
                    tone="dark"
                    size="compact"
                    className="mt-3"
                  />
                </fieldset>

                <div data-field="date">
                  <label htmlFor="field-date" className="label text-stone">
                    {booking.labels.date}
                  </label>
                  <input
                    id="field-date"
                    name="date"
                    type="date"
                    value={values.date}
                    min={todayISO()}
                    max={maxDateISO(booking.maxDaysAhead)}
                    onChange={(event) => update("date", event.target.value)}
                    aria-invalid={Boolean(errors.date)}
                    aria-describedby={errors.date ? "error-date" : undefined}
                    className={cn(inputClass, errors.date && "border-brass")}
                  />
                  {errors.date ? (
                    <p id="error-date" className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-brass">
                      {errors.date}
                    </p>
                  ) : null}
                </div>

                <fieldset data-field="time">
                  <legend className="label text-stone">{booking.labels.time}</legend>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {booking.slots.map((slot, index) => (
                      <label
                        key={slot}
                        className="relative flex h-11 cursor-pointer items-center justify-center border border-hairline-dark px-2 text-center font-mono text-[10px] uppercase tracking-[0.08em] text-stone transition-colors duration-ui ease-luxe has-[:checked]:border-bone has-[:checked]:bg-bone has-[:checked]:text-ink hover:border-stone/50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-brass"
                      >
                        <input
                          type="radio"
                          name="time"
                          value={slot}
                          checked={values.time === slot}
                          onChange={() => update("time", slot)}
                          className="sr-only"
                          id={`slot-${index}`}
                          aria-describedby={errors.time ? "error-time" : undefined}
                        />
                        {slot}
                      </label>
                    ))}
                  </div>
                  {errors.time ? (
                    <p id="error-time" className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-brass">
                      {errors.time}
                    </p>
                  ) : null}
                </fieldset>

                <div data-field="name">
                  <label htmlFor="field-name" className="label text-stone">
                    {booking.labels.name}
                  </label>
                  <input
                    id="field-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) => update("name", event.target.value)}
                    placeholder={booking.placeholders.name}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "error-name" : undefined}
                    className={cn(inputClass, errors.name && "border-brass")}
                  />
                  {errors.name ? (
                    <p id="error-name" className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-brass">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div data-field="phone">
                  <label htmlFor="field-phone" className="label text-stone">
                    {booking.labels.phone}
                  </label>
                  <input
                    id="field-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder={booking.placeholders.phone}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "error-phone" : undefined}
                    className={cn(inputClass, errors.phone && "border-brass")}
                  />
                  {errors.phone ? (
                    <p id="error-phone" className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-brass">
                      {errors.phone}
                    </p>
                  ) : null}
                </div>

                <div data-field="address">
                  <label htmlFor="field-address" className="label text-stone">
                    {booking.labels.address}
                  </label>
                  <textarea
                    id="field-address"
                    name="address"
                    rows={2}
                    autoComplete="street-address"
                    value={values.address}
                    onChange={(event) => update("address", event.target.value)}
                    placeholder={booking.placeholders.address}
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby={errors.address ? "error-address" : undefined}
                    className={cn(inputClass, "h-auto min-h-[56px] resize-none py-2", errors.address && "border-brass")}
                  />
                  {errors.address ? (
                    <p id="error-address" className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-brass">
                      {errors.address}
                    </p>
                  ) : null}
                </div>

                <div className="border-t border-hairline-dark pt-6">
                  <Button type="submit" className="w-full">
                    {booking.submit}
                  </Button>
                  <p className="mt-3 text-[11px] leading-relaxed text-stone">
                    {booking.confirmation.note}
                  </p>
                </div>
              </form>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
