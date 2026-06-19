import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Bypass Vercel's Image Optimization. The plan's optimization quota was
    // exhausted, so /_next/image returned 402 (OPTIMIZED_IMAGE_REQUEST_
    // PAYMENT_REQUIRED) for any not-yet-cached image → blank images site-wide.
    // Unoptimized serves the originals directly (Cloudflare R2 + Vercel static),
    // which removes the quota dependency entirely. Trade-off: no auto-resize, so
    // images download at full size. Revisit with Vercel Pro or a Cloudflare
    // image-resizing loader if we want optimization back.
    unoptimized: true,
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
