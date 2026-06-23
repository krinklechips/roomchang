import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import { LOCALE_TO_LANG } from "@/i18n/routing";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CmsPreviewInteractionGuard } from "@/components/site/cms-preview-interaction-guard";
import { BRANCHES } from "@/lib/branches";
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

const SITE = "https://roomchang.com";
const DAY: Record<string, string> = {
  Mon: "Mo", Tue: "Tu", Wed: "We", Thu: "Th", Fri: "Fr", Sat: "Sa", Sun: "Su",
};

/** "Mon–Sat 08:00–17:30" → ["Mo-Sa 08:00-17:30"] (schema.org openingHours) */
function toSchemaHours(hours: string): string[] {
  const m = hours.match(/(\w{3})[–-](\w{3})\s+([\d:]+)[–-]([\d:]+)/);
  if (!m || !DAY[m[1]] || !DAY[m[2]]) return [];
  return [`${DAY[m[1]]}-${DAY[m[2]]} ${m[3]}-${m[4]}`];
}

/** One schema.org Dentist node per branch, built from the single source of truth. */
const branchNodes = BRANCHES.map((b) => {
  const [lat, lng] = b.coords.split(",").map(Number);
  return {
    "@type": "Dentist",
    "@id": `${SITE}/#branch-${b.slug}`,
    name: `Roomchang Dental Hospital — ${b.shortName}`,
    parentOrganization: { "@id": `${SITE}/#organization` },
    url: `${SITE}/en/about/branches/${b.slug}`,
    telephone: b.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address,
      addressLocality: "Phnom Penh",
      addressCountry: "KH",
    },
    geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
    ...(b.mapPlaceUrl ? { hasMap: b.mapPlaceUrl } : {}),
    openingHours: toSchemaHours(b.hours),
  };
});

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Dentist", "MedicalBusiness", "MedicalOrganization"],
      "@id": `${SITE}/#organization`,
      name: "Roomchang Dental Hospital",
      alternateName: "Roomchang Dental & Aesthetic Hospital",
      url: `${SITE}/`,
      logo: `${SITE}/brand/roomchang-logo-header-padded.png`,
      image: `${SITE}/og-default.jpg`,
      description:
        "Cambodia's leading dental hospital and a top destination for dental tourism in Asia. Founded in 1996, the first ISO 9001-certified dental clinic in Cambodia, with 5 branches in Phnom Penh and internationally trained specialists.",
      slogan: "The best quality dental group practice for your choice",
      foundingDate: "1996",
      telephone: "+855 69 811 338",
      email: "contact@roomchang.com",
      priceRange: "$$",
      currenciesAccepted: "USD, KHR",
      address: {
        "@type": "PostalAddress",
        streetAddress: "No. 4, Street 184, Sangkat Phsar Thmey 3, Khan Daun Penh",
        addressLocality: "Phnom Penh",
        postalCode: "120203",
        addressCountry: "KH",
      },
      geo: { "@type": "GeoCoordinates", latitude: 11.5631748, longitude: 104.9255864 },
      openingHours: ["Mo-Sa 08:00-17:30"],
      areaServed: [
        "Cambodia", "Australia", "United States", "United Kingdom",
        "New Zealand", "Singapore", "Japan", "China",
      ].map((name) => ({ "@type": "Country", name })),
      availableLanguage: ["English", "Khmer", "Chinese", "Japanese", "Malay"].map(
        (name) => ({ "@type": "Language", name }),
      ),
      medicalSpecialty: ["Dentistry", "Oral Surgery", "Orthodontics", "Implantology", "Cosmetic Dentistry"],
      knowsAbout: [
        "Dental implants", "All-on-4 dental implants", "Full-mouth reconstruction",
        "Cosmetic dentistry", "Dental veneers", "Teeth whitening", "Orthodontics",
        "Invisalign", "Dental crowns and bridges", "Oral surgery",
        "Pediatric dentistry", "Dental tourism",
      ],
      hasCertification: {
        "@type": "Certification",
        name: "ISO 9001:2015 (Quality Management System)",
        issuedBy: { "@type": "Organization", name: "Bureau Veritas (UKAS Accreditation)" },
      },
      memberOf: {
        "@type": "Organization",
        name: "EuroCham Cambodia",
        url: "https://eurocham-cambodia.org/",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+855 69 811 338",
          contactType: "customer service",
          areaServed: "KH",
          availableLanguage: ["English", "Khmer", "Chinese", "Japanese", "Malay"],
        },
        {
          "@type": "ContactPoint",
          telephone: "+855 11 811 338",
          contactType: "emergency",
          availableLanguage: ["English", "Khmer"],
        },
      ],
      sameAs: [
        "https://www.facebook.com/roomchangdental",
        "https://www.instagram.com/roomchangdental",
        "https://www.youtube.com/roomchang",
        "https://telegram.me/roomchang",
      ],
      department: branchNodes.map((b) => ({ "@id": b["@id"] })),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: `${SITE}/`,
      name: "Roomchang Dental Hospital",
      publisher: { "@id": `${SITE}/#organization` },
      inLanguage: ["en", "km", "zh"],
    },
    ...branchNodes,
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
      lang={LOCALE_TO_LANG[locale] ?? locale}
      className="h-full scroll-smooth antialiased"
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <CmsPreviewInteractionGuard />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
