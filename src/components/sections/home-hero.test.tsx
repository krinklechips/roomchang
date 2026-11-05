import "@/test/english-intl-server";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@/test/render";
import { HomeHero } from "./home-hero";

// This component reads hero_slides, not the server client's SEO tables.
vi.mock("@/lib/supabase-server", () => ({ supabaseServer: {} }));

const heroFetch = vi.fn<typeof fetch>();

beforeEach(() => {
  heroFetch.mockReset();
  heroFetch.mockResolvedValue(new Response("[]", { headers: { "content-type": "application/json" } }));
  vi.stubGlobal("fetch", heroFetch);
});

afterEach(() => {
  expect(heroFetch).toHaveBeenCalledTimes(1);
  const [input] = heroFetch.mock.calls[0];
  const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
  expect(url.pathname).toBe("/rest/v1/hero_slides");
  expect(url.searchParams.get("published")).toBe("eq.true");
});

describe("HomeHero", () => {
  it("renders a minimal full-width hero with slideshow and centered actions", async () => {
    render(await HomeHero());

    const primaryAction = screen.getByRole("link", { name: /request an appointment/i });

    expect(
      screen.getByRole("region", { name: /roomchang hero slideshow/i }),
    ).toBeInTheDocument();
    expect(primaryAction).toBeInTheDocument();
    expect(primaryAction.className).toContain("justify-center");
    expect(primaryAction.className).toContain("whitespace-nowrap");
    expect(primaryAction).toHaveAttribute("href", "/en/contact#enquiry-form");
    expect(screen.getByRole("link", { name: /explore services/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: /a calmer, more modern front door for roomchang/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("keeps a single trust pill over the image without slideshow status badges", async () => {
    render(await HomeHero());

    expect(screen.getAllByText(/trusted since 1996/i)).toHaveLength(1);
    expect(screen.queryByText(/multilingual care/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/auto slideshow/i)).not.toBeInTheDocument();
  });

  it("overlays the trust pill on the image at every breakpoint", async () => {
    render(await HomeHero());

    const trustPillText = screen.getByText(/trusted since 1996/i);
    const trustPill = trustPillText.parentElement!;

    expect(trustPill.className).toContain("absolute");
    expect(trustPill.className).toContain("sm:top-7");
    expect(trustPill.className).toContain("top-3");
    expect(trustPillText.className).not.toContain("sm:text-white");
    expect(trustPillText.className).toContain("bg-white/96");
    expect(trustPillText.className).toContain("text-[color:var(--text-main)]");
  });

  it("keeps the hero CTA dock below the image until the xl overlay breakpoint", async () => {
    render(await HomeHero());

    const slideshow = screen.getByRole("region", { name: /roomchang hero slideshow/i });
    const shell = slideshow.parentElement!.parentElement!;
    const dockSurface = screen.getByRole("link", { name: /request an appointment/i }).parentElement!;
    const dock = dockSurface.parentElement!;

    expect(shell.className).toContain("overflow-hidden");
    expect(shell.className).not.toContain("rounded-2xl");
    expect(dock.className).toContain("relative");
    expect(dock.className).toContain("xl:absolute");
    expect(dock.className).not.toContain("mt-4");
    expect(dockSurface).not.toHaveClass("bg-white");
  });

  it("uses the team photo on a 16:9 stage that fills the viewport at xl", async () => {
    render(await HomeHero());

    const shell = screen.getByRole("region", { name: /roomchang hero slideshow/i });
    const heroSection = shell.parentElement!.parentElement!;
    const heroImage = screen.getByRole("img", { name: /roomchang dental hospital full team photo/i });
    const heroStage = screen.getByTestId("hero-stage");
    const foregroundImage = screen.getByTestId("hero-foreground-image");

    expect(heroSection.className).toContain("xl:min-h-[calc(100svh-7.25rem)]");
    expect(shell.className).toContain("xl:h-full");
    expect(shell.parentElement!.className).toContain("xl:absolute");
    expect(heroStage.className).toContain("aspect-[16/9]");
    expect(heroStage.className).toContain("xl:aspect-auto");
    expect(heroStage.className).toContain("xl:h-full");
    expect(heroStage.className).not.toContain("100svh");
    expect(decodeURIComponent(foregroundImage.getAttribute("src")!)).toContain("/hero/hero-team-photo.jpg");
    expect(foregroundImage.getAttribute("style")).toContain("--hero-mobile-image-position");
    expect(foregroundImage.getAttribute("style")).toContain("--hero-image-position");
    expect(heroImage).toHaveClass("object-contain", "sm:object-cover");
  });

  it("keeps all hero slides unzoomed on mobile", async () => {
    const user = userEvent.setup();
    render(await HomeHero());

    const stage = screen.getByTestId("hero-stage");

    expect(stage.className).not.toContain("aspect-[16/11]");
    expect(stage.className).toContain("aspect-[16/9]");
    for (const position of ["center center", "center center", "center top", "center center"]) {
      const foregroundImage = screen.getByTestId("hero-foreground-image");
      expect(foregroundImage).toHaveStyle({ "--hero-mobile-image-position": position });
      expect(foregroundImage).toHaveClass("object-contain", "sm:object-cover");
      await user.click(screen.getByRole("button", { name: /show next slide/i }));
    }
  });
});
