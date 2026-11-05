import "@/test/english-intl-server";
import { screen } from "@testing-library/react";
import { renderServer } from "@/test/render";
import { describe, expect, it } from "vitest";
import { SiteShell } from "./site-shell";
import { SiteFooter } from "./site-footer";

describe("SiteShell", () => {
  it("renders the site header, content, and footer", async () => {
    await renderServer(
      <SiteShell>
        <div>Roomchang content</div>
      </SiteShell>,
      [SiteShell, SiteFooter],
    );

    expect(
      screen.getByRole("banner", { name: /roomchang dental hospital/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Roomchang content")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
