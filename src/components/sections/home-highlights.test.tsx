import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import en from "../../../messages/en.json";

// HomeHighlights is an async Server Component that pulls copy from the
// `homeHighlights` namespace via getTranslations(). Resolve keys against the
// real English messages so the test verifies the i18n wiring (keys exist and
// map to strings), not hardcoded literals.
vi.mock("next-intl/server", () => ({
  getTranslations: async (ns: string) => {
    const base = ns
      .split(".")
      .reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], en);
    return (key: string) =>
      (key
        .split(".")
        .reduce<unknown>(
          (o, k) => (o as Record<string, unknown>)?.[k],
          base,
        ) as string) ?? key;
  },
}));

import { HomeHighlights } from "./home-highlights";

describe("HomeHighlights", () => {
  it("renders shortcut links and featured cards from the homeHighlights namespace", async () => {
    render(await HomeHighlights());

    expect(screen.getByRole("link", { name: /treatment costs/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /testimonials/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /international patients/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /meet our team/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /clear aligner/i })).toBeInTheDocument();
    // Only the 5 shortcut tiles carry the "See more" action.
    expect(screen.getAllByRole("link", { name: /see more/i })).toHaveLength(5);
  });
});
