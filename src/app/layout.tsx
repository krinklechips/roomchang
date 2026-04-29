import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const gotham = localFont({
  src: [
    { path: "../../public/fonts/gotham/GothamHTF-Book.otf",      weight: "400", style: "normal" },
    { path: "../../public/fonts/gotham/GothamHTF-BookItalic.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/gotham/GothamHTF-Medium.otf",     weight: "500", style: "normal" },
    { path: "../../public/fonts/gotham/GothamHTF-Bold.otf",       weight: "700", style: "normal" },
    { path: "../../public/fonts/gotham/GothamHTF-Black.otf",      weight: "900", style: "normal" },
  ],
  variable: "--font-gotham",
});

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
    "Cambodia's leading dental hospital — 37+ specialist dentists, 5 branches in Phnom Penh, serving international patients since 1996.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${gotham.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
