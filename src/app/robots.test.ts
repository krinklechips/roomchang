import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows crawlers while blocking admin, dashboard, and API paths", () => {
    const config = robots();

    expect(config).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/tenant-dashboard", "/api"],
      },
      // Two sitemaps: the site's own + the Anabasis /intl pages' sitemap
      // served through the reverse proxy.
      sitemap: [
        "https://www.roomchang.com/sitemap.xml",
        "https://www.roomchang.com/intl/sitemap.xml",
      ],
    });
  });
});
