import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { contact } from "@/config/contact";
import { membership } from "@/config/membership";
import {
  priceByVehicle,
  services,
  type ServiceId,
  type VehicleSize,
} from "@/config/services";
import { getMemberPriceFor } from "@/lib/membership";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { images } from "@/config/images";

const description = `${brand.description} ${membership.name} members save ${membership.discountPercent}% for a year.`;

export const metadata: Metadata = {
  title: brand.tagline,
  description,
};

const allPrices = Object.values(priceByVehicle).flatMap((prices) =>
  Object.values(prices),
);
const memberPrices = (Object.keys(priceByVehicle) as ServiceId[]).flatMap(
  (service) =>
    (Object.keys(priceByVehicle[service]) as VehicleSize[]).map((vehicle) =>
      getMemberPriceFor(vehicle, service),
    ),
);
const minPrice = Math.min(...allPrices, ...memberPrices);
const maxPrice = Math.max(...allPrices, membership.annualFee);

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AutoWash",
  "@id": `${brand.domain}/#business`,
  name: brand.name,
  description,
  url: brand.domain,
  image: `${brand.domain}${images.hero.src}`,
  telephone: contact.phone,
  email: contact.email,
  priceRange: `INR ${minPrice}–${maxPrice}`,
  areaServed: {
    "@type": "City",
    name: contact.city,
    containedInPlace: { "@type": "State", name: contact.region },
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: contact.city,
    addressRegion: contact.region,
    addressCountry: contact.country,
  },
  openingHoursSpecification: contact.openingHoursSpecification.map((entry) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: entry.days,
    opens: entry.opens,
    closes: entry.closes,
  })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Car washes and membership",
    itemListElement: [
      ...services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `${service.name} wash`,
          description: service.promise,
        },
      })),
      {
        "@type": "Offer",
        name: `${membership.name} membership`,
        description: `${membership.discountPercent}% off every exterior, interior and complete wash for ${membership.validityMonths} months.`,
        price: membership.annualFee,
        priceCurrency: brand.currency,
        category: "Membership",
        itemOffered: {
          "@type": "Service",
          name: `${membership.name} membership`,
          description: membership.description,
          serviceType: "Car wash membership",
        },
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <Services />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
