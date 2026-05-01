import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeStats } from "./home-stats";

class MockIntersectionObserver {
  constructor(
    private callback: IntersectionObserverCallback,
  ) {}

  observe() {
    this.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }

  disconnect() { /* intentional no-op stub */ }
  unobserve() { /* intentional no-op stub */ }
  takeRecords() {
    return [];
  }
}

describe("HomeStats", () => {
  it("shows the updated trust metrics and keeps the last stat clean on mobile", () => {
    const originalObserver = globalThis.IntersectionObserver;
    const originalRaf = globalThis.requestAnimationFrame;
    const originalCancelRaf = globalThis.cancelAnimationFrame;

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(performance.now() + 5000);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});

    render(
      <HomeStats
        stats={[
          { numeric_value: 30, suffix: " yrs", label: "Years of Experience" },
          { numeric_value: 37, suffix: "+", label: "Specialist Dentists" },
          { numeric_value: 5, suffix: "", label: "Phnom Penh Branches" },
          { numeric_value: 100000, suffix: "+", label: "Patients Treated" },
        ]}
      />,
    );

    expect(screen.getByText(/30 yrs/i)).toBeInTheDocument();
    expect(screen.getByText(/years of experience/i)).toBeInTheDocument();
    expect(screen.getByText(/100,000\+/i)).toBeInTheDocument();
    expect(screen.getByText(/patients treated/i)).toBeInTheDocument();

    const patientsCard = screen.getByText(/patients treated/i).closest("div");
    expect(patientsCard?.className).toContain("bg-[color:var(--surface)]");

    globalThis.IntersectionObserver = originalObserver;
    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCancelRaf;
  });
});
