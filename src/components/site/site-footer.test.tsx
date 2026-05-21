import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("uses responsive sizes for the footer logo image", () => {
    render(<SiteFooter />);

    const logo = screen.getByRole("img", { name: /roomchang dental hospital/i });

    expect(logo).toHaveAttribute("sizes", "120px");
  });

  it("links to Dentures before Dental Implants in the services links", () => {
    render(<SiteFooter />);

    const serviceLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/services/"));
    const labels = serviceLinks.map((link) => link.textContent);
    const denturesIndex = labels.indexOf("Dentures");
    const implantsIndex = labels.indexOf("Dental Implants");

    expect(serviceLinks[denturesIndex]).toHaveAttribute("href", "/services/dentures");
    expect(implantsIndex).toBe(denturesIndex + 1);
  });
});
