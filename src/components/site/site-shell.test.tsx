import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteShell } from "./site-shell";

describe("SiteShell", () => {
  it("renders the site header, content, and footer", () => {
    render(
      <SiteShell>
        <div>Roomchang content</div>
      </SiteShell>,
    );

    expect(
      screen.getByRole("banner", { name: /roomchang dental hospital/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Roomchang content")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
