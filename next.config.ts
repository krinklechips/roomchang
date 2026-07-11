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
    // Optimized variants default to browser max-age=0 (revalidate on every
    // repeat view) and expire quickly at the edge, forcing re-transforms —
    // which also burn the transformation quota. Media changes ship under NEW
    // filenames/keys (project convention: overwriting an R2 key serves stale
    // cache anyway), so 31-day caching is safe.
    minimumCacheTTL: 2678400,
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
  async headers() {
    // public/ assets are served with max-age=0 must-revalidate by default on
    // Vercel — every repeat view re-validates fonts and media (~6 font files
    // per page alone). These paths only ever change by adding NEW files, so
    // serve them immutable.
    const immutable = {
      key: "Cache-Control",
      value: "public, max-age=31536000, immutable",
    };
    const staticDirs = [
      "fonts", "hero", "services", "technology", "doctors", "brand",
      "about", "chatbot",
    ];
    return staticDirs.map((dir) => ({
      source: `/${dir}/:path*`,
      headers: [immutable],
    }));
  },
};

export default withNextIntl(nextConfig);
