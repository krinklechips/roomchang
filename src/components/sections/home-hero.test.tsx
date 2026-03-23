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

    expect(screen.getAllByText(/since 1996 • phnom penh/i)).toHaveLength(1);
    expect(screen.queryByText(/multilingual care/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/auto slideshow/i)).not.toBeInTheDocument();
  });

  it("keeps the hero CTA dock lifted above the bottom edge", () => {
    render(<HomeHero />);

    expect(screen.getByTestId("hero-cta-dock").className).toContain("bottom-8");
  });

  it("uses the team image as the fixed hero stage reference", () => {
    render(<HomeHero />);

    const heroImage = screen.getByRole("img", { name: /roomchang dental hospital team portrait/i });
    const heroStage = screen.getByTestId("hero-stage");
    const foregroundImage = screen.getByTestId("hero-foreground-image");

    expect(heroStage.className).toContain("lg:aspect-[2325/950]");
    expect(heroStage.className).not.toContain("100svh");
    expect(foregroundImage.getAttribute("style")).toContain("/hero/roomchang-team-hero.jpg");
    expect(foregroundImage.getAttribute("style")).toContain("--hero-mobile-image-position");
    expect(foregroundImage.getAttribute("style")).toContain("--hero-mobile-image-size");
    expect(heroImage).toHaveStyle({ backgroundSize: "cover" });
  });
});
