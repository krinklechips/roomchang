import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
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
