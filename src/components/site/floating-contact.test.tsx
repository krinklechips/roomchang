import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FloatingContact } from "./floating-contact";

describe("FloatingContact", () => {
  it("preserves the aspect ratio of the Roomchang contact mark image", () => {
    render(<FloatingContact />);

    const mark = screen.getByRole("img", { name: /contact roomchang/i });

    expect(mark).toHaveStyle({ width: "auto", height: "auto" });
  });
});
