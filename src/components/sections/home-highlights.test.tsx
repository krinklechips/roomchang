import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeHighlights } from "./home-highlights";

describe("HomeHighlights", () => {
  it("renders shortcut links and featured cards with see more actions", () => {
    render(<HomeHighlights />);

    expect(screen.getByRole("link", { name: /treatment costs/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /testimonials/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /international patients/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /meet our team/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /clear aligner/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /see more/i })).toHaveLength(8);
  });
});
