import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  it("uses the full Roomchang logo image in the top left", () => {
    render(<SiteHeader />);

    const logo = screen.getByRole("img", { name: /roomchang dental hospital logo/i });

    expect(logo).toBeInTheDocument();
    expect(logo.className).toContain("object-contain");
    expect(logo).toHaveAttribute("sizes", "(max-width: 640px) 125px, (max-width: 1024px) 145px, 164px");
    expect(logo.className).not.toContain("object-[center_62%]");
  });
});
