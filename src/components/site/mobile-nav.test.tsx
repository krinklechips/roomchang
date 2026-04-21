import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MobileNav } from "./mobile-nav";

describe("MobileNav", () => {
  it("links to Endodontics immediately after Oral Surgery in the services submenu", async () => {
    const user = userEvent.setup();
    render(<MobileNav />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    await user.click(screen.getByRole("button", { name: /toggle services submenu/i }));

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
