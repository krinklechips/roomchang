import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CmsPreviewInteractionGuard } from "@/components/site/cms-preview-interaction-guard";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://roomchang.com"),
  title: "Roomchang Dental Hospital",
  description: "Premium multilingual dental care in Phnom Penh.",
  openGraph: {
    type: "website",
    siteName: "Roomchang Dental Hospital",
    locale: "en_US",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Roomchang Dental Hospital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@roomchangdental",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": "https://roomchang.com",
  name: "Roomchang Dental Hospital",
  description:
    "Cambodia's leading dental hospital — 37 specialist dentists, 5 branches in Phnom Penh, serving international patients since 1996.",
  url: "https://roomchang.com",
  telephone: "+855698113338",
  email: "contact@roomchang.com",
  foundingDate: "1996",
  medicalSpecialty: [
    "Dentistry",
    "Oral Surgery",
    "Orthodontics",
    "Implantology",
    "Cosmetic Dentistry",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 4, Street 184",
    addressLocality: "Phnom Penh",
    addressCountry: "KH",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 11.5625,
    longitude: 104.9175,
  },
  openingHours: ["Mo-Sa 08:00-17:30"],
  priceRange: "77076",
  image: "https://roomchang.com/brand/roomchang-logo-header-padded.png",
  sameAs: [
    "https://www.facebook.com/roomchangdental",
    "https://telegram.me/roomchang",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className="h-full scroll-smooth antialiased"
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <CmsPreviewInteractionGuard />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
