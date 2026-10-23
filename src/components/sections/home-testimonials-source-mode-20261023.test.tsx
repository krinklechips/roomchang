import { Children, isValidElement, type ComponentProps, type ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import en from "../../../messages/en.json";
import km from "../../../messages/km.json";
import zh from "../../../messages/zh.json";

const state = vi.hoisted(() => ({ payload: false }));
vi.mock("next-intl/server", () => ({ setRequestLocale: () => {} }));
vi.mock("@/i18n/navigation", () => ({ Link: ({ children, ...props }: ComponentProps<"a">) => <a {...props}>{children}</a> }));
vi.mock("@/components/site/site-shell", () => ({ SiteShell: ({ children }: { children: ReactNode }) => <>{children}</> }));
vi.mock("@/components/sections/home-hero", () => ({ HomeHero: () => null }));
vi.mock("@/components/sections/home-brands", () => ({ HomeBrands: () => null }));
vi.mock("@/components/sections/home-stats-server", () => ({ HomeStatsServer: () => null }));
vi.mock("@/components/sections/home-services", () => ({ HomeServices: () => null }));
vi.mock("@/components/sections/home-featured", () => ({ HomeFeatured: () => null }));
vi.mock("@/lib/payload-source", () => ({ isPayloadSource: () => state.payload, getPayloadHomepageSettings: async () => null }));
vi.mock("@/lib/data", () => ({ getTestimonials: async () => mixed }));

import Home from "@/app/[locale]/page";
import { HomeTestimonials } from "./home-testimonials";

const mixed = [
  { id: "ordinary-first", authorName: "Ordinary First", authorTitle: null, quote: "First ordinary quote", isFeatured: false },
  { id: "featured-first", authorName: "Featured First", authorTitle: null, quote: "First featured quote", isFeatured: true },
  { id: "ordinary-last", authorName: "Ordinary Last", authorTitle: null, quote: "Last ordinary quote", isFeatured: false },
  { id: "featured-last", authorName: "Featured Last", authorTitle: null, quote: "Last featured quote", isFeatured: true },
].map((record) => Object.freeze(record));

function show(node: ReactNode, locale: string) {
  const messages = locale === "kh" ? km : locale === "cn" ? zh : en;
  return render(<NextIntlClientProvider locale={locale === "kh" ? "km" : locale === "cn" ? "zh" : "en"} messages={messages} timeZone="Asia/Phnom_Penh">{node}</NextIntlClientProvider>);
}

afterEach(() => { cleanup(); state.payload = false; });

describe.each(["en", "kh", "cn"])("homepage testimonial source selection (%s)", (locale) => {
  it.each([undefined, false, true])("filters mixed records only with an explicit filterFeatured=true (%s)", (filterFeatured) => {
    const before = structuredClone(mixed);
    show(<HomeTestimonials testimonials={mixed} {...(filterFeatured === undefined ? {} : { filterFeatured })} />, locale);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(filterFeatured ? 2 : 4);
    expect(screen.getByRole("blockquote")).toHaveTextContent(filterFeatured ? "First featured quote" : "First ordinary quote");
    fireEvent.click(buttons[filterFeatured ? 1 : 2]);
    expect(screen.getByRole("blockquote")).toHaveTextContent(filterFeatured ? "Last featured quote" : "Last ordinary quote");
    expect(mixed).toEqual(before);
  });

  it.each([false, true])("passes the selected source explicitly from the homepage (Payload=%s)", async (payload) => {
    state.payload = payload;
    const page = await Home({ params: Promise.resolve({ locale }) });
    const consumer = Children.toArray(page.props.children).find((child) =>
      isValidElement<ComponentProps<typeof HomeTestimonials>>(child) && child.type === HomeTestimonials,
    );
    if (!isValidElement<ComponentProps<typeof HomeTestimonials>>(consumer)) throw new Error("Homepage testimonial consumer is missing");
    expect(consumer.props.filterFeatured).toBe(payload);
    show(consumer, locale);
    expect(screen.getAllByRole("button")).toHaveLength(payload ? 2 : 4);
    expect(screen.getByRole("blockquote")).toHaveTextContent(payload ? "First featured quote" : "First ordinary quote");
    expect(fetch).not.toHaveBeenCalled();
  });
});
