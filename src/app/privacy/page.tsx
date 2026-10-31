import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { contact } from "@/config/contact";
import { membership } from "@/config/membership";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${brand.name} handles the details you share when you book a wash.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      number="P.01"
      label="Privacy"
      title={
        <>
          What we know,
          <br />
          <em className="italic">and why.</em>
        </>
      }
      intro="A short policy, because we ask for very little. It covers what we collect when you book, why we hold it, and how to have it removed."
      updated="31 October 2026"
      sections={[
        {
          heading: "What we collect",
          body: (
            <>
              <p>
                When you send a booking request we collect your name, mobile
                number, the address where the car is parked, the vehicle size,
                the wash you chose, and the date and time slot you selected.
              </p>
              <p>
                If you request a {membership.name} membership we also keep your
                email address, vehicle number if you give it, and the status of
                your membership fee. We do not collect payment card details on
                this website.
              </p>
            </>
          ),
        },
        {
          heading: "Why we hold it",
          body: (
            <>
              <p>
                To confirm your slot, find the car, complete the wash and
                contact you if anything changes. For memberships, we also use
                the record to apply member pricing and to send a renewal
                reminder before the term ends.
              </p>
              <p>
                We use the number you give us on WhatsApp or by phone. We do
                not add you to a marketing list, and we do not sell or rent your
                details.
              </p>
            </>
          ),
        },
        {
          heading: "Who sees it",
          body: (
            <p>
              The two washers assigned to your visit see the name, address,
              phone number and wash details needed to complete the job. Our
              scheduling records are kept by {brand.name}. We share details with
              a third party only where the law requires it, or where a payment
              provider needs them to process a refund.
            </p>
          ),
        },
        {
          heading: "How long we keep it",
          body: (
            <p>
              Booking records are kept for twelve months after the last visit,
              so we can answer questions about the work. Membership records are
              kept for the term and for twelve months after it ends. You can ask
              us to delete your details sooner; we will remove what we are not
              required to keep.
            </p>
          ),
        },
        {
          heading: "Your choices",
          body: (
            <p>
              You can ask to see, correct or delete the details we hold, and
              you can ask us to stop contacting you. Write to{" "}
              <a
                href={`mailto:${contact.email}`}
                className="link-rule text-bone"
              >
                {contact.email}
              </a>{" "}
              or call {contact.phone}. We respond within seven working days.
            </p>
          ),
        },
        {
          heading: "Cookies and measurement",
          body: (
            <p>
              This site does not set advertising cookies. If we add privacy-
              respecting measurement later, this page will say so before it goes
              live. Your browser may store a small amount of local data to keep
              the booking form working during a visit.
            </p>
          ),
        },
      ]}
      footnote={
        <>
          Questions about this policy can go to {contact.email}. {brand.name}{" "}
          operates in {contact.city}, {contact.region}, India.
        </>
      }
    />
  );
}
