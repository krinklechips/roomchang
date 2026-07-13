import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Reverse-proxy /intl/* and /admin/* to the Anabasis international + admin
  // apps (multi-zone). MUST be `beforeFiles`: this site has a root `[locale]`
  // dynamic segment, so an `afterFiles` rewrite (the array form in the vendor
  // spec) would be shadowed — Next would route `/intl` and `/admin` to the
  // [locale] page (locale="intl"/"admin") before the rewrite ran. beforeFiles
  // runs ahead of the filesystem routes, so the proxy always wins.
  // Paired with the `intl|admin` matcher exclusion in src/middleware.ts.
  // The internal affiliates/pricing dashboard stays at /en/admin/* (Basic
  // Auth); only BARE /admin/* proxies to Anabasis.
  async rewrites() {
    return {
      beforeFiles: [
        // Bare-path rules first, proxying to the SLASHED origin URL: the
        // Anabasis origins 307 "/admin"→"/admin/" and "/intl"→"/intl/", while
        // our Next normalizes "/x/"→"/x" (308) — proxying the bare path
        // verbatim ping-pongs those two redirects into an infinite loop.
        {
          source: "/intl",
          destination: "https://intl.roomchang.anabasisintelligence.com/intl/",
        },
        {
          source: "/admin",
          destination: "https://admin.roomchang.anabasisintelligence.com/admin/",
        },
        {
          source: "/intl/:path*",
          destination: "https://intl.roomchang.anabasisintelligence.com/intl/:path*",
        },
        {
          source: "/admin/:path*",
          destination: "https://admin.roomchang.anabasisintelligence.com/admin/:path*",
        },
      ],
    };
  },
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
