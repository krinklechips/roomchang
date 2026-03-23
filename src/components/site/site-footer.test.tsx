import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("uses responsive sizes for the footer logo image", () => {
    render(<SiteFooter />);

    const logo = screen.getByRole("img", { name: /roomchang dental hospital/i });

    expect(logo).toHaveAttribute("sizes", "120px");
  });
});
