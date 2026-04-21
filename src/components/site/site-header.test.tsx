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

  it("links to Endodontics immediately after Oral Surgery in the services menu", () => {
    render(<SiteHeader />);

    const serviceLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/services/"));
    const labels = serviceLinks.map((link) => link.textContent);
    const oralSurgeryIndex = labels.indexOf("Oral Surgery");
    const endodonticsIndex = labels.indexOf("Endodontics");

    expect(serviceLinks[endodonticsIndex]).toHaveAttribute("href", "/services/endodontics");
    expect(endodonticsIndex).toBe(oralSurgeryIndex + 1);
  });
});
