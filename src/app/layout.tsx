import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { brand } from "@/config/brand";
import { contact } from "@/config/contact";
import { membership } from "@/config/membership";
import { AppProviders } from "@/components/providers/AppProviders";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const siteTitle = `${brand.name} — Car wash ${brand.serviceModeLabel}`;
const siteDescription = `${brand.description} ${membership.name} members save ${membership.discountPercent}% for a year.`;

export const metadata: Metadata = {
  metadataBase: new URL(brand.domain),
  title: {
    default: siteTitle,
    template: `%s — ${brand.name}`,
  },
  description: siteDescription,
  applicationName: brand.name,
  authors: [{ name: brand.name }],
  creator: brand.name,
  keywords: [
    "car wash",
    "doorstep car wash",
    "interior car cleaning",
    "exterior car wash",
    "car wash membership",
    `${contact.city} car wash`,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: brand.name,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
  category: "Automotive",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: brand.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${instrument.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-[2px] bg-bone px-4 py-3 text-sm font-medium text-ink transition-transform duration-ui ease-luxe focus:translate-y-0"
        >
          Skip to content
        </a>
        <AppProviders>
          <Navbar />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
