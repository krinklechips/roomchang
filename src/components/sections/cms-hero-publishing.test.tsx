import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ locale: "en", docs: [] as Record<string, unknown>[] }));
vi.mock("next-intl/server", () => ({ getLocale: async () => state.locale, getTranslations: async () => (key: string) => `homeHero.${key}` }));
vi.mock("next-intl", () => ({ useTranslations: () => (key: string, values?: { title?: string }) => values?.title ? `${key}:${values.title}` : key }));
vi.mock("next/headers", () => ({ draftMode: async () => ({ isEnabled: false }) }));
vi.mock("@/i18n/navigation", () => ({ Link: ({ children, href, ...props }: ComponentProps<"a">) => <a href={href} {...props}>{children}</a> }));
vi.mock("next/image", () => ({ default: ({ alt = "", ...props }: ComponentProps<"img"> & { fill?: boolean; priority?: boolean }) => {
  delete props.fill;
  delete props.priority;
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} {...props} />;
} }));
vi.mock("@/lib/supabase", () => ({ supabase: {} }));
vi.mock("@/lib/supabase-server", () => ({ supabaseServer: {} }));

beforeEach(() => {
  vi.stubEnv("CONTENT_SOURCE", "payload");
  vi.stubEnv("PAYLOAD_API_URL", "https://cms.example.test");
  state.docs = [{ id: 1, heroPill: "Stored pill", heroButtons: [], slides: [{ title: "Stored heading", eyebrow: "Stored eyebrow", subtitle: "Stored subtitle", description: "Stored description", ctaText: "Stored slide action", ctaUrl: "/contact", imageUrl: "/test.jpg", imageAlt: "Stored image" }] }];
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ docs: state.docs }) })));
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); vi.resetModules(); });

describe.each(["en", "kh", "cn"])("homepage published hero in %s", locale => {
  beforeEach(() => { state.locale = locale; });
  it("retains the image-led design unless captions are explicitly enabled", async () => {
    const { HomeHero } = await import("./home-hero");
    render(await HomeHero());
    expect(screen.getByAltText("Stored image")).toBeInTheDocument();
    expect(screen.queryByText("Stored heading")).not.toBeInTheDocument();
  });
  it("renders every stored caption field and slide action when enabled", async () => {
    state.docs[0].showCaptions = true;
    const before = structuredClone(state.docs);
    const { HomeHero } = await import("./home-hero");
    render(await HomeHero());
    for (const text of ["Stored heading", "Stored eyebrow", "Stored subtitle", "Stored description"]) expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Stored slide action" })).toHaveAttribute("href", "/contact");
    expect(state.docs).toEqual(before);
    for (const [, init] of vi.mocked(fetch).mock.calls) expect(init?.method ?? "GET").toBe("GET");
  });
  it.each([false, true])("keeps caption image geometry independent of the full-bleed auto ratio (panorama: %s)", async preserveFullImage => {
    state.docs[0].showCaptions = true;
    (state.docs[0].slides as Record<string, unknown>[])[0].preserveFullImage = preserveFullImage;
    const { HomeHero } = await import("./home-hero");
    render(await HomeHero());
    const stage = screen.getByTestId("hero-stage");
    expect(stage).toHaveClass("aspect-[16/9]", "xl:!aspect-[16/9]");
    expect(stage).not.toHaveClass("xl:!aspect-auto");
    expect(screen.getByTestId("hero-caption")).toHaveTextContent("Stored heading");
    expect(screen.getByRole("link", { name: "Stored slide action" })).toHaveAttribute("href", "/contact");
  });
  it.each([false, true])("retains the existing full-bleed image geometry with captions off (panorama: %s)", async preserveFullImage => {
    state.docs[0].showCaptions = false;
    (state.docs[0].slides as Record<string, unknown>[])[0].preserveFullImage = preserveFullImage;
    const { HomeHero } = await import("./home-hero");
    render(await HomeHero());
    expect(screen.getByTestId("hero-stage")).toHaveClass("aspect-[16/9]", "xl:!aspect-auto", "xl:h-full", "xl:aspect-auto");
    expect(screen.queryByTestId("hero-caption")).not.toBeInTheDocument();
    expect(screen.getByTestId("hero-foreground-image")).toHaveAttribute("src", "/test.jpg");
  });
  it("does not restore bundled slides or buttons after the selected CMS source is cleared", async () => {
    state.docs[0].slides = [];
    const { HomeHero } = await import("./home-hero");
    expect(await HomeHero()).toBeNull();
  });
  it("does not replace an intentionally empty CMS button array", async () => {
    const { HomeHero } = await import("./home-hero");
    render(await HomeHero());
    expect(screen.queryByRole("link", { name: "homeHero.ctaPrimary" })).not.toBeInTheDocument();
  });
  it.each(["javascript:alert(1)", "//evil.example/", "https://user:password@example.test/", "data:text/html,test"])("does not render an unsafe slide CTA: %s", async ctaUrl => {
    state.docs[0].showCaptions = true;
    (state.docs[0].slides as Record<string, unknown>[])[0].ctaUrl = ctaUrl;
    const { HomeHero } = await import("./home-hero");
    render(await HomeHero());
    expect(screen.getByText("Stored heading")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Stored slide action" })).not.toBeInTheDocument();
  });
});

it("does not crash when a refresh removes the active slide", async () => {
  const { HeroSlideshow } = await import("./hero-slideshow");
  const first = { id: "one", title: "First", eyebrow: "", description: "", imageSrc: "/one.jpg", imageAlt: "First image" };
  const second = { ...first, id: "two", title: "Second", imageSrc: "/two.jpg", imageAlt: "Second image" };
  const { rerender } = render(<HeroSlideshow slides={[first, second]} />);
  fireEvent.click(screen.getByRole("button", { name: "nextAriaLabel" }));
  expect(screen.getByText("Second")).toBeInTheDocument();
  expect(() => rerender(<HeroSlideshow slides={[first]} />)).not.toThrow();
  expect(screen.getByText("First")).toBeInTheDocument();
});
