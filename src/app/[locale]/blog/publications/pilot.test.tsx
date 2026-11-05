import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createTranslator, type AbstractIntlMessages } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import en from "../../../../../messages/en.json";
import km from "../../../../../messages/km.json";
import zh from "../../../../../messages/zh.json";

const state = vi.hoisted(() => ({ locale: "en" }));
vi.mock("@/components/site/site-shell", () => ({ SiteShell: ({ children }: { children: ReactNode }) => createElement("main", {}, children) }));
vi.mock("@/i18n/navigation", () => ({ Link: ({ children, href, ...props }: { children: ReactNode; href: string }) => createElement("a", { href, ...props }, children) }));
vi.mock("next/server", () => ({ connection: async () => {} }));
vi.mock("next-intl/server", () => ({
  setRequestLocale: (locale: string) => { state.locale = locale; },
  getTranslations: async (options: string | { locale: string; namespace: string }) => {
    const locale = typeof options === "string" ? state.locale : options.locale;
    const namespace = typeof options === "string" ? options : options.namespace;
    return createTranslator({ locale, namespace, messages: ({ en, kh: km, cn: zh } as Record<string, AbstractIntlMessages>)[locale] });
  },
}));

const doc = { id: 91, sourceId: "new-record", title: "CMS original title", displayTitle: "CMS edited title",
  authors: "CMS Author", journal: "CMS Journal", year: 2026, order: 1,
  doi: "10.1234/new-record", url: null, abstract: "New published abstract", _status: "published" };
let fetcher: ReturnType<typeof vi.fn>;

beforeEach(() => {
  state.locale = "en";
  vi.stubEnv("CONTENT_SOURCE", "pilot");
  vi.stubEnv("CMS_PILOT_PAGES", "/en/blog/publications");
  vi.stubEnv("PAYLOAD_API_URL", "https://roomchang.serviettelab.com");
  vi.stubEnv("SITE_VISIBILITY", "public");
  fetcher = vi.fn(async () => new Response(JSON.stringify({ docs: [doc], totalDocs: 1, hasNextPage: false, nextPage: null })));
  vi.stubGlobal("fetch", fetcher);
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

async function html(locale: string) {
  const { default: Page } = await import("./page");
  return renderToStaticMarkup(await Page({ params: Promise.resolve({ locale }) }));
}

describe("English Publications source selection", () => {
  it("renders the selected current published CMS values and links as text", async () => {
    const output = await html("en");
    expect(output).toContain("CMS edited title");
    expect(output).toContain("CMS original title");
    expect(output).toContain("CMS Author");
    expect(output).toContain("CMS Journal");
    expect(output).toContain("New published abstract");
    expect(output).toContain('href="https://doi.org/10.1234/new-record"');
    expect(output).not.toContain("Article 1714360");
  });

  it.each(["kh", "cn"])("does not fetch or replace the existing %s publications", async locale => {
    const output = await html(locale);
    expect(output).toContain("Article 1714360");
    expect(output).toContain("169–179");
    expect(output).not.toContain("CMS edited title");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("restores the exact original English citations when the pilot allowlist is cleared", async () => {
    vi.stubEnv("CMS_PILOT_PAGES", "");
    const output = await html("en");
    expect(output).toContain("Article 1714360");
    expect(output).toContain("169–179");
    expect(output).not.toContain("CMS edited title");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("shows a page-local unavailable state for an outage instead of an empty list or unapproved legacy substitution", async () => {
    fetcher.mockImplementation(async () => new Response("unavailable", { status: 503 }));
    const output = await html("en");
    expect(output).toContain('data-publications-state="unavailable"');
    expect(output).toContain("Publications are temporarily unavailable");
    expect(output).not.toContain("Article 1714360");
    const { generateMetadata } = await import("./page");
    expect((await generateMetadata({ params: Promise.resolve({ locale: "en" }) })).robots)
      .toEqual({ index: false, follow: false });
  });

  it("does not let a hostile title or abstract become executable HTML", async () => {
    fetcher.mockImplementation(async () => new Response(JSON.stringify({ docs: [{ ...doc,
      displayTitle: '<img src=x onerror="alert(1)">', abstract: "<script>alert(2)</script>" }], totalDocs: 1, hasNextPage: false, nextPage: null })));
    const output = await html("en");
    expect(output).toContain("&lt;img");
    expect(output).toContain("&lt;script&gt;");
    expect(output).not.toContain("<script>alert(2)</script>");
    expect(output).not.toContain("<img src=x");
  });
});
