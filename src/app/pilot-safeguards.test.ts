import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "./robots";
import { GET as preview } from "./api/preview/route";
import deployment from "../../vercel.json";

afterEach(() => vi.unstubAllEnvs());

describe("pilot deployment boundaries", () => {
  it("requires an explicit deployment for the pilot branch without disabling other branches", () => {
    expect(deployment).toMatchObject({ git: { deploymentEnabled: { "codex/publications-pilot-20261105": false } } });
    expect(Object.keys(deployment.git.deploymentEnabled)).toEqual(["codex/publications-pilot-20261105"]);
  });
  it("does not expose CMS draft preview in pilot mode even when a secret is configured", async () => {
    vi.stubEnv("CONTENT_SOURCE", "pilot");
    vi.stubEnv("PAYLOAD_PREVIEW_SECRET", "test-only-secret");
    const response = await preview(new Request("https://pilot.example/api/preview?secret=test-only-secret&redirect=/en/blog/publications"));
    expect(response.status).toBe(404);
    expect(response.headers.has("set-cookie")).toBe(false);
  });

  it("disallows crawling in staging independently of selected content", () => {
    vi.stubEnv("SITE_VISIBILITY", "staging");
    vi.stubEnv("CONTENT_SOURCE", "pilot");
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("keeps production crawling behavior when staging is not selected", () => {
    vi.stubEnv("SITE_VISIBILITY", "public");
    expect(robots().rules).toEqual({ userAgent: "*", allow: "/", disallow: ["/admin", "/tenant-dashboard", "/api"] });
  });

  it("adds a staging response header without modifying production response headers", async () => {
    const { default: config } = await import("../../next.config");
    vi.stubEnv("SITE_VISIBILITY", "public");
    const publicHeaders = await config.headers!();
    vi.stubEnv("SITE_VISIBILITY", "staging");
    const stagingHeaders = await config.headers!();
    expect(stagingHeaders).toContainEqual({ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] });
    expect(publicHeaders.some(rule => rule.headers.some(header => header.key === "X-Robots-Tag"))).toBe(false);
  });

  it("does not proxy staging visitors to the separate production admin or international applications", async () => {
    const { default: config } = await import("../../next.config");
    vi.stubEnv("SITE_VISIBILITY", "staging");
    expect(await config.rewrites!()).toEqual({ beforeFiles: [] });
    vi.stubEnv("SITE_VISIBILITY", "public");
    expect(await config.rewrites!()).toMatchObject({ beforeFiles: expect.arrayContaining([
      { source: "/admin", destination: "https://admin.roomchang.anabasisintelligence.com/admin/" },
    ]) });
  });
});
