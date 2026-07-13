import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/tenant-dashboard", "/api"],
    },
    // Second entry: the Anabasis international pages' sitemap, served through
    // the /intl reverse proxy (lists www.roomchang.com/intl/... URLs).
    sitemap: [
      "https://www.roomchang.com/sitemap.xml",
      "https://www.roomchang.com/intl/sitemap.xml",
    ],
  };
}
