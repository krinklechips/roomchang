import type { ComponentProps, ReactNode } from "react";
import { NextIntlClientProvider, type AbstractIntlMessages, createTranslator } from "next-intl";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CareersPage from "@/app/[locale]/about/careers/page";
import CareerDetailPage from "@/app/[locale]/about/careers/[slug]/page";
import PublicationsPage from "@/app/[locale]/blog/publications/page";
import BranchPage from "@/app/[locale]/about/branches/[slug]/page";
import { careerPagePosition } from "@/lib/career-page-content";
import { BRANCHES } from "@/lib/branches";
import { POSITIONS } from "@/lib/careers";
import type { CareerPosition, Publication } from "@/lib/data";
import en from "../../messages/en.json";
import kh from "../../messages/km.json";
import cn from "../../messages/zh.json";

const messages: Record<string, AbstractIntlMessages> = { en, kh, cn };
const state = vi.hoisted(() => ({
  locale: "en",
  payload: true,
  jobs: [] as CareerPosition[],
  publications: [] as Publication[],
  photos: undefined as unknown,
}));

vi.mock("@/components/site/site-shell", () => ({ SiteShell: ({ children }: { children: ReactNode }) => <>{children}</> }));
vi.mock("@/i18n/navigation", () => ({ Link: ({ children, ...props }: ComponentProps<"a">) => <a {...props}>{children}</a> }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NEXT_NOT_FOUND"); } }));
vi.mock("next-intl/server", () => ({
  setRequestLocale: (locale: string) => { state.locale = locale; },
  getTranslations: async (namespace: string) => createTranslator({ locale: state.locale, messages: messages[state.locale], namespace }),
}));
vi.mock("@/lib/payload-source", () => ({ isPayloadSource: () => state.payload }));
vi.mock("@/lib/data", () => ({
  getCareerPositions: async () => state.jobs,
  getCareerPositionBySlug: async (slug: string) => state.jobs.find((job) => job.slug === slug) ?? null,
  getPublications: async () => state.publications,
}));
vi.mock("@/lib/branch-content", () => ({ getBranchDetails: async () => BRANCHES.map((branch, index) => index ? branch : { ...branch, photos: state.photos }) }));
vi.mock("@/lib/i18n-content", () => ({
  getTranslatedFields: async () => ({}),
  getTranslatedFieldsBatch: async () => new Map(),
  mergeTranslation: <T,>(value: T) => value,
}));

const params = (slug = "cms-role", locale = "en") => ({ params: Promise.resolve({ slug, locale }) });
const job = (values: Partial<CareerPosition> = {}): CareerPosition => ({
  id: "cms-role", slug: "cms-role", title: "Stored job", description: "Stored description",
  department: "Stored department", type: "Stored employment type", location: "Stored location",
  requirements: [], benefits: [], order: 0, published: true, ...values,
});
const publication = (values: Partial<Publication> = {}): Publication => ({
  id: "paper", title: "Stored display title", originalTitle: "Original citation title", authors: "Stored authors",
  journal: "Stored journal", year: 2025, doi: "10.1234/stored", url: "https://example.test/paper?original=1",
  abstract: "Stored abstract first paragraph.\n\nStored abstract second paragraph.", order: 0, published: true, ...values,
});
function show(tree: ReactNode) {
  return render(<NextIntlClientProvider locale={state.locale} messages={messages[state.locale]}>{tree}</NextIntlClientProvider>);
}
function freeze<T>(value: T): T {
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}

beforeEach(() => {
  state.locale = "en";
  state.payload = true;
  state.jobs = [job(), job({ id: "other-role", slug: "other-role", title: "Other stored job", type: "Other stored type", location: "Other stored location" })];
  state.publications = [publication()];
  state.photos = [];
});
afterEach(() => cleanup());

describe("narrow career consumers", () => {
  it("preserves type/location and existing fields through the view-model without mutation", () => {
    const source = freeze(job({ type: "  Original type  ", location: "  Original location  " }));
    const before = structuredClone(source);
    expect(careerPagePosition(source)).toMatchObject({
      slug: source.slug, title: source.title, category: source.department, shortDescription: source.description,
      type: source.type, location: source.location, requirements: [], benefits: [],
    });
    expect(source).toEqual(before);
  });

  it.each(["en", "kh", "cn"])("shows reader type/location on the list, detail and related jobs in %s", async (locale) => {
    freeze(state.jobs);
    const before = structuredClone(state.jobs);
    show(await CareersPage(params("cms-role", locale)));
    const card = screen.getByRole("link", { name: /Stored job/ });
    expect(card).toHaveAttribute("href", "/about/careers/cms-role");
    expect(within(card).getByText("Stored employment type")).toBeVisible();
    expect(within(card).getByText("Stored location")).toBeVisible();
    cleanup();
    show(await CareerDetailPage(params("cms-role", locale)));
    expect(screen.getByText("Stored employment type")).toBeVisible();
    expect(screen.getByText("Stored location")).toBeVisible();
    const related = screen.getByRole("link", { name: /Other stored job/ });
    expect(within(related).getByText("Other stored type")).toBeVisible();
    expect(within(related).getByText("Other stored location")).toBeVisible();
    expect(state.jobs).toEqual(before);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([undefined, null, "", "   ", 12, {}, []])("omits malformed/empty optional type and location: %j", async (value) => {
    state.jobs = [job({ type: value, location: value } as Partial<CareerPosition>)];
    const mapped = careerPagePosition(state.jobs[0]);
    expect(mapped.type).toBeUndefined();
    expect(mapped.location).toBeUndefined();
    show(await CareersPage(params()));
    expect(screen.getByRole("heading", { name: "Stored job" })).toBeVisible();
    cleanup();
    show(await CareerDetailPage(params()));
    expect(screen.getByRole("heading", { level: 1, name: "Stored job" })).toBeVisible();
  });
});

describe("narrow publication consumers", () => {
  it.each(["en", "kh", "cn"])("shows the full abstract as text while preserving citation and URLs in %s", async (locale) => {
    state.publications[0].abstract += "\n<script>not markup</script>";
    freeze(state.publications);
    const before = structuredClone(state.publications);
    const { container } = show(await PublicationsPage(params("unused", locale)));
    const article = container.querySelector("article")!;
    expect(within(article).getByText(/Stored abstract second paragraph/).textContent).toBe(state.publications[0].abstract);
    expect(article.querySelector("script")).toBeNull();
    expect(article.textContent).toContain("Original citation title");
    expect(article.textContent).toContain("Stored authors");
    expect(article.querySelector('a[href="https://doi.org/10.1234/stored"]')).not.toBeNull();
    expect(article.querySelector('a[href="https://example.test/paper?original=1"]')).not.toBeNull();
    expect(state.publications).toEqual(before);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("groups years newest first without reordering the reader's stable order within a year", async () => {
    state.publications = freeze([
      publication({ id: "older-a", title: "Older first", year: 2024, order: 3 }),
      publication({ id: "newer", title: "Newest", year: 2026 }),
      publication({ id: "older-b", title: "Older tied", year: 2024, order: 3 }),
      publication({ id: "older-c", title: "Older final", year: 2024, order: 8 }),
    ]);
    const before = structuredClone(state.publications);
    const { container } = show(await PublicationsPage(params()));
    expect(Array.from(container.querySelectorAll("article h3"), (node) => node.textContent)).toEqual(["Newest", "Older first", "Older tied", "Older final"]);
    expect(state.publications).toEqual(before);
  });

  it.each([undefined, null, "", "   ", 42, {}, []])("omits malformed/empty optional abstract: %j", async (abstract) => {
    state.publications = [publication({ abstract } as Partial<Publication>)];
    const { container } = show(await PublicationsPage(params()));
    expect(container.querySelectorAll("article p")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Stored display title" })).toBeVisible();
  });

  it("does not restore bundled publications for an empty Payload result", async () => {
    state.publications = [];
    const { container } = show(await PublicationsPage(params()));
    expect(container.querySelectorAll("article")).toHaveLength(0);
  });
});

describe("narrow branch photo consumer", () => {
  it.each(["en", "kh", "cn"])("renders ordered string/src/url photos, stored captions and alt text without mutation in %s", async (locale) => {
    state.photos = freeze([
      "/about/branch-main-exterior.jpg?original=1",
      { src: "/about/branch-interior-reception.jpg", caption: "Stored reception caption", alt: "Stored reception alt" },
      { url: "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/existing.jpg", caption: "Stored exterior caption" },
      { src: "/about/branch-staff-photo.jpeg", caption: 42, alt: "Stored staff alt" },
    ]);
    const before = structuredClone(state.photos);
    const { container } = show(await BranchPage(params(BRANCHES[0].slug, locale)));
    const figures = Array.from(container.querySelectorAll("figure"));
    expect(figures).toHaveLength(4);
    expect(figures.map((figure) => figure.querySelector("img")?.getAttribute("alt"))).toEqual(["", "Stored reception alt", "Stored exterior caption", "Stored staff alt"]);
    expect(screen.getByText("Stored reception caption")).toBeVisible();
    expect(screen.getByText("Stored exterior caption")).toBeVisible();
    expect(figures[0].querySelector("img")?.getAttribute("src")).toContain(encodeURIComponent("/about/branch-main-exterior.jpg?original=1"));
    expect(screen.getByRole("heading", { level: 1, name: BRANCHES[0].shortName })).toBeVisible();
    expect(container.querySelector(`a[href="${BRANCHES[0].mapPlaceUrl}"]`)).not.toBeNull();
    expect(state.photos).toEqual(before);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("retains valid neighbors while ignoring malformed entries and unsafe image sources", async () => {
    state.photos = [null, 12, {}, [], "", " ", "javascript:alert(1)", "data:image/svg+xml,<svg/>", "//evil.test/a.jpg", "/\\evil.test/a.jpg", { src: null }, { src: {} }, { src: "https://" }, { src: "https://user:password@example.test/a.jpg" }, { src: "/about/branch-main-exterior.jpg", alt: {}, caption: [] }];
    const { container } = show(await BranchPage(params(BRANCHES[0].slug)));
    expect(container.querySelectorAll("figure")).toHaveLength(1);
    expect(container.querySelector("figure img")).toHaveAttribute("alt", "");
  });

  it.each(["https:example.test/photo.jpg", "http:/example.test/photo.jpg"])("omits malformed absolute URLs without an authority: %s", async (src) => {
    state.photos = [{ src }];
    const { container } = show(await BranchPage(params(BRANCHES[0].slug)));
    expect(container.querySelectorAll("figure")).toHaveLength(0);
  });

  it.each([
    "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/existing-photo.jpg?original=1",
    "https://roomchang.com/about/existing%20photo.jpg?original=%2Fstored%3Fvalue%3D1",
  ])("optimizes an allowlisted existing url without rewriting its value: %s", async (url) => {
    state.photos = freeze([{ src: "", url, caption: "Stored external caption" }]);
    const before = structuredClone(state.photos);
    const { container } = show(await BranchPage(params(BRANCHES[0].slug)));
    const image = container.querySelector("figure img")!;
    const optimized = new URL(image.getAttribute("src")!, "https://site.example.test");
    expect(optimized.pathname).toBe("/_next/image");
    expect(optimized.searchParams.get("url")).toBe(url);
    expect(screen.getByText("Stored external caption")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Stored external caption/ }));
    expect(within(screen.getByRole("dialog")).getByRole("img")).toHaveAttribute("src", url);
    expect(state.photos).toEqual(before);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    "https://images.example.test/existing-photo.jpg",
    "https://other-bucket.r2.dev/photo.jpg",
    "https://www.roomchang.com/photo.jpg",
    "https://roomchang.com.evil.test/photo.jpg",
    "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev.evil.test/photo.jpg",
    "http://roomchang.com/photo.jpg",
    "http://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/photo.jpg",
    "ftp://roomchang.com/photo.jpg",
    "https://user:password@roomchang.com/photo.jpg",
    "https://user@pub-2b835c19d8644293b271deaeb97352b1.r2.dev/photo.jpg",
    "https://roomchang.com@evil.test/photo.jpg",
    "https://roomchang.com:8443/photo.jpg",
    "https://roomchang.com./photo.jpg",
    "//roomchang.com/photo.jpg",
    "https%3A%2F%2Froomchang.com%2Fphoto.jpg",
    "%68ttps://roomchang.com/photo.jpg",
    "https://%72oomchang.com/photo.jpg",
    "https://roomchang%2ecom/photo.jpg",
    "https://roomchang.com%2fevil.test/photo.jpg",
    "https://roomchang.com%5c@evil.test/photo.jpg",
    "https://roomchang.com%00.evil.test/photo.jpg",
    "https://roomchang.com\\@evil.test/photo.jpg",
    "https://roomchang.com\n.evil.test/photo.jpg",
    "data:image/svg+xml,<svg/>",
    "javascript:alert(1)",
  ])("never renders or exposes a rejected external photo URL: %s", async (url) => {
    state.photos = freeze([url, { src: url }, { url }]);
    const before = structuredClone(state.photos);
    const { container } = show(await BranchPage(params(BRANCHES[0].slug)));
    expect(container.querySelectorAll("figure")).toHaveLength(0);
    expect(container.querySelectorAll("button")).toHaveLength(0);
    expect(container.innerHTML).not.toContain(url);
    expect(state.photos).toEqual(before);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each(["en", "kh", "cn"])("filters rejected hosts without losing allowed neighboring photos in %s", async (locale) => {
    const url = "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/stored-photo.jpg";
    state.photos = freeze([
      { src: "https://tracker.example.test/pixel.jpg", alt: "Rejected tracking photo" },
      { src: url, caption: "Stored allowed caption" },
      { src: "javascript:alert(1)", url: "/about/branch-main-exterior.jpg", alt: "Stored local fallback" },
    ]);
    const before = structuredClone(state.photos);
    const { container } = show(await BranchPage(params(BRANCHES[0].slug, locale)));
    expect(container.querySelectorAll("figure")).toHaveLength(2);
    expect(screen.getByRole("img", { name: "Stored allowed caption" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Stored local fallback" })).toBeVisible();
    expect(screen.queryByRole("img", { name: "Rejected tracking photo" })).not.toBeInTheDocument();
    expect(state.photos).toEqual(before);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([undefined, null, [], {}, "not an array", 42, [null, {}, ""]])("adds no gallery for empty/malformed photos: %j", async (photos) => {
    state.photos = photos;
    const { container } = show(await BranchPage(params(BRANCHES[0].slug)));
    expect(container.querySelectorAll("figure")).toHaveLength(0);
    expect(screen.getByRole("img", { name: BRANCHES[0].imageAlt })).toBeVisible();
    expect(container.querySelectorAll("iframe")).toHaveLength(1);
  });

  it("uses the existing accessible zoom behavior without rewriting the stored URL", async () => {
    const src = "/about/branch-interior-reception.jpg?original=1";
    state.photos = [{ src, alt: "Stored zoom alt", caption: "Stored zoom caption" }];
    show(await BranchPage(params(BRANCHES[0].slug)));
    const trigger = screen.getByRole("button", { name: /Stored zoom alt/ });
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Stored zoom alt" });
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", src);
    expect(within(dialog).getByText("Stored zoom caption")).toBeVisible();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

it("keeps non-Payload career, publication and branch rendering on the existing content paths", async () => {
  state.payload = false;
  const before = structuredClone({ positions: POSITIONS, branches: BRANCHES });
  show(await CareersPage(params()));
  expect(screen.getByRole("heading", { name: POSITIONS[0].title })).toBeVisible();
  expect(screen.queryByText("Stored employment type")).not.toBeInTheDocument();
  cleanup();
  show(await CareerDetailPage(params(POSITIONS[0].slug)));
  expect(screen.getByText(POSITIONS[0].requirements[0])).toBeVisible();
  cleanup();
  const publications = show(await PublicationsPage(params()));
  expect(publications.container.querySelectorAll("article").length).toBeGreaterThan(0);
  expect(screen.queryByText(/Stored abstract/)).not.toBeInTheDocument();
  cleanup();
  const branch = show(await BranchPage(params(BRANCHES[0].slug)));
  expect(branch.container.querySelectorAll("figure")).toHaveLength(0);
  expect(screen.getByRole("img", { name: BRANCHES[0].imageAlt })).toBeVisible();
  expect({ positions: POSITIONS, branches: BRANCHES }).toEqual(before);
  expect(fetch).not.toHaveBeenCalled();
});
