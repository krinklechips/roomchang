import type { ComponentProps, ReactNode } from "react";
import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ServiceDetailContent } from "./ServiceDetailContent";
import { TechnologyDetailContent } from "./TechnologyDetailContent";
import ClinicalCaseDetailPage from "@/app/[locale]/clinical-results/[slug]/page";
import { getPayloadServiceBySlug, getPayloadTechnologyBySlug } from "@/lib/payload-source";
import { renderCmsContent } from "@/test/render-cms-content";

vi.mock("@/components/site/site-shell", () => ({ SiteShell: ({ children }: { children: ReactNode }) => <>{children}</> }));
vi.mock("@/i18n/navigation", () => ({ Link: ({ children, ...props }: ComponentProps<"a">) => <a {...props}>{children}</a> }));
vi.mock("@/lib/supabase-server", () => ({ supabaseServer: {} }));
vi.mock("next/headers", () => ({ draftMode: async () => ({ isEnabled: false }) }));
vi.mock("next-intl/server", async () => {
  const { createTranslator } = await import("next-intl");
  const { default: messages } = await import("../../../messages/en.json");
  return {
    getLocale: async () => "en",
    setRequestLocale: () => {},
    getTranslations: async (namespace?: string) => createTranslator({ locale: "en", messages: messages as import("next-intl").AbstractIntlMessages, namespace }),
  };
});

type Section = Record<string, unknown>;
type Format = "blocks" | "legacy";
type Renderer = "service" | "technology";
let collections: Record<string, Section[]>;

