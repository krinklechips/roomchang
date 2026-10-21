import "@/test/english-intl-server";
import { act, screen } from "@testing-library/react";
import { render } from "@/test/render";
import { describe, expect, it, vi } from "vitest";
import { HomeHero } from "./home-hero";

vi.mock("@/lib/data", () => ({ getHeroSlides: vi.fn(async () => []) }));
vi.mock("@/lib/payload-source", () => ({
  isPayloadSource: () => false,
  getPayloadHomepageSettings: vi.fn(async () => null),
}));

describe("HomeHero", () => {
  it("renders a minimal full-width hero with slideshow and centered booking actions", async () => {
    render(await HomeHero());

    const primaryAction = screen.getByRole("link", { name: /request an appointment/i });

    expect(
      screen.getByRole("region", { name: /roomchang hero slideshow/i }),
    ).toBeInTheDocument();
    expect(primaryAction).toBeInTheDocument();
    expect(primaryAction.className).toContain("justify-center");
    expect(primaryAction).toHaveAttribute("href", "/en/contact#enquiry-form");
    expect(screen.getByRole("link", { name: /explore services/i })).toHaveAttribute("href", "/en/services");
    expect(screen.getByRole("link", { name: /our doctors/i })).toHaveAttribute("href", "/en/team");
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

  it("keeps the trust pill legible and overlaid on the image at every breakpoint", async () => {
    render(await HomeHero());

    const trustPillText = screen.getByText(/trusted since 1996/i);
    const trustPill = trustPillText.parentElement;

    expect(trustPill).toHaveClass("absolute", "top-3", "sm:top-7", "z-20");
    expect(trustPillText.className).not.toContain("sm:text-white");
    expect(trustPillText).toHaveClass("bg-white/96");
    expect(trustPillText.className).toContain("text-[color:var(--text-main)]");
  });

  it("keeps the hero CTA dock below the image until the desktop full-bleed breakpoint", async () => {
    render(await HomeHero());

    const primaryAction = screen.getByRole("link", { name: /request an appointment/i });
    const dockSurface = primaryAction.parentElement;
    const dock = dockSurface?.parentElement;
    const heroSection = screen.getByRole("region", { name: /roomchang hero slideshow/i }).parentElement?.parentElement;

    expect(heroSection).toHaveClass("overflow-hidden");
    expect(dock).toHaveClass("relative", "pt-2", "xl:absolute", "xl:bottom-10");
    expect(dock).not.toHaveClass("sm:absolute", "lg:absolute");
    expect(dockSurface).toHaveClass("flex-col", "xl:flex-row");
    expect(dockSurface).not.toHaveClass("bg-white");
  });

  it("uses the team image in a 16:9 stage that fills the desktop hero", async () => {
    render(await HomeHero());

    const slideshow = screen.getByRole("region", { name: /roomchang hero slideshow/i });
    const heroSection = slideshow.parentElement?.parentElement;
    const heroImage = screen.getByRole("img", { name: /roomchang dental hospital full team photo/i });
    const heroStage = screen.getByTestId("hero-stage");
    const foregroundImage = screen.getByTestId("hero-foreground-image");

    expect(heroSection).toHaveClass("xl:min-h-[calc(100svh-7.25rem)]");
    expect(slideshow.parentElement).toHaveClass("relative", "xl:absolute", "xl:inset-0");
    expect(slideshow).toHaveClass("xl:h-full");
    expect(heroStage).toHaveClass("aspect-[16/9]", "xl:aspect-auto", "xl:h-full");
    expect(heroStage.className).not.toContain("100svh");
    expect(heroImage).toBe(foregroundImage);
    expect(heroImage).toHaveAttribute("src", expect.stringContaining("hero-team-photo.jpg"));
    expect(heroImage).toHaveAttribute("sizes", "100vw");
    expect(heroImage).toHaveClass("object-contain", "sm:object-cover");
    expect(heroImage).toHaveStyle({ "--hero-mobile-image-position": "center center" });
  });

  it("keeps all fallback hero slides unzoomed on mobile", async () => {
    render(await HomeHero());

    const stage = screen.getByTestId("hero-stage");

    expect(stage.className).not.toContain("aspect-[16/11]");
    expect(stage).toHaveClass("aspect-[16/9]");
    for (const filename of ["hero-team-photo.jpg", "hero-patient-care.jpeg", "hero-all-staff.jpg", "roomchang-digital-lab.jpeg"]) {
      const image = screen.getByTestId("hero-foreground-image");
      expect(image).toHaveAttribute("src", expect.stringContaining(filename));
      expect(image).toHaveClass("object-contain");
      expect(image).not.toHaveClass("scale-105", "scale-110");
      act(() => screen.getByRole("button", { name: /show next slide/i }).click());
    }
  });
});
