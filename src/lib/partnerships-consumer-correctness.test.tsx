import type { ComponentProps, ReactNode } from "react";
import { cleanup, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderCmsContent } from "@/test/render-cms-content";
import PartnershipsPage from "@/app/[locale]/about/partnerships/page";
import { getPayloadPartnerGroups } from "./payload-source";
import en from "../../messages/en.json";
import km from "../../messages/km.json";
import zh from "../../messages/zh.json";

type Doc = Record<string, unknown>;
const state = vi.hoisted(() => ({ locale: "kh", legacyRows: [] as Doc[] }));
vi.mock("next/headers", () => ({ draftMode: async () => ({ isEnabled: false }) }));
vi.mock("next-intl/server", async () => {
  const { createTranslator } = await import("next-intl");
  const { default: en } = await import("../../messages/en.json");
  const { default: km } = await import("../../messages/km.json");
  const { default: zh } = await import("../../messages/zh.json");
  return {
    getLocale: async () => state.locale,
    setRequestLocale: () => {},
    getTranslations: async (namespace?: string) => createTranslator({
      locale: state.locale,
      messages: (state.locale === "kh" ? km : state.locale === "cn" ? zh : en) as import("next-intl").AbstractIntlMessages,
      namespace,
    }),
  };
});
vi.mock("@/components/site/site-shell", () => ({ SiteShell: ({ children }: { children: ReactNode }) => <>{children}</> }));
vi.mock("@/i18n/navigation", () => ({ Link: ({ children, ...props }: ComponentProps<"a">) => <a {...props}>{children}</a> }));
vi.mock("@/lib/supabase-server", () => ({ supabaseServer: { from: () => {
  if (process.env.CONTENT_SOURCE === "payload") throw new Error("Unexpected legacy query");
  return { select: () => ({ order: async () => ({ data: state.legacyRows, error: null }) }) };
} } }));

let categories: Doc[];
let partners: Doc[];
let requests: URL[];

