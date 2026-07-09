import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Battambang, Noto_Sans_SC } from "next/font/google";
import { getLocale } from "next-intl/server";
import { LOCALE_TO_LANG } from "@/i18n/routing";
import { Analytics } from "@vercel/analytics/next";

// Khmer webfont (the web version of Khmer OS Battambang). Self-hosted by
// next/font; preload disabled so it only downloads on Khmer (/kh) pages.
// Exposed as --font-khmer and applied to :lang(km) in globals.css.
const battambang = Battambang({
  subsets: ["khmer"],
  weight: ["400", "700"],
  variable: "--font-khmer",
  display: "swap",
  preload: false,
});

// Simplified-Chinese webfont (Noto Sans SC). Self-hosted by next/font; preload
// disabled so it only downloads on Chinese (/cn) pages. Exposed as
// --font-chinese and applied to :lang(zh) in globals.css.
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-chinese",
  display: "swap",
  preload: false,
});
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CmsPreviewInteractionGuard } from "@/components/site/cms-preview-interaction-guard";
import { BRANCHES } from "@/lib/branches";
import "./globals.css";

// Google Tag Manager container ID (public — appears in page source).
const GTM_ID = "GTM-MV7MVXLR";

// Google Ads tag (conversion tracking + remarketing). Shares the dataLayer /
// gtag + Consent Mode set up below, so ad_storage consent gates it.
const GOOGLE_ADS_ID = "AW-829072157";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.roomchang.com"),
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

const SITE = "https://www.roomchang.com";
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
    {
      "@type": "FAQPage",
      "@id": `${SITE}/#faq`,
      mainEntity: [
        {
          q: "Where is Roomchang Dental Hospital located?",
          a: "Roomchang Dental Hospital is in Phnom Penh, Cambodia, with five branches. The main hospital is at No. 4, Street 184, Sangkat Phsar Thmey 3, Khan Daun Penh, Phnom Penh.",
        },
        {
          q: "How much can international patients save on dental treatment at Roomchang?",
          a: "International patients typically save 60–80% compared with prices in the US, Australia, and Europe, while receiving care from internationally trained dentists using internationally sourced implants and materials.",
        },
        {
          q: "Is Roomchang Dental Hospital accredited?",
          a: "Yes. Roomchang was the first dental clinic in Cambodia to earn ISO 9001 certification and currently holds ISO 9001:2015 (UKAS accreditation via Bureau Veritas), re-certified six times. It is also a member of EuroCham Cambodia.",
        },
        {
          q: "What languages does the Roomchang team speak?",
          a: "The multilingual team serves patients in English, Khmer, Chinese, Japanese, and Malay.",
        },
        {
          q: "Does Roomchang offer dental implants and All-on-4?",
          a: "Yes. Roomchang provides single and multiple dental implants, All-on-4 and All-on-6 full-arch reconstruction, and full-mouth reconstruction, performed by internationally trained implantologists.",
        },
        {
          q: "How do I book an appointment or get a free treatment plan?",
          a: "Email contact@roomchang.com, call +855 23 211 338, or use the contact page at roomchang.com/en/contact. International patients can request a free preliminary treatment plan by sending dental records, X-rays, or photos.",
        },
        {
          q: "Does Roomchang have emergency dental services?",
          a: "Yes. A 24/7 dental emergency line is available at +855 11 811 338.",
        },
      ].map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
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
      className={`h-full scroll-smooth antialiased ${battambang.variable} ${notoSansSC.variable}`}
    >
      <body className="min-h-full flex flex-col">
        {/* Google Tag Manager (noscript) — must be first inside <body> */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {/* Google Consent Mode v2 — must run BEFORE GTM. Defaults to granted
            (analytics on by default); the ConsentBanner lets visitors opt out,
            and returning visitors who declined get "denied" re-applied here
            from the rc_consent cookie before any tag fires. */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',functionality_storage:'granted',personalization_storage:'granted',security_storage:'granted'});if(document.cookie.indexOf('rc_consent=denied')!==-1){gtag('consent','update',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});}`}
        </Script>
        {/* Google Tag Manager */}
        <Script id="gtm-base" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        {/* Google Ads (gtag) — for the Australia campaign's conversion tracking
            + remarketing. gtag()/dataLayer + consent defaults already exist from
            the consent-default script above; here we just load the tag library
            and configure the Ads account. */}
        <Script
          id="google-ads-loader"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-config" strategy="afterInteractive">
          {`gtag('js', new Date());gtag('config', '${GOOGLE_ADS_ID}');`}
        </Script>
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
