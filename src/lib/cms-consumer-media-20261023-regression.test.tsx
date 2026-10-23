import type { ComponentProps, ReactNode } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TestimonialsPage from "@/app/[locale]/about/testimonials/page";
import DentistTalksPage from "@/app/[locale]/blog/dentist-talks/page";
import { HomeTestimonials } from "@/components/sections/home-testimonials";
import { getTestimonials, type Testimonial } from "@/lib/data";
import en from "../../messages/en.json";
import km from "../../messages/km.json";
import zh from "../../messages/zh.json";

const state = vi.hoisted(() => ({
  locale: "en",
  videos: [] as readonly Record<string, unknown>[],
  testimonials: [] as readonly Record<string, unknown>[],
  legacyTestimonials: [] as Testimonial[],
}));

vi.mock("@/components/site/site-shell", () => ({
  SiteShell: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, ...props }: ComponentProps<"a">) => <a {...props}>{children}</a>,
}));
vi.mock("next/headers", () => ({ draftMode: async () => ({ isEnabled: false }) }));
vi.mock("next-intl/server", async () => {
  const { createTranslator } = await import("next-intl");
  const messages = {
    en: (await import("../../messages/en.json")).default,
    kh: (await import("../../messages/km.json")).default,
    cn: (await import("../../messages/zh.json")).default,
  };
  return {
    getLocale: async () => state.locale,
    setRequestLocale: (locale: string) => { state.locale = locale; },
    getTranslations: async (options?: string | { locale?: string; namespace?: string }) => {
      const locale = (typeof options === "object" ? options.locale : undefined) ?? state.locale;
      return createTranslator({
        locale: { en: "en", kh: "km", cn: "zh" }[locale]!,
        messages: messages[locale as keyof typeof messages] as import("next-intl").AbstractIntlMessages,
        namespace: typeof options === "string" ? options : options?.namespace,
      });
    },
  };
});
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => {
      if (table !== "testimonials") throw new Error(`Unexpected legacy read: ${table}`);
      return {
        select() { return this; },
        eq() { return this; },
        order: async () => ({ data: state.legacyTestimonials, error: null }),
      };
    },
  },
}));
vi.mock("@/lib/supabase-server", () => ({
  supabaseServer: { from: () => { throw new Error("Unexpected privileged content read"); } },
}));

const params = (locale = "en") => ({ params: Promise.resolve({ locale }) });
const written = (overrides: Partial<Testimonial> = {}): Testimonial => ({
  id: "written-1", authorName: "Patient One", authorTitle: null,
  authorPhotoUrl: null, quote: "Stored patient quote", rating: 4,
  isFeatured: false, order: 1, published: true, ...overrides,
});
const video = (overrides: Record<string, unknown> = {}) => ({
  id: "video-first", title: "Stored patient video", url: "https://youtu.be/FqxjxR7Rr6Y?t=20",
  thumbnail: null, description: "Stored first paragraph.\n\nStored second paragraph.",
  category: "testimonial", doctor: null, topic: null, treatment: "Stored treatment",
  order: 1, _status: "published", ...overrides,
});

function renderHome(testimonials: Testimonial[], locale = "en", filterFeatured = false) {
  const messages = { en, kh: km, cn: zh }[locale as "en" | "kh" | "cn"];
  return render(
    <NextIntlClientProvider locale={{ en: "en", kh: "km", cn: "zh" }[locale]!} messages={messages} timeZone="Asia/Phnom_Penh">
      <HomeTestimonials testimonials={testimonials} filterFeatured={filterFeatured} />
    </NextIntlClientProvider>,
  );
}

