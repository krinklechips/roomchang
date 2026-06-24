import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Vercel Image Optimization is ON: next/image requests route through
    // /_next/image, which resizes to the rendered size and serves WebP/AVIF
    // (e.g. the 2438px logo and 1254px chatbot avatar download at their real
    // display size instead of full resolution). Was previously `unoptimized:
    // true` to dodge a 402 (optimization quota exhausted); re-enabled now that
    // the plan covers it.
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-2b835c19d8644293b271deaeb97352b1.r2.dev",
      },
      {
        protocol: "https",
        hostname: "roomchang.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
