import type { ReactNode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CareersPage from "@/app/[locale]/about/careers/page";
import CareerDetailPage, { generateMetadata, generateStaticParams } from "@/app/[locale]/about/careers/[slug]/page";
import DentistTalksPage from "@/app/[locale]/blog/dentist-talks/page";
import * as data from "@/lib/data";
import { POSITIONS } from "@/lib/careers";

const state = vi.hoisted(() => ({
  locale: "en",
  jobs: [] as Record<string, unknown>[],
  videos: [] as Record<string, unknown>[],
}));

vi.mock("@/components/site/site-shell", () => ({ SiteShell: ({ children }: { children: ReactNode }) => <>{children}</> }));
vi.mock("@/i18n/navigation", () => ({ Link: ({ children, href, className }: React.ComponentProps<"a">) => <a href={href} className={className}>{children}</a> }));
vi.mock("next/navigation", async (importOriginal) => ({
  ...await importOriginal<typeof import("next/navigation")>(),
  notFound: () => { throw new Error("NEXT_NOT_FOUND"); },
}));
vi.mock("next/headers", () => ({ draftMode: async () => ({ isEnabled: false }) }));
vi.mock("next-intl/server", async () => {
  const { createTranslator } = await import("next-intl");
  const { default: messages } = await import("../../messages/en.json");
  return {
    getLocale: async () => state.locale,
    setRequestLocale: (locale: string) => { state.locale = locale; },
    getTranslations: async (options?: string | { namespace?: string }) => createTranslator({
      locale: "en", messages: messages as import("next-intl").AbstractIntlMessages,
      namespace: typeof options === "string" ? options : options?.namespace,
    }),
  };
});
vi.mock("@/lib/supabase", () => ({ supabase: { from: () => { throw new Error("Unexpected Supabase content read"); } } }));
vi.mock("@/lib/supabase-server", () => ({ supabaseServer: { from: () => { throw new Error("Unexpected Supabase content read"); } } }));
vi.mock("@/lib/i18n-content", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/i18n-content")>(),
  getTranslatedFields: async () => ({ title: "Legacy translated fellowship", shortDescription: "Legacy translated description" }),
  getTranslatedFieldsBatch: async () => new Map([["clinical-fellowship", { title: "Legacy translated fellowship", shortDescription: "Legacy translated description" }]]),
}));

const params = (slug = "clinical-fellowship", locale = "en") => ({ params: Promise.resolve({ locale, slug }) });

