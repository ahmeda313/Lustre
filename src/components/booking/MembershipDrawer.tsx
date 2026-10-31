"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import { membership } from "@/config/membership";
import { vehicleSizes, type VehicleSize } from "@/config/services";
import { formatINR } from "@/lib/format";
import {
  initialMembershipValues,
  membershipRequestSchema,
  type MembershipRequestValues,
} from "@/lib/membership-request";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { CloseIcon } from "@/components/ui/icons";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: VehicleSize;
};

const vehicleOptions = vehicleSizes.map((entry) => ({
  value: entry.id,
  label: entry.label,
}));

const inputClass =
  "mt-2 block h-11 w-full rounded-none border-0 border-b border-hairline-dark bg-transparent p-0 text-[16px] text-bone placeholder:text-stone/60 focus:border-bone";

export function MembershipDrawer({ open, onOpenChange, vehicle }: Props) {
  const [values, setValues] = useState<MembershipRequestValues>(() =>
    initialMembershipValues(vehicle),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"form" | "done">("form");
  const [submitted, setSubmitted] =
    useState<MembershipRequestValues | null>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setValues(initialMembershipValues(vehicle));
    setErrors({});
    setStatus("form");
    setSubmitted(null);
  }, [open, vehicle]);

  useEffect(() => {
    if (status !== "done") return;
    confirmationRef.current?.focus();
  }, [status]);

  function update<K extends keyof MembershipRequestValues>(
    key: K,
    value: MembershipRequestValues[K],
  ) {
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
    const result = membershipRequestSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      const first = Object.keys(nextErrors)[0];
      if (first) {
        document.getElementById(`member-field-${first}`)?.focus();
      }
      return;
    }

    setSubmitted(result.data);
    setStatus("done");
  }

  const selectedVehicle =
    vehicleSizes.find((entry) => entry.id === values.vehicle)?.label ?? "Sedan";

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
            document.getElementById("membership-drawer-close")?.focus();
          }}
        >
          <div className="flex shrink-0 items-start justify-between gap-6 border-b border-hairline-dark px-6 py-5">
            <div>
              <span className="label text-stone">{membership.drawer.eyebrow}</span>
              <Dialog.Title className="mt-2 font-display text-[32px] leading-none tracking-[-0.02em] text-bone">
                {membership.drawer.title}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                id="membership-drawer-close"
                type="button"
                className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-stone transition-colors duration-ui ease-luxe hover:text-bone"
                aria-label="Close"
              >
                <CloseIcon size={20} />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">
            {membership.drawer.description}
          </Dialog.Description>

          <div className="shrink-0 border-b border-hairline-dark bg-graphite px-6 py-5">
            <div className="flex items-baseline justify-between gap-4">
              <span className="label text-bone">{membership.name}</span>
              <span className="label text-brass">
                {membership.discountPercent}% off
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-[15px] text-bone">Every wash, all year</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-stone">
                  {membership.validityMonths} months
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-[28px] leading-none text-bone">
                  INR {formatINR(membership.annualFee)}
                </p>
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-stone">
                  Per year
                </p>
              </div>
            </div>
          </div>

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
                <span className="label text-stone">
                  {membership.drawer.confirmationEyebrow}
                </span>
                <h3 className="mt-4 font-display text-[clamp(38px,6vw,48px)] leading-[0.95] tracking-[-0.02em] text-bone">
                  {membership.drawer.confirmationTitle}
                </h3>
                <p className="mt-5 max-w-[40ch] text-body text-stone">
                  {membership.drawer.confirmationBody}
                </p>

                <dl className="mt-10 space-y-3 border-t border-hairline-dark pt-5 font-mono text-[10px] uppercase tracking-[0.12em]">
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone">Membership</dt>
                    <dd className="text-right text-bone">{membership.name}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone">Vehicle</dt>
                    <dd className="text-right text-bone">{selectedVehicle}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone">Term</dt>
                    <dd className="text-right text-bone">
                      {membership.validityMonths} months
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-hairline-dark pt-3">
                    <dt className="text-stone">Fee</dt>
                    <dd className="text-right text-bone">
                      INR {formatINR(membership.annualFee)}
                    </dd>
                  </div>
                </dl>

                <p className="mt-5 text-sm leading-relaxed text-stone">
                  {membership.drawer.confirmationNote}
                </p>

                <Button
                  variant="secondary"
                  className="mt-10 w-full"
                  onClick={() => onOpenChange(false)}
                >
                  {membership.drawer.close}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-8">
                <div data-field="name">
                  <label htmlFor="member-field-name" className="label text-stone">
                    Name
                  </label>
                  <input
                    id="member-field-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) => update("name", event.target.value)}
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "member-error-name" : undefined}
                    className={cn(inputClass, errors.name && "border-brass")}
                  />
                  {errors.name ? (
                    <p
                      id="member-error-name"
                      className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-brass"
                    >
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div data-field="phone">
                  <label htmlFor="member-field-phone" className="label text-stone">
                    Phone
                  </label>
                  <input
                    id="member-field-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="10-digit mobile number"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "member-error-phone" : undefined}
                    className={cn(inputClass, errors.phone && "border-brass")}
                  />
                  {errors.phone ? (
                    <p
                      id="member-error-phone"
                      className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-brass"
                    >
                      {errors.phone}
                    </p>
                  ) : null}
                </div>

                <div data-field="email">
                  <label htmlFor="member-field-email" className="label text-stone">
                    Email
                  </label>
                  <input
                    id="member-field-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) => update("email", event.target.value)}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "member-error-email" : undefined}
                    className={cn(inputClass, errors.email && "border-brass")}
                  />
                  {errors.email ? (
                    <p
                      id="member-error-email"
                      className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-brass"
                    >
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <fieldset data-field="vehicle">
                  <legend className="label text-stone">Vehicle size</legend>
                  <SegmentedControl
                    label="Vehicle size"
                    options={vehicleOptions}
                    value={values.vehicle as VehicleSize}
                    onValueChange={(next) => update("vehicle", next)}
                    tone="dark"
                    size="compact"
                    className="mt-3"
                  />
                </fieldset>

                <div data-field="vehicleNumber">
                  <label
                    htmlFor="member-field-vehicleNumber"
                    className="label text-stone"
                  >
                    Vehicle number{" "}
                    <span className="normal-case tracking-normal text-stone/70">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="member-field-vehicleNumber"
                    name="vehicleNumber"
                    type="text"
                    autoCapitalize="characters"
                    value={values.vehicleNumber ?? ""}
                    onChange={(event) => update("vehicleNumber", event.target.value)}
                    placeholder="KA 01 AB 1234"
                    aria-invalid={Boolean(errors.vehicleNumber)}
                    aria-describedby={
                      errors.vehicleNumber ? "member-error-vehicleNumber" : undefined
                    }
                    className={cn(
                      inputClass,
                      errors.vehicleNumber && "border-brass",
                    )}
                  />
                  {errors.vehicleNumber ? (
                    <p
                      id="member-error-vehicleNumber"
                      className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-brass"
                    >
                      {errors.vehicleNumber}
                    </p>
                  ) : null}
                </div>

                <div data-field="address">
                  <label htmlFor="member-field-address" className="label text-stone">
                    Address / area
                  </label>
                  <textarea
                    id="member-field-address"
                    name="address"
                    rows={2}
                    autoComplete="street-address"
                    value={values.address}
                    onChange={(event) => update("address", event.target.value)}
                    placeholder="Flat, building, street, area"
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby={
                      errors.address ? "member-error-address" : undefined
                    }
                    className={cn(
                      inputClass,
                      "h-auto min-h-[56px] resize-none py-2",
                      errors.address && "border-brass",
                    )}
                  />
                  {errors.address ? (
                    <p
                      id="member-error-address"
                      className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-brass"
                    >
                      {errors.address}
                    </p>
                  ) : null}
                </div>

                <div className="border border-hairline-dark p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone">
                    {membership.drawer.paymentPlaceholder}
                  </p>
                </div>

                <div className="border-t border-hairline-dark pt-6">
                  <Button type="submit" className="w-full">
                    {membership.drawer.submit}
                  </Button>
                  <p className="mt-3 text-[11px] leading-relaxed text-stone">
                    Nothing is charged today. We confirm the membership before
                    payment.
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