beforeEach(() => {
  vi.stubEnv("CONTENT_SOURCE", "payload");
  vi.stubEnv("PAYLOAD_API_URL", "https://cms.example.test");
  state.locale = "en";
  state.videos = [
    video({ id: "video-second", title: "Stored second video", url: "https://www.youtube.com/watch?v=ztfm0LjFBt8&autoplay=1", order: 2 }),
    video(),
    video({ id: "talk", category: "dentist-talk", title: "Stored dentist talk", topic: "Stored topic", doctor: "Stored presenter" }),
    video({ id: "draft", title: "Unpublished patient video", _status: "draft" }),
  ];
  state.testimonials = [];
  state.legacyTestimonials = [];
  vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    if (init?.method && init.method !== "GET") throw new Error("Tests must not write content");
    const url = new URL(String(input));
    if (url.origin !== "https://cms.example.test") throw new Error(`Unexpected host: ${url.origin}`);
    const source = url.pathname === "/api/videos" ? state.videos
      : url.pathname === "/api/testimonials" ? state.testimonials : undefined;
    if (!source) throw new Error(`Unexpected collection: ${url.pathname}`);
    const category = url.searchParams.get("where[category][equals]");
    const docs = source.filter((doc) => doc._status === "published" && (!category || doc.category === category));
    if (url.searchParams.get("sort") === "order,id") docs.sort((a, b) => Number(a.order) - Number(b.order) || String(a.id).localeCompare(String(b.id)));
    return { ok: true, status: 200, json: async () => ({ docs }) };
  }));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("approved testimonial video consumers", () => {
  it.each([
    ["en", "Stored patient video"],
    ["kh", "វីដេអូអ្នកជំងឺពី CMS"],
    ["cn", "CMS 患者视频"],
  ])("uses CMS content, category and order for %s, not legacy IDs or messages", async (locale, title) => {
    state.videos = state.videos.map((record) => record.id === "video-first" ? { ...record, title } : record);
    const { container } = render(await TestimonialsPage(params(locale)));
    const frames = Array.from(container.querySelectorAll("iframe"));
    expect(frames.map((frame) => frame.title)).toEqual([title, "Stored second video"]);
    expect(frames.map((frame) => frame.getAttribute("src"))).toEqual([
      "https://www.youtube-nocookie.com/embed/FqxjxR7Rr6Y?rel=0",
      "https://www.youtube-nocookie.com/embed/ztfm0LjFBt8?rel=0",
    ]);
    expect(screen.getAllByText("Stored treatment")).toHaveLength(2);
    expect(screen.getAllByText(/Stored second paragraph/)[0].textContent).toBe("Stored first paragraph.\n\nStored second paragraph.");
    expect(screen.queryByText("Stored dentist talk")).not.toBeInTheDocument();
    expect(screen.queryByText("Unpublished patient video")).not.toBeInTheDocument();
    const request = vi.mocked(fetch).mock.calls.map(([url]) => new URL(String(url))).find((url) => url.pathname === "/api/videos");
    expect(request?.searchParams.get("where[category][equals]")).toBe("testimonial");
    expect(request?.searchParams.get("locale")).toBe(locale);
    expect(request?.searchParams.get("sort")).toBe("order,id");
  });

  it.each(["en", "kh", "cn"])("leaves an empty Payload source empty in %s", async (locale) => {
    state.videos = [];
    const { container } = render(await TestimonialsPage(params(locale)));
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
    expect(container.querySelectorAll("blockquote")).toHaveLength(0);
  });

  it("does not invent descriptions or treatments for blank CMS fields", async () => {
    state.videos = [video({ description: null, treatment: null })];
    const { container } = render(await TestimonialsPage(params()));
    expect(container.querySelectorAll("iframe")).toHaveLength(1);
    expect(screen.queryByText("Stored treatment")).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/video\.items\.|undefined|null/);
  });

  it("surfaces a failed reader instead of restoring fixed testimonial videos", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: string) => new URL(input).pathname === "/api/testimonials"
      ? { ok: true, status: 200, json: async () => ({ docs: [] }) }
      : { ok: false, status: 503 }));
    await expect(TestimonialsPage(params())).rejects.toThrow(/CMS|content|unavailable/i);
  });

  it("keeps titleless CMS videos accessible without looking up their IDs in messages", async () => {
    state.videos = [video({ title: "  ", description: null, treatment: null })];
    const { container } = render(await TestimonialsPage(params()));
    const frame = container.querySelector("iframe");
    expect(frame).toHaveAttribute("title", "Video Testimonials");
    expect(frame).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/FqxjxR7Rr6Y?rel=0");
  });

  it.each(["en", "kh", "cn"])("retains the exact legacy video behavior outside Payload in %s", async (locale) => {
    vi.stubEnv("CONTENT_SOURCE", "supabase");
    const { container } = render(await TestimonialsPage(params(locale)));
    expect(container.querySelectorAll("iframe")).toHaveLength(15);
    expect(container.querySelector("iframe")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/ryxcCSeH4ZE");
    cleanup();
    render(await DentistTalksPage(params(locale)));
    expect(document.querySelectorAll("iframe")).toHaveLength(24);
    expect(document.querySelector("iframe")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/Sj212poMjQQ?list=PL2Dq5LzBKy4wi9hCaXPEoFhY1xY-LoN46&rel=0");
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("video URL rejection at both page consumers", () => {
  it.each([
    "javascript:alert(1)", "data:text/html,unsafe", "//www.youtube.com/embed/FqxjxR7Rr6Y",
    "http://www.youtube.com/watch?v=FqxjxR7Rr6Y", "https://youtube.com.evil.test/watch?v=FqxjxR7Rr6Y",
    "https://youtube.com@evil.test/watch?v=FqxjxR7Rr6Y", "https://user:pass@youtube.com/watch?v=FqxjxR7Rr6Y",
    "https://www.youtube.com:444/embed/FqxjxR7Rr6Y", "https://www.youtube.com/embed/FqxjxR7Rr6Y/extra",
    "https://www.youtube.com/watch?v=FqxjxR7Rr6Yextra", "https://example.test/video.mp4",
  ])("never embeds or links unsafe/unsupported media: %s", async (url) => {
    for (const [Page, category] of [[TestimonialsPage, "testimonial"], [DentistTalksPage, "dentist-talk"]] as const) {
      state.videos = [video({ url, category })];
      const { container, unmount } = render(await Page(params()));
      expect(container.querySelectorAll("iframe")).toHaveLength(0);
      expect(Array.from(container.querySelectorAll("a"), (link) => link.getAttribute("href"))).not.toContain(url);
      unmount();
    }
  });
});

describe("Dentist Talks stored media metadata", () => {
  it.each(["en", "kh", "cn"])("displays treatment and an optional clickable thumbnail in %s", async (locale) => {
    state.videos = [video({ category: "dentist-talk", title: "Stored dentist talk", topic: "Stored topic", doctor: "Stored presenter", thumbnail: "https://roomchang.com/talk.jpg" })];
    const { container } = render(await DentistTalksPage(params(locale)));
    expect(screen.getByText("Stored treatment")).toBeInTheDocument();
    expect(screen.getByText("Stored topic")).toBeInTheDocument();
    expect(screen.getByText("Stored presenter")).toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute("src", "https://roomchang.com/talk.jpg");
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Stored dentist talk" }));
    expect(screen.getByTitle("Stored dentist talk")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/FqxjxR7Rr6Y?rel=0");
    const request = new URL(String(vi.mocked(fetch).mock.calls[0][0]));
    expect(request.searchParams.get("locale")).toBe(locale);
    expect(request.searchParams.get("where[category][equals]")).toBe("dentist-talk");
  });

  it("falls back to the existing playable embed if the thumbnail fails to load", async () => {
    state.videos = [video({ category: "dentist-talk", thumbnail: "/missing-talk.jpg" })];
    const { container } = render(await DentistTalksPage(params()));
    const image = container.querySelector("img");
    expect(image).toHaveAttribute("src", "/missing-talk.jpg");
    fireEvent.error(image!);
    expect(container.querySelectorAll("iframe")).toHaveLength(1);
  });

  it.each([null, "", "javascript:alert(1)", "data:image/svg+xml,unsafe", "//evil.test/talk.jpg", "/\\evil.test/talk.jpg", "https://user:pass@roomchang.com/talk.jpg"])("does not use an absent or unsafe thumbnail: %s", async (thumbnail) => {
    state.videos = [video({ category: "dentist-talk", thumbnail, treatment: null, topic: null })];
    const { container } = render(await DentistTalksPage(params()));
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll("iframe")).toHaveLength(1);
    expect(screen.queryByText("Stored treatment")).not.toBeInTheDocument();
  });
});

describe("testimonial-category optional thumbnails", () => {
  it.each(["en", "kh", "cn"])("uses the same approved poster and player behavior in %s", async (locale) => {
    state.videos = [video({ thumbnail: "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/testimonial.jpg" })];
    const { container } = render(await TestimonialsPage(params(locale)));
    expect(container.querySelector("img")).toHaveAttribute("src", "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/testimonial.jpg");
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
    expect(screen.getByText("Stored treatment")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Stored patient video" }));
    expect(screen.getByTitle("Stored patient video")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/FqxjxR7Rr6Y?rel=0");
  });

  it("keeps a testimonial playable if its approved thumbnail fails to load", async () => {
    state.videos = [video({ thumbnail: "/missing-testimonial.jpg" })];
    const { container } = render(await TestimonialsPage(params()));
    const image = container.querySelector("img");
    expect(image).toHaveAttribute("src", "/missing-testimonial.jpg");
    fireEvent.error(image!);
    expect(screen.getByTitle("Stored patient video")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/FqxjxR7Rr6Y?rel=0");
  });
});

describe("homepage written testimonial fields", () => {
  it.each(["en", "kh", "cn"])("uses stored photos and ratings without changing attribution in %s", (locale) => {
    const { container } = renderHome([written({ authorPhotoUrl: "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/patient.jpg", rating: 3 })], locale);
    const button = screen.getByRole("button");
    expect(button.querySelector("img")).toHaveAttribute("src", "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/patient.jpg");
    expect(screen.getByText("Patient O.")).toBeInTheDocument();
    expect(screen.getByText("3/5")).toBeInTheDocument();
    expect(container.querySelector("blockquote")).toHaveTextContent("Stored patient quote");
    expect(button).toHaveAttribute("aria-label", expect.stringContaining("Patient One"));
  });

  it("shows only explicit featured records, retaining their source order", () => {
    renderHome([
      written({ id: "hidden", quote: "Not featured" }),
      written({ id: "featured-2", authorName: "Featured Second", quote: "First featured quote", isFeatured: true }),
      written({ id: "featured-1", authorName: "Featured First", quote: "Second featured quote", isFeatured: true }),
    ], "en", true);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveAttribute("aria-label", expect.stringContaining("Featured Second"));
    expect(screen.getByRole("blockquote")).toHaveTextContent("First featured quote");
    fireEvent.click(buttons[1]);
    expect(screen.getByRole("blockquote")).toHaveTextContent("Second featured quote");
    expect(screen.queryByText("Not featured")).not.toBeInTheDocument();
  });

  it("preserves every record if no item is explicitly featured, including legacy props", () => {
    const records = [written(), written({ id: "written-2", authorName: "Patient Two", quote: "Second stored quote" })];
    renderHome(records);
    expect(screen.getAllByRole("button")).toHaveLength(2);
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(screen.getByRole("blockquote")).toHaveTextContent("Second stored quote");
  });

  it("continues to consume non-Payload written testimonials with their supplied fields", async () => {
    vi.stubEnv("CONTENT_SOURCE", "supabase");
    state.legacyTestimonials = [written({ authorPhotoUrl: "/patient.jpg", rating: 2 })];
    renderHome(await getTestimonials());
    expect(screen.getByRole("blockquote")).toHaveTextContent("Stored patient quote");
    expect(screen.getByText("2/5")).toBeInTheDocument();
    expect(screen.getByRole("button").querySelector("img")).toHaveAttribute("src", "/patient.jpg");
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each(["javascript:alert(1)", "data:image/svg+xml,unsafe", "//evil.test/photo.jpg", "/\\evil.test/photo.jpg", "https://user:pass@roomchang.com/photo.jpg"])("uses initials instead of an unsafe author photo: %s", (authorPhotoUrl) => {
    renderHome([written({ authorPhotoUrl })]);
    expect(screen.getByRole("button")).toHaveTextContent("PO");
    expect(document.querySelectorAll("img")).toHaveLength(0);
  });

  it("falls back to initials when a stored author photo fails to load", () => {
    renderHome([written({ authorPhotoUrl: "/patient.jpg" })]);
    const image = document.querySelector("img");
    expect(image).toHaveAttribute("src", "/patient.jpg");
    fireEvent.error(image!);
    expect(screen.getByRole("button")).toHaveTextContent("PO");
  });

  it.each([0, -1, 6, Number.NaN, Number.POSITIVE_INFINITY])("does not invent a rating for invalid value %s", (rating) => {
    const { container } = renderHome([written({ rating })]);
    expect(container.textContent).not.toMatch(/\/5/);
  });

  it("keeps the existing automatic advance and stays valid after the selected source shrinks", () => {
    vi.useFakeTimers();
    const records = [written(), written({ id: "second", quote: "Second quote" }), written({ id: "third", quote: "Third quote" })];
    const view = renderHome(records);
    act(() => { vi.advanceTimersByTime(6000); });
    expect(screen.getByRole("blockquote")).toHaveTextContent("Second quote");
    fireEvent.click(screen.getAllByRole("button")[2]);
    expect(screen.getByRole("blockquote")).toHaveTextContent("Third quote");
    view.rerender(<NextIntlClientProvider locale="en" messages={en} timeZone="Asia/Phnom_Penh"><HomeTestimonials testimonials={[records[0]]} /></NextIntlClientProvider>);
    expect(screen.getByRole("blockquote")).toHaveTextContent("Stored patient quote");
  });

  it("renders nothing for an empty written source", () => {
    expect(renderHome([]).container).toBeEmptyDOMElement();
  });
});

describe("new media consumers follow the website image host allowlist", () => {
  it.each([
    "https://roomchang.com/photo.jpg",
    "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/photo.jpg",
    "/about/testimonials/patient.jpg",
  ])("accepts an approved image at both consumers: %s", async (url) => {
    for (const [Page, category] of [[TestimonialsPage, "testimonial"], [DentistTalksPage, "dentist-talk"]] as const) {
      state.videos = [video({ category, thumbnail: url })];
      const view = render(await Page(params()));
      expect(view.container.querySelector("img")).toHaveAttribute("src", url);
      view.unmount();
    }
    renderHome([written({ authorPhotoUrl: url })]);
    expect(screen.getByRole("button").querySelector("img")).toHaveAttribute("src", url);
  });

  it.each([
    "https://images.example.test/photo.jpg",
    "https://uploads.example.test/photo.jpg",
    "https://roomchang.com.evil.test/photo.jpg",
    "https://www.roomchang.com/photo.jpg",
    "https://sub.roomchang.com/photo.jpg",
    "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev.evil.test/photo.jpg",
    "https://roomchang.com:444/photo.jpg",
    "http://roomchang.com/photo.jpg",
    "https:roomchang.com/photo.jpg",
  ])("rejects an unapproved remote image and keeps both consumers usable: %s", async (url) => {
    for (const [Page, category] of [[TestimonialsPage, "testimonial"], [DentistTalksPage, "dentist-talk"]] as const) {
      state.videos = [video({ category, thumbnail: url })];
      const view = render(await Page(params()));
      expect(view.container.querySelectorAll("img")).toHaveLength(0);
      expect(view.container.querySelector("iframe")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/FqxjxR7Rr6Y?rel=0");
      view.unmount();
    }
    renderHome([written({ authorPhotoUrl: url })]);
    expect(screen.getByRole("button")).toHaveTextContent("PO");
    expect(document.querySelectorAll("img")).toHaveLength(0);
    expect(screen.getByRole("blockquote")).toHaveTextContent("Stored patient quote");
  });
});

it("does not mutate source records or issue writes while consuming videos and written testimonials", async () => {
  state.videos = Object.freeze(state.videos.map((record) => Object.freeze(record)));
  state.testimonials = Object.freeze([Object.freeze({ ...written(), _status: "published" })]);
  const before = JSON.stringify({ videos: state.videos, testimonials: state.testimonials });
  render(await TestimonialsPage(params()));
  cleanup();
  render(await DentistTalksPage(params()));
  cleanup();
  const records = Object.freeze([Object.freeze(written()), Object.freeze(written({ id: "featured", isFeatured: true }))]);
  const homeBefore = JSON.stringify(records);
  renderHome(records as unknown as Testimonial[]);
  fireEvent.click(screen.getAllByRole("button")[0]);
  expect(JSON.stringify(records)).toBe(homeBefore);
  expect(JSON.stringify({ videos: state.videos, testimonials: state.testimonials })).toBe(before);
  for (const [, init] of vi.mocked(fetch).mock.calls) expect(init?.method ?? "GET").toBe("GET");
});