beforeEach(() => {
  collections = {};
  vi.stubEnv("CONTENT_SOURCE", "payload");
  vi.stubEnv("PAYLOAD_API_URL", "https://cms.test");
  vi.stubGlobal("IntersectionObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  vi.stubGlobal("fetch", vi.fn(async (input: string, init?: RequestInit) => {
    const url = new URL(input);
    if (url.origin !== "https://cms.test" || (init?.method ?? "GET") !== "GET") throw new Error(`Unexpected request: ${input}`);
    const name = url.pathname.split("/").at(-1)!;
    if (!(name in collections)) throw new Error(`Unexpected collection: ${name}`);
    return Response.json({ docs: collections[name], totalDocs: collections[name].length });
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

const photo = "/services/fixture.jpg";
const secondPhoto = "/services/second-fixture.jpg";
const clip = "/technology/fixture.mp4";

// These match the existing CMS LEAF_BLOCKS, not a renderer-generated list.
const leaves: { type: string; fields: Section; check: (container: HTMLElement) => void }[] = [
  { type: "text", fields: { heading: "Stored heading", body: "Stored paragraph one.\n\nStored paragraph two." }, check: () => {
    expect(screen.getByText("Stored paragraph two.")).toBeInTheDocument();
  } },
  { type: "callout", fields: { title: "Stored callout", body: "Stored callout body", stats: [{ value: "98%", label: "Stored outcome" }] }, check: () => {
    expect(screen.getByText("Stored callout body")).toBeInTheDocument();
    expect(screen.getByText("98%")).toBeInTheDocument();
    expect(screen.getByText("Stored outcome")).toBeInTheDocument();
  } },
  { type: "list", fields: { heading: "Stored list", items: ["Stored list item"] }, check: () => {
    expect(screen.getByText("Stored list item")).toBeInTheDocument();
  } },
  { type: "cards", fields: { heading: "Stored cards", numbered: true, items: [{ title: "Stored card", body: "Stored card body", badge: "Stored badge", spec: "Stored spec", tag: "Stored tag", link: "/services/related" }] }, check: () => {
    expect(screen.getByText("Stored card body")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Stored card" })).toHaveAttribute("href", "/services/related");
    for (const text of ["1", "Stored badge", "Stored spec", "Stored tag"]) expect(screen.getByText(text)).toBeInTheDocument();
  } },
  { type: "steps", fields: { heading: "Stored steps", items: [{ step: "Stored step", detail: "Stored step detail" }] }, check: () => {
    expect(screen.getByText("Stored step detail")).toBeInTheDocument();
  } },
  ...["pricing", "pricetable"].map((type) => ({ type, fields: { heading: "Stored prices", subheading: "Stored price note", rows: [{ treatment: "Stored treatment", price: "$123" }, { treatment: "Second treatment", price: "$456" }] }, check: () => {
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.getByRole("cell", { name: "Stored treatment" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "$123" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "$456" })).toBeInTheDocument();
    expect(screen.getByText("Stored price note")).toBeInTheDocument();
  } })),
  { type: "gallery", fields: { heading: "Stored gallery", subheading: "Stored gallery note", images: [photo, secondPhoto] }, check: () => {
    expect(screen.getByRole("button", { name: "View photo 1 of 2" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "View photo 2 of 2" }));
    expect(screen.getByRole("dialog").querySelector("img")).toHaveAttribute("src", secondPhoto);
  } },
  { type: "image", fields: { heading: "Stored image", subheading: "Stored image note", src: photo, alt: "Stored image alt", caption: "Stored caption", width: 900, height: 600, size: "large" }, check: () => {
    expect(screen.getByRole("img", { name: "Stored image alt" })).toHaveAttribute("width", "900");
    expect(screen.getByRole("heading", { name: "Stored image" })).toBeInTheDocument();
    expect(screen.getByText("Stored image note")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Enlarge.*Stored image alt/i }));
    expect(screen.getByRole("dialog").querySelector("img")).toHaveAttribute("src", photo);
  } },
  { type: "video", fields: { heading: "Stored video", subheading: "Stored video note", videoId: "FqxjxR7Rr6Y" }, check: () => {
    expect(screen.getByTitle("Stored video")).toHaveAttribute("src", "https://www.youtube.com/embed/FqxjxR7Rr6Y");
    expect(screen.getByText("Stored video note")).toBeInTheDocument();
  } },
  { type: "self_video", fields: { heading: "Stored hosted video", src: clip, caption: "Stored video caption" }, check: (container) => {
    expect(container.querySelector("video")).toHaveAttribute("src", clip);
    expect(container.querySelector("video")).toHaveAttribute("preload", "none");
    expect(screen.getByText("Stored video caption")).toBeInTheDocument();
  } },
  { type: "image_pair", fields: { left: { src: photo, alt: "Stored pair image", caption: "Stored left caption" }, right: { src: clip, alt: "Stored pair video", caption: "Stored right caption" } }, check: (container) => {
    expect(screen.getByRole("img", { name: "Stored pair image" })).toBeInTheDocument();
    expect(container.querySelector("video")).toHaveAttribute("src", clip);
    expect(screen.getByText("Stored left caption")).toBeInTheDocument();
    expect(screen.getByText("Stored right caption")).toBeInTheDocument();
  } },
];

function block(section: Section): Section {
  const { type, ...fields } = section;
  if (type === "twocol") {
    for (const side of ["left", "right"]) fields[side] = section[side] ? [block(section[side] as Section)] : [];
  }
  if (type === "list" && Array.isArray(fields.items)) fields.items = fields.items.map((item) => ({ item }));
  if (type === "gallery" && Array.isArray(fields.images)) fields.images = fields.images.map((url) => ({ url }));
  return { blockType: type, id: "row-id", ...fields };
}

async function renderSections(renderer: Renderer, sections: Section[], format: Format = "blocks") {
  const collection = renderer === "service" ? "services" : "technology";
  collections[collection] = [{
    id: 1, slug: "preventive-dentistry", name: "Fixture page", category: "Diagnostics", highlights: [],
    ...(format === "blocks" ? { sections: sections.map(block) } : { content: { sections } }),
  }];
  const before = structuredClone(collections[collection]);
  const result = renderer === "service"
    ? await renderCmsContent(<ServiceDetailContent service={(await getPayloadServiceBySlug("preventive-dentistry"))!} />)
    : await renderCmsContent(<TechnologyDetailContent tech={(await getPayloadTechnologyBySlug("preventive-dentistry"))!} />);
  expect(collections[collection]).toEqual(before);
  return result;
}

describe.each<Renderer>(["service", "technology"])("%s CMS block rendering", (renderer) => {
  // Existing shared SECTION_BLOCKS choices, including names mapped from Lucide to Phosphor.
  describe.each(["callout", "cards"])("%s icons", (type) => {
    it.each([
      "DollarSign", "Bone", "Sparkles", "Dumbbell", "Smile", "Clock", "CircleDot",
      "Heart", "Shield", "Star", "Zap", "Check", "Tooth", "Eye", "FirstAidKit",
      "RotateCcw", "ArrowRight",
    ])("renders the selected %s icon", async (icon) => {
      await renderSections(renderer, [{
        type, title: "Icon fixture", body: "Stored body", icon,
        heading: "Icon cards", items: [{ title: "Icon fixture", body: "Stored body", icon }],
      }]);
      const title = screen.getByText("Icon fixture");
      const iconContainer = type === "cards" ? title.parentElement! : title.parentElement!.parentElement!;
      const svg = iconContainer.querySelector("svg");
      expect(svg).not.toBeNull();
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg!.querySelector("path, circle, rect, line, polyline, polygon")).not.toBeNull();
    });

    it("keeps unknown icons absent without losing the block content", async () => {
      await renderSections(renderer, [{
        type, title: "Unknown icon fixture", body: "Stored body", icon: "FutureIcon",
        heading: "Icon cards", items: [{ title: "Unknown icon fixture", body: "Stored body", icon: "FutureIcon" }],
      }]);
      const title = screen.getByText("Unknown icon fixture");
      const iconContainer = type === "cards" ? title.parentElement! : title.parentElement!.parentElement!;
      expect(iconContainer.querySelector("svg")).toBeNull();
      expect(screen.getByText("Stored body")).toBeInTheDocument();
    });
  });

  describe.each<Format>(["blocks", "legacy"])("%s source", (format) => {
    it.each(leaves)("renders the persisted $type block and its fields", async ({ type, fields, check }) => {
      const { container } = await renderSections(renderer, [{ type, ...fields }], format);
      check(container);
    });
  });

  it.each(leaves)("renders $type on the right of a two-column block", async ({ type, fields, check }) => {
    const { container } = await renderSections(renderer, [{ type: "twocol", left: { type: "text", body: "Left content" }, right: { type, ...fields } }]);
    expect(screen.getByText("Left content")).toBeInTheDocument();
    check(container);
  });

  it.each(["left", "right"])("tolerates an empty mapped %s column", async (side) => {
    const section = { type: "twocol", left: { type: "text", body: "Remaining content" }, right: { type: "text", body: "Remaining content" }, [side]: null };
    const { container } = await renderSections(renderer, [section]);
    expect(screen.getByText("Remaining content")).toBeInTheDocument();
    expect(container.querySelector("h1")).toHaveTextContent("Fixture page");
    const mapped = renderer === "service" ? await getPayloadServiceBySlug("preventive-dentistry") : await getPayloadTechnologyBySlug("preventive-dentistry");
    expect(mapped?.content?.sections[0]).toHaveProperty(side, null);
  });

  it("tolerates recursive legacy columns with null, unknown and empty sides", async () => {
    await renderSections(renderer, [{ type: "twocol", left: null, right: { type: "twocol", left: { type: "future_block" }, right: { type: "text", body: "Nested content" } } }, { type: "twocol", left: null, right: null }], "legacy");
    expect(screen.getByText("Nested content")).toBeInTheDocument();
  });

  it.each(leaves.map(({ type }) => type))("handles omitted optional fields on %s", async (type) => {
    const { container } = await renderSections(renderer, [{ type }]);
    expect(container.querySelector("h1")).toHaveTextContent("Fixture page");
    expect(container.textContent).not.toContain("undefined");
    expect(container.textContent).not.toContain("null");
    expect(container.querySelectorAll("img, video, iframe")).toHaveLength(0);
  });

  it("skips empty media entries but preserves the remaining gallery and pair", async () => {
    const { container } = await renderSections(renderer, [
      { type: "gallery", images: [null, "", " ", photo] },
      { type: "image_pair", left: null, right: { src: secondPhoto, alt: "Remaining pair image" } },
      { type: "image", src: " " }, { type: "video", videoId: " " }, { type: "self_video", src: "" },
    ], "legacy");
    expect(screen.getByRole("button", { name: "View photo 1 of 1" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Remaining pair image" })).toBeInTheDocument();
    expect(container.querySelectorAll("img")).toHaveLength(2);
    expect(container.querySelectorAll("video, iframe")).toHaveLength(0);
  });
});

it.each([undefined, null, []])("keeps the legacy service PricingCTA when rows are %s", async (rows) => {
  await renderSections("service", [{ type: "pricing", heading: "Legacy pricing", rows }], "legacy");
  expect(screen.getByRole("heading", { name: "Legacy pricing" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /View Full Pricing/ })).toHaveAttribute("href", "/pricing#exams-cleaning");
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});

it("does not cap or clip long technology content in the right column", async () => {
  const body = Array.from({ length: 40 }, (_, i) => `Long paragraph ${i}.`).join("\n\n");
  await renderSections("technology", [{ type: "twocol", left: { type: "text", body: "Left content" }, right: { type: "text", body } }]);
  let ancestor = screen.getByText("Long paragraph 39.").parentElement;
  while (ancestor && ancestor !== document.body) {
    expect(Array.from(ancestor.classList).filter((name) => name.includes("max-h-") || name === "overflow-hidden")).toEqual([]);
    ancestor = ancestor.parentElement;
  }
});

describe("clinical case legacy images", () => {
  it.each([
    { name: "null entry", images: [null], count: 0 },
    { name: "mixed invalid entries", images: [null, 3, "old string", {}, { src: null }, { src: "" }, { src: " " }, { src: photo, caption: "Valid clinical image" }, { src: secondPhoto, caption: 42 }], count: 2 },
    { name: "missing array", images: null, count: 0 },
  ])("ignores $name without losing the case narrative", async ({ images, count }) => {
    collections["clinical-cases"] = [{ id: 8, slug: "clinical-fixture", title: "Clinical fixture", images, fullText: "Stored clinical notes" }];
    const before = structuredClone(collections["clinical-cases"]);
    const { container } = await renderCmsContent(<ClinicalCaseDetailPage params={Promise.resolve({ locale: "en", slug: "clinical-fixture" })} />);
    expect(screen.getByText("Stored clinical notes")).toBeInTheDocument();
    expect(container.querySelectorAll("img")).toHaveLength(count);
    if (count) {
      expect(screen.getByRole("img", { name: "Valid clinical image" })).toBeInTheDocument();
      expect(screen.queryByText("42")).not.toBeInTheDocument();
    }
    expect(collections["clinical-cases"]).toEqual(before);
  });
});
