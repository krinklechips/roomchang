import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeHero } from "./home-hero";

describe("HomeHero", () => {
  it("renders a minimal full-width hero with slideshow and centered actions", () => {
    render(<HomeHero />);

    const primaryAction = screen.getByRole("link", { name: /request an appointment/i });

    expect(
      screen.getByRole("region", { name: /roomchang hero slideshow/i }),
    ).toBeInTheDocument();
    expect(primaryAction).toBeInTheDocument();
    expect(primaryAction.className).toContain("justify-center");
    expect(primaryAction.className).toContain("text-center");
    expect(screen.getByRole("link", { name: /explore services/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: /a calmer, more modern front door for roomchang/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("keeps a single trust pill over the image without slideshow status badges", () => {
    render(<HomeHero />);

    expect(screen.getAllByText(/trusted since 1996/i)).toHaveLength(1);
    expect(screen.queryByText(/multilingual care/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/auto slideshow/i)).not.toBeInTheDocument();
  });

  it("shows the trust pill above the image on mobile and over the image on larger screens", () => {
    render(<HomeHero />);

    const trustPill = screen.getByTestId("hero-trust-pill");

    expect(trustPill.className).toContain("relative");
    expect(trustPill.className).toContain("sm:absolute");
    expect(trustPill.className).toContain("mb-3");
  });

  it("keeps the hero CTA dock below the image on mobile and floating on larger screens", () => {
    render(<HomeHero />);

    const shell = screen.getByTestId("hero-mobile-shell");
    const dock = screen.getByTestId("hero-cta-dock");
    const dockSurface = screen.getByTestId("hero-cta-surface");

    expect(shell.className).toContain("overflow-hidden");
    expect(shell.className).toContain("rounded-[1.75rem]");
    expect(dock.className).toContain("mt-0");
    expect(dock.className).toContain("sm:absolute");
    expect(dock.className).not.toContain("mt-4");
    expect(dockSurface).not.toHaveClass("bg-white");
  });

  it("uses the team image as the fixed hero stage reference", () => {
    render(<HomeHero />);

    const heroImage = screen.getByRole("img", { name: /roomchang dental hospital team portrait/i });
    const heroStage = screen.getByTestId("hero-stage");
    const foregroundImage = screen.getByTestId("hero-foreground-image");

    expect(heroStage.className).toContain("aspect-[2325/950]");
    expect(heroStage.className).not.toContain("100svh");
    expect(foregroundImage.getAttribute("style")).toContain("/hero/roomchang-team-hero.jpg");
    expect(foregroundImage.getAttribute("style")).toContain("--hero-mobile-image-position");
    expect(foregroundImage.getAttribute("style")).toContain("--hero-mobile-image-size");
    expect(heroImage).toHaveStyle({ backgroundSize: "cover" });
  });

  it("keeps all hero slides unzoomed on mobile", () => {
    render(<HomeHero />);

    const stage = screen.getByTestId("hero-stage");
    const foregroundImage = screen.getByTestId("hero-foreground-image");

    expect(stage.className).not.toContain("aspect-[16/11]");
    expect(stage.className).toContain("aspect-[2325/950]");
    expect(foregroundImage.getAttribute("style")).toContain("--hero-mobile-image-position: center top");
    expect(foregroundImage.getAttribute("style")).toContain("--hero-mobile-image-size: 100% auto");
  });
});
