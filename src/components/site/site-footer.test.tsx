import "@/test/english-intl-server";
import { screen } from "@testing-library/react";
import { render } from "@/test/render";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("uses responsive sizes for the footer logo image", async () => {
    render(await SiteFooter());

    const logo = screen.getByRole("img", { name: /roomchang dental hospital/i });

    expect(logo).toHaveAttribute("sizes", "120px");
  });

  it("links to Dentures before Dental Implants in the services links", async () => {
    render(await SiteFooter());

    const serviceLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/en/services/"));
    const labels = serviceLinks.map((link) => link.textContent);
    const denturesIndex = labels.indexOf("Dentures");
    const implantsIndex = labels.indexOf("Dental Implants");

    expect(serviceLinks[denturesIndex]).toHaveAttribute("href", "/en/services/dentures");
    expect(implantsIndex).toBe(denturesIndex + 1);
  });
});
