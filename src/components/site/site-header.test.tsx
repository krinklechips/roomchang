import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  it("uses the full Roomchang logo image in the top left", () => {
    render(<SiteHeader />);

    const logo = screen.getByRole("img", { name: /roomchang dental hospital logo/i });

    expect(logo).toBeInTheDocument();
    expect(logo.className).toContain("object-contain");
    expect(logo).toHaveAttribute("sizes", "(max-width: 640px) 105px, (max-width: 1024px) 145px, 164px");
    expect(logo.className).not.toContain("object-[center_62%]");
  });

  it("links to Dentures between Periodontal Dentistry and Dental Implants in the services menu", () => {
    render(<SiteHeader />);

    const serviceLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/services/"));
    const labels = serviceLinks.map((link) => link.textContent);
    const periodonticsIndex = labels.indexOf("Periodontal Dentistry");
    const denturesIndex = labels.indexOf("Dentures");
    const implantsIndex = labels.indexOf("Dental Implants");

    expect(serviceLinks[denturesIndex]).toHaveAttribute("href", "/services/dentures");
    expect(denturesIndex).toBe(periodonticsIndex + 1);
    expect(implantsIndex).toBe(denturesIndex + 1);
  });
});
