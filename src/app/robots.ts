import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/tenant-dashboard", "/api"],
    },
    sitemap: "https://roomchang.com/sitemap.xml",
  };
}
