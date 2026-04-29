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
      sitemap: "https://roomchang.com/sitemap.xml",
    });
  });
});