beforeEach(() => {
  categories = [];
  partners = [];
  requests = [];
  state.locale = "kh";
  state.legacyRows = [];
  vi.stubEnv("CONTENT_SOURCE", "payload");
  vi.stubEnv("PAYLOAD_API_URL", "https://cms.test");
  vi.stubGlobal("fetch", vi.fn(async (input: string, init?: RequestInit) => {
    const url = new URL(input);
    if (url.origin !== "https://cms.test" || (init?.method ?? "GET") !== "GET") throw new Error(`Unexpected request: ${input}`);
    requests.push(url);
    if (url.pathname === "/api/partners") return Response.json({ docs: partners });
    if (url.pathname !== "/api/partner-categories") throw new Error(`Unexpected collection: ${input}`);
    const locale = url.searchParams.get("locale")!;
    const docs = locale === "all" ? categories : categories.map((category) => {
      const name = category.name as Record<string, string | null> | string | null;
      if (typeof name !== "object" || name === null) return category;
      return { ...category, name: name[locale] ?? (url.searchParams.get("fallback-locale") === "none" ? null : name.en) };
    });
    return Response.json({ docs });
  }));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

const renderPage = () => renderCmsContent(<PartnershipsPage params={Promise.resolve({ locale: state.locale })} />);

describe("Payload partnership category identity", () => {
  it("retains distinct same-title categories, their partners and supplied order", async () => {
    categories = [
      { id: 30, sourceId: "first", name: { en: "Repeated", kh: "Repeated" }, order: 5 },
      { id: 10, sourceId: "second", name: { en: "Repeated", kh: "Repeated" }, order: 0 },
      { id: 20, name: { en: "Last", kh: "Last" }, order: 0 },
    ];
    partners = [
      { id: 1, name: "First partner", category: 30 },
      { id: 2, name: "Second partner", category: 10 },
      { id: 3, name: "Third partner", category: 20 },
    ];
    const before = structuredClone({ categories, partners });
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = await renderPage();
    const sections = Array.from(container.querySelectorAll("section"));
    expect(sections.map((section) => section.querySelector("h2")!.textContent)).toEqual(["Repeated", "Repeated", "Last"]);
    for (const [index, name] of ["First partner", "Second partner", "Third partner"].entries()) {
      expect(within(sections[index]).getByText(name)).toBeInTheDocument();
    }
    expect(errors).not.toHaveBeenCalled();
    expect({ categories, partners }).toEqual(before);
  });
});

describe("Payload partnership title provenance", () => {
  it("requests raw category locales with fallback disabled", async () => {
    await getPayloadPartnerGroups();
    const request = requests.find((url) => url.pathname === "/api/partner-categories")!;
    expect(request.searchParams.get("locale")).toBe("all");
    expect(request.searchParams.get("fallback-locale")).toBe("none");
  });

  it.each(["en", "kh", "cn"])("preserves an explicit %s title even when it equals a known English label", async (locale) => {
    state.locale = locale;
    categories = [{ id: 1, name: { en: "Insurance", [locale]: "Healthcare" } }];
    await renderPage();
    expect(screen.getByRole("heading", { name: "Healthcare", level: 2 })).toBeInTheDocument();
  });

  it.each([undefined, null, "", "   "])("uses the bundled known-title translation only when the selected title is %j", async (selected) => {
    categories = [{ id: 1, name: { en: "Healthcare", kh: selected } }];
    await renderPage();
    expect(screen.getByRole("heading", { name: km.partnerships.categories.healthcare, level: 2 })).toBeInTheDocument();
  });

  it("falls back to an unknown English title without inventing a translation", async () => {
    categories = [{ id: 1, name: { en: "Unlisted title", cn: null } }];
    state.locale = "cn";
    await renderPage();
    expect(screen.getByRole("heading", { name: "Unlisted title", level: 2 })).toBeInTheDocument();
  });

  it("preserves explicit title whitespace and source data", async () => {
    categories = [{ id: 1, name: { en: "Insurance", kh: "  Healthcare  " } }];
    const before = structuredClone(categories);
    const { container } = await renderPage();
    expect(container.querySelector("section h2")!.textContent).toBe("  Healthcare  ");
    expect(categories).toEqual(before);
  });

  it("retains bundled translation for legacy scalar category-name responses", async () => {
    categories = [{ id: 1, name: "Healthcare" }];
    await renderPage();
    expect(screen.getByRole("heading", { name: km.partnerships.categories.healthcare, level: 2 })).toBeInTheDocument();
  });
});

describe("legacy Supabase partnership output", () => {
  it.each([["en", en], ["kh", km], ["cn", zh]] as const)("keeps %s translation, category sorting and partner order", async (locale, messages) => {
    state.locale = locale;
    vi.stubEnv("CONTENT_SOURCE", "supabase");
    state.legacyRows = [
      { name: "First bank", logo_src: null, website: null, sort_order: 0, partner_categories: { name: "Banks & Financial Institutions", sort_order: 2 } },
      { name: "Hospital", logo_src: null, website: null, sort_order: 1, partner_categories: { name: "Healthcare", sort_order: 1 } },
      { name: "Second bank", logo_src: null, website: null, sort_order: 2, partner_categories: { name: "Banks & Financial Institutions", sort_order: 2 } },
    ];
    const { container } = await renderPage();
    const sections = Array.from(container.querySelectorAll("section"));
    expect(sections.map((section) => section.querySelector("h2")!.textContent)).toEqual([
      messages.partnerships.categories.healthcare, messages.partnerships.categories.banks,
    ]);
    expect(within(sections[1]).getAllByTitle(/bank/).map((card) => card.textContent)).toEqual(["First bank", "Second bank"]);
    expect(requests).toEqual([]);
  });

  it("retains the bundled categories when the legacy source is empty", async () => {
    vi.stubEnv("CONTENT_SOURCE", "supabase");
    const { container } = await renderPage();
    expect(container.querySelectorAll("section")).toHaveLength(8);
    expect(screen.getByRole("heading", { name: km.partnerships.categories.healthcare, level: 2 })).toBeInTheDocument();
    expect(requests).toEqual([]);
  });

  it("does not use bundled categories for an empty selected Payload source", async () => {
    const { container } = await renderPage();
    expect(container.querySelectorAll("section")).toHaveLength(0);
  });
});
