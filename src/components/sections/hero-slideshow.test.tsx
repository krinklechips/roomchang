import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { HeroSlideshow, type HeroSlide } from "./hero-slideshow";

const messages = {
  heroSlideshow: {
    ariaLabel: "Roomchang hero slideshow",
    showSlide: "Show slide {title}",
    previousAriaLabel: "Show previous slide",
    nextAriaLabel: "Show next slide",
    swipeHint: "Swipe to explore",
  },
};

function renderHero(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

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
    renderHero(<HeroSlideshow slides={slides} autoRotateMs={3000} />);

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
    renderHero(<HeroSlideshow slides={slides} flush />);

    expect(screen.getByRole("region", { name: /roomchang hero slideshow/i })).not.toHaveClass(
      "panel-card",
    );
  });

  it("renders the slide through next/image with a responsive object-position", () => {
    renderHero(<HeroSlideshow slides={slides} />);

    const image = screen.getByTestId("hero-foreground-image");
    expect(image.tagName).toBe("IMG");
    expect(image).toHaveAttribute("src");
    expect(image).toHaveStyle({ "--hero-image-position": "center bottom" });
  });

  it("shows the full panorama (object-contain) for preserveFullImage slides", () => {
    renderHero(<HeroSlideshow slides={slides} />);

    const image = screen.getByTestId("hero-foreground-image");
    // Preserve mode fits the whole image so its light margins blend into the
    // page — never cropped to cover.
    expect(image.className).toContain("object-contain");
    expect(image.className).not.toContain("sm:object-cover");
  });

  it("covers the frame for standard photo slides (contain on mobile to avoid hard crops)", () => {
    renderHero(
      <HeroSlideshow
        slides={[
          slides[0],
          {
            ...slides[1],
            mobileImagePosition: "center top",
          },
        ]}
      />,
    );

    act(() => {
      screen.getByRole("button", { name: /show next slide/i }).click();
    });

    const image = screen.getByTestId("hero-foreground-image");
    expect(image).toHaveStyle({ "--hero-mobile-image-position": "center top" });
    expect(image.className).toContain("object-contain");
    expect(image.className).toContain("sm:object-cover");
  });

  it("supports mobile-specific image positioning for preserved hero slides", () => {
    renderHero(
      <HeroSlideshow
        slides={[
          {
            ...slides[0],
            mobileImagePosition: "center 34%",
          },
          slides[1],
        ]}
      />,
    );

    expect(screen.getByTestId("hero-foreground-image")).toHaveStyle({
      "--hero-mobile-image-position": "center 34%",
    });
  });

  it("uses side chevrons for desktop navigation while keeping mobile swipe-first", () => {
    renderHero(<HeroSlideshow slides={slides} flush />);

    const previousButton = screen.getByRole("button", { name: /show previous slide/i });
    const nextButton = screen.getByRole("button", { name: /show next slide/i });

    expect(previousButton.className).toContain("hidden");
    expect(previousButton.className).toContain("sm:flex");
    expect(previousButton.className).toContain("left-4");
    expect(previousButton.querySelector("svg")).toBeTruthy();

    expect(nextButton.className).toContain("hidden");
    expect(nextButton.className).toContain("sm:flex");
    expect(nextButton.className).toContain("right-4");
    expect(nextButton.querySelector("svg")).toBeTruthy();
  });
});
