import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { contact } from "@/config/contact";
import { membership } from "@/config/membership";
import { formatINR } from "@/lib/format";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Terms",
  description: `The terms that apply when you book a wash or become a ${membership.memberLabel} with ${brand.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      number="T.01"
      label="Terms"
      title={
        <>
          The terms,
          <br />
          <em className="italic">plainly.</em>
        </>
      }
      intro={`These terms cover single washes and the ${membership.name} membership. They are written to be read, not to hide anything in the margins.`}
      updated="31 October 2026"
      sections={[
        {
          heading: "The service",
          body: (
            <>
              <p>
                {brand.name} provides hand washing at the customer&apos;s
                address: exterior, interior, or both as a complete wash. We
                bring filtered water, power and materials. The customer provides
                safe access and a parking space with roughly two metres of
                clearance around the car.
              </p>
              <p>
                We do not offer paint correction, ceramic coating, polishing or
                mechanical work. If a car needs more than a wash, we will say so
                before starting.
              </p>
            </>
          ),
        },
        {
          heading: "Booking and confirmation",
          body: (
            <p>
              A request sent through this site is not a confirmed booking. We
              confirm the date and time on WhatsApp or by phone. A slot is held
              only once we have confirmed it. If we cannot keep the slot, we
              will offer the nearest alternative.
            </p>
          ),
        },
        {
          heading: "Prices and payment",
          body: (
            <>
              <p>
                Standard and member prices are shown per wash, in Indian rupees,
                and are fixed at the time of booking. They include water and
                materials. Taxes are charged as applicable. There are no
                add-ons.
              </p>
              <p>
                For single washes, payment is arranged after we confirm the
                slot. The {membership.name} membership costs INR{" "}
                {formatINR(membership.annualFee)} for {membership.validityMonths}{" "}
                months, paid once when the membership is confirmed.
              </p>
            </>
          ),
        },
        {
          heading: "Membership",
          body: (
            <>
              <p>
                {membership.name} gives you {membership.discountPercent}% off
                every exterior, interior and complete wash for{" "}
                {membership.validityMonths} months. There is no fixed schedule;
                you book a wash whenever you need one. One membership covers{" "}
                {membership.vehiclesPerMembership === 1
                  ? "one car"
                  : `${membership.vehiclesPerMembership} cars`}
                .
              </p>
              <p>
                Your member price is fixed for the term. Standard prices may
                change for non-members, but your member price will not change
                until renewal.
              </p>
              <p>{membership.terms.refund}</p>
              <p>{membership.terms.renewal}</p>
            </>
          ),
        },
        {
          heading: "Weather and access",
          body: (
            <p>
              Light rain does not stop us. In heavy rain, or where access is
              unsafe, we reschedule to the next available slot at no charge. If
              we cannot reach the car, or the parking is not as described, we
              may have to reschedule and a second visit may be treated as a new
              booking.
            </p>
          ),
        },
        {
          heading: "Care and liability",
          body: (
            <p>
              We use hand methods and clean microfibre. We photograph
              pre-existing damage before starting where possible. We are not
              liable for pre-existing defects, aftermarket fittings, loose trim
              or damage caused by contaminated water supplied at the address.
              Our liability for any single visit is limited to the price paid
              for that visit, except where the law does not allow that limit.
            </p>
          ),
        },
        {
          heading: "Your details",
          body: (
            <p>
              We use the details you give us to deliver the service and keep
              our records. Our{" "}
              <a href="/privacy" className="link-rule text-bone">
                privacy policy
              </a>{" "}
              explains what we hold and how to have it removed.
            </p>
          ),
        },
      ]}
      footnote={
        <>
          These terms are governed by the laws of India. Questions can go to{" "}
          {contact.email} or {contact.phone}. {brand.name} operates in{" "}
          {contact.city}, {contact.region}.
        </>
      }
    />
  );
}