beforeEach(() => {
  vi.stubEnv("CONTENT_SOURCE", "payload");
  vi.stubEnv("PAYLOAD_API_URL", "https://cms.example.test");
  state.locale = "en";
  state.jobs = [
    { id: 1, slug: "clinical-fellowship", title: "CMS fellowship title", description: "CMS fellowship description", department: "Clinical", requirements: [], benefits: [], _status: "published" },
    { id: 2, slug: "dental-hygienist", title: "CMS hygienist title", description: "CMS hygienist description", department: "New department", requirements: [{ value: "Stored requirement" }], benefits: [{ value: "Stored benefit" }], _status: "published" },
    { id: 3, slug: "unpublished-role", title: "Unpublished role", _status: "draft" },
  ];
  state.videos = [
    { id: 101, title: "CMS implant discussion", url: "https://www.youtube.com/watch?v=FqxjxR7Rr6Y", description: "CMS video description", topic: "Stored topic", doctor: "Stored presenter", category: "dentist-talk", _status: "published" },
    { id: 102, title: "CMS second discussion", url: "https://youtu.be/ztfm0LjFBt8?si=fixture", category: "dentist-talk", _status: "published" },
    { id: 103, title: "Unrelated testimonial", url: "https://youtu.be/Sj212poMjQQ", category: "testimonial", _status: "published" },
    { id: 104, title: "Unpublished video", url: "https://youtu.be/3IeYTNI9hR8", category: "dentist-talk", _status: "draft" },
  ];
  vi.stubGlobal("fetch", vi.fn(async (input: string) => {
    const url = new URL(input);
    let docs = url.pathname === "/api/career-positions" ? state.jobs : url.pathname === "/api/videos" ? state.videos : undefined;
    if (!docs) throw new Error(`Unexpected CMS collection: ${url.pathname}`);
    docs = docs.filter((doc) => doc._status === "published");
    const slug = url.searchParams.get("where[slug][equals]");
    const category = url.searchParams.get("where[category][equals]");
    if (slug) docs = docs.filter((doc) => doc.slug === slug);
    if (category) docs = docs.filter((doc) => doc.category === category);
    return { ok: true, status: 200, json: async () => ({ docs }) };
  }));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("Careers Payload page consumers", () => {
  it("renders the reader's current published list, titles and descriptions without legacy overlays", async () => {
    render(await CareersPage(params()));
    expect(screen.getByRole("heading", { name: "CMS fellowship title" })).toBeInTheDocument();
    expect(screen.getByText("CMS fellowship description")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /CMS hygienist title/ })).toHaveAttribute("href", "/about/careers/dental-hygienist");
    expect(screen.queryByText("Legacy translated fellowship")).not.toBeInTheDocument();
    expect(screen.queryByText("Unpublished role")).not.toBeInTheDocument();
    expect(screen.queryByText("Dentists")).not.toBeInTheDocument();
  });

  it("does not repopulate an empty/deleted published list with bundled jobs", async () => {
    state.jobs = [];
    render(await CareersPage(params()));
    for (const position of POSITIONS) expect(screen.queryByRole("link", { name: new RegExp(position.title.replace(/[()]/g, "\\$&")) })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Employment Opportunities" })).toBeInTheDocument();
  });

  it.each(["en", "kh", "cn"])("reads CMS career content in the request locale %s without a legacy overlay", async (locale) => {
    render(await CareersPage(params("clinical-fellowship", locale)));
    expect(screen.getByRole("heading", { name: "CMS fellowship title" })).toBeInTheDocument();
    expect(new URL(String(vi.mocked(fetch).mock.calls[0][0])).searchParams.get("locale")).toBe(locale);
  });

  it("uses only CMS description and stored requirements/benefits on a known bundled slug", async () => {
    render(await CareerDetailPage(params()));
    expect(screen.getByRole("heading", { level: 1, name: "CMS fellowship title" })).toBeInTheDocument();
    expect(screen.getByText("CMS fellowship description")).toBeInTheDocument();
    expect(screen.queryByText("Must be Cambodian")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Requirements" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Benefits" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /CMS hygienist title/ })).toBeInTheDocument();
    expect(screen.queryByText("Dentists")).not.toBeInTheDocument();
  });

  it("renders CMS-only job slugs and their stored arrays", async () => {
    render(await CareerDetailPage(params("dental-hygienist")));
    expect(screen.getByRole("heading", { level: 1, name: "CMS hygienist title" })).toBeInTheDocument();
    expect(screen.getByText("Stored requirement")).toBeInTheDocument();
    expect(screen.getByText("Stored benefit")).toBeInTheDocument();
  });

  it("retains the full CMS body and ordered arrays without mutating source records or issuing writes", async () => {
    const description = "CMS first paragraph in full.\n\nCMS second paragraph in full.";
    state.jobs[0] = {
      ...state.jobs[0], description,
      requirements: [{ id: "r1", value: "First stored requirement" }, { id: "r2", value: "Second stored requirement" }],
      benefits: [{ id: "b1", value: "First stored benefit" }, { id: "b2", value: "Second stored benefit" }],
    };
    const recordsBefore = JSON.parse(JSON.stringify(state.jobs));
    const bundledBefore = JSON.parse(JSON.stringify(POSITIONS));
    render(await CareerDetailPage(params()));
    expect(screen.getByText(/CMS second paragraph in full/).textContent).toBe(description);
    const requirements = screen.getByRole("heading", { name: "Requirements" }).nextElementSibling!;
    const benefits = screen.getByRole("heading", { name: "Benefits" }).nextElementSibling!;
    expect(Array.from(requirements.querySelectorAll("li"), (item) => item.textContent)).toEqual([
      "First stored requirement", "Second stored requirement",
    ]);
    expect(Array.from(benefits.querySelectorAll("li"), (item) => item.textContent)).toEqual([
      "First stored benefit", "Second stored benefit",
    ]);
    expect(state.jobs).toEqual(recordsBefore);
    expect(POSITIONS).toEqual(bundledBefore);
    for (const [, init] of vi.mocked(fetch).mock.calls) expect(init?.method ?? "GET").toBe("GET");
  });

  it("returns not-found after a known bundled job is unpublished or deleted", async () => {
    state.jobs = state.jobs.filter((doc) => doc.slug !== "clinical-fellowship");
    await expect(CareerDetailPage(params())).rejects.toThrow("NEXT_NOT_FOUND");
    expect(await generateMetadata(params())).toEqual({});
  });

  it("generates CMS static params and metadata from the same published reader", async () => {
    expect(await generateStaticParams()).toEqual([{ slug: "clinical-fellowship" }, { slug: "dental-hygienist" }]);
    expect(await generateMetadata(params())).toMatchObject({ title: "CMS fellowship title | Careers | Roomchang Dental Hospital", description: "CMS fellowship description" });
  });

  it("displays the per-job application email when supplied by the reader", async () => {
    const job = Object.assign((await data.getCareerPositionBySlug("clinical-fellowship"))!, { applicationEmail: "jobs@example.test" });
    vi.spyOn(data, "getCareerPositionBySlug").mockResolvedValue(job);
    vi.spyOn(data, "getCareerPositions").mockResolvedValue([job]);
    render(await CareerDetailPage(params()));
    expect(screen.getByRole("link", { name: "jobs@example.test" })).toHaveAttribute("href", "mailto:jobs@example.test");
    cleanup();
    render(await CareersPage(params()));
    expect(screen.getByText("jobs@example.test")).toBeInTheDocument();
  });

  it("surfaces a failed CMS read instead of showing stale bundled vacancies", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(CareersPage(params())).rejects.toThrow(/CMS|content|unavailable/i);
    await expect(CareerDetailPage(params())).rejects.toThrow(/CMS|content|unavailable/i);
  });

  it("keeps the bundled jobs, legacy translation overlays and metadata outside Payload mode", async () => {
    vi.stubEnv("CONTENT_SOURCE", "supabase");
    vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Non-Payload page must not query CMS"); }));
    render(await CareersPage(params()));
    expect(screen.getByRole("heading", { name: "Legacy translated fellowship" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dentists" })).toBeInTheDocument();
    cleanup();
    render(await CareerDetailPage(params()));
    expect(screen.getByRole("heading", { level: 1, name: "Legacy translated fellowship" })).toBeInTheDocument();
    expect(screen.getByText("Must be Cambodian")).toBeInTheDocument();
    expect(await generateStaticParams()).toEqual(POSITIONS.map(({ slug }) => ({ slug })));
    expect(await generateMetadata(params())).toMatchObject({ description: POSITIONS[0].shortDescription });
  });
});

describe("Dentist Talks Payload page consumer", () => {
  it("renders only the actual dentist-talk category, using CMS URLs and titles rather than bundled IDs", async () => {
    const { container } = render(await DentistTalksPage(params()));
    const frames = container.querySelectorAll("iframe");
    expect(frames).toHaveLength(2);
    expect(screen.getByTitle("CMS implant discussion")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/FqxjxR7Rr6Y?rel=0");
    expect(screen.getByTitle("CMS second discussion")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/ztfm0LjFBt8?rel=0");
    expect(screen.getByText("CMS video description")).toBeInTheDocument();
    expect(screen.getByText("Stored topic")).toBeInTheDocument();
    expect(screen.queryByText("Unrelated testimonial")).not.toBeInTheDocument();
    expect(screen.queryByText("Unpublished video")).not.toBeInTheDocument();
  });

  it("respects an empty collection without restoring the bundled 24 videos", async () => {
    state.videos = [];
    const { container } = render(await DentistTalksPage(params()));
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
  });

  it.each(["kh", "cn"])("passes the current locale %s to the video reader", async (locale) => {
    render(await DentistTalksPage(params("unused", locale)));
    expect(screen.getByTitle("CMS implant discussion")).toBeInTheDocument();
    expect(new URL(String(vi.mocked(fetch).mock.calls[0][0])).searchParams.get("locale")).toBe(locale);
  });

  it.each([
    "https://www.youtube.com/watch?v=ztfm0LjFBt8&list=untrusted",
    "https://youtu.be/ztfm0LjFBt8?t=10",
    "https://www.youtube-nocookie.com/embed/ztfm0LjFBt8?autoplay=1",
    "https://m.youtube.com/shorts/ztfm0LjFBt8",
  ])("builds a fixed privacy-enhanced embed from a safe YouTube URL: %s", async (url) => {
    state.videos = [{ ...state.videos[0], url }];
    render(await DentistTalksPage(params()));
    expect(screen.getByTitle("CMS implant discussion")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/ztfm0LjFBt8?rel=0");
  });

  it.each([
    "javascript:alert(1)", "https://evil.test/youtube.com/watch?v=ztfm0LjFBt8",
    "https://youtube.com.evil.test/watch?v=ztfm0LjFBt8", "https://youtube.com@evil.test/watch?v=ztfm0LjFBt8",
    "https://www.youtube.com/watch?v=ztfm0LjFBt8extra", "https://www.youtube.com/watch?v=short",
    "https://www.youtube.com/embed/ztfm0LjFBt8/extra", "https://example.test/video.mp4",
  ])("does not embed or link an unsafe/unsupported media URL: %s", async (url) => {
    state.videos = [{ ...state.videos[0], url }];
    const { container } = render(await DentistTalksPage(params()));
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
    expect(container.querySelector(`a[href="${url}"]`)).toBeNull();
  });

  it("keeps a titleless record usable without inventing a translation key for its CMS ID", async () => {
    state.videos = [{ ...state.videos[0], title: "", topic: null }];
    const { container } = render(await DentistTalksPage(params()));
    expect(container.querySelectorAll("iframe")).toHaveLength(1);
    const frame = container.querySelector("iframe");
    expect(frame).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/FqxjxR7Rr6Y?rel=0");
    expect(frame?.getAttribute("title")).toBeTruthy();
    expect(frame?.getAttribute("title")).not.toMatch(/items\.|101/);
  });

  it("surfaces CMS read errors without restoring the bundled videos", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(DentistTalksPage(params())).rejects.toThrow(/CMS|content|unavailable/i);
  });

  it("keeps the exact bundled playlist embeds outside Payload mode", async () => {
    vi.stubEnv("CONTENT_SOURCE", "supabase");
    vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Non-Payload page must not query CMS"); }));
    const { container } = render(await DentistTalksPage(params()));
    expect(container.querySelectorAll("iframe")).toHaveLength(24);
    expect(container.querySelector("iframe")?.src).toBe("https://www.youtube-nocookie.com/embed/Sj212poMjQQ?list=PL2Dq5LzBKy4wi9hCaXPEoFhY1xY-LoN46&rel=0");
  });
});
