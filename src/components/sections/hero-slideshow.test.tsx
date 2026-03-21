import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroSlideshow, type HeroSlide } from "./hero-slideshow";

const slides: HeroSlide[] = [
  {
    id: "team",
    title: "Specialist Team",
    eyebrow: "Smiling dentists",
    description: "Warm clinicians and premium patient support.",
    imageSrc: "/hero/placeholder-team.svg",
    imageAlt: "Smiling dental team placeholder",
    imagePosition: "center bottom",
    imageSize: "contain",
    preserveFullImage: true,
  },
  {
    id: "care",
    title: "Patient Care",
    eyebrow: "Comfort-first",
    description: "A calm and reassuring treatment environment.",
    imageSrc: "/hero/placeholder-care.svg",
    imageAlt: "Dentist with patient placeholder",
  },
];

describe("HeroSlideshow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("auto-rotates slides and supports manual navigation", async () => {
    render(<HeroSlideshow slides={slides} autoRotateMs={3000} />);

    expect(screen.getByText("Specialist Team")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("Patient Care")).toBeInTheDocument();

    act(() => {
      screen.getByRole("button", { name: /show previous slide/i }).click();
    });

    expect(screen.getByText("Specialist Team")).toBeInTheDocument();
  });

  it("can render without the default framed card shell for full-bleed hero use", () => {
    render(<HeroSlideshow slides={slides} flush />);

    expect(screen.getByRole("region", { name: /roomchang hero slideshow/i })).not.toHaveClass(
      "panel-card",
    );
  });

  it("respects per-slide image fitting overrides", () => {
    render(<HeroSlideshow slides={slides} />);

    expect(screen.getByTestId("hero-foreground-image")).toHaveStyle({
      backgroundPosition: "center bottom",
      backgroundSize: "contain",
    });
  });

  it("can preserve a full image over a blurred background for wide hero photos", () => {
    render(<HeroSlideshow slides={slides} />);

    expect(screen.getByTestId("hero-foreground-image")).toHaveStyle({
      backgroundImage: 'url("/hero/placeholder-team.svg")',
      backgroundSize: "contain",
    });
  });
});
