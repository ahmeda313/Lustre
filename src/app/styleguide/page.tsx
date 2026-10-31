import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { StyleGuide } from "@/components/styleguide/StyleGuide";

export const metadata: Metadata = {
  title: "Styleguide",
  description: `Colour, type and controls used across the ${brand.name} website.`,
  robots: { index: false, follow: false },
};

export default function StyleGuidePage() {
  return <StyleGuide />;
}
