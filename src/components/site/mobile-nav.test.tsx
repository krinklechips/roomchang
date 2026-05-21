import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MobileNav } from "./mobile-nav";

describe("MobileNav", () => {
  it("links to Dentures between Periodontal Dentistry and Dental Implants in the services submenu", async () => {
    const user = userEvent.setup();
    render(<MobileNav />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    await user.click(screen.getByRole("button", { name: /toggle services submenu/i }));

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
