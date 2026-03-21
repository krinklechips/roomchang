import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LanguageSwitcher } from "./language-switcher";

describe("LanguageSwitcher", () => {
  it("uses a visible hoverable trigger style", () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole("button", { name: /change language/i }).className).toContain(
      "hover:border-[--brand]",
    );
  });

  it("opens a dropdown with flag-based language options", async () => {
    const user = userEvent.setup();

    render(<LanguageSwitcher />);

    expect(
      screen.getByRole("button", { name: /change language/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /change language/i }));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /english/i })).toHaveTextContent(
      "🇬🇧",
    );
    expect(screen.getByRole("menuitem", { name: /khmer/i })).toHaveTextContent(
      "🇰🇭",
    );
    expect(screen.getByRole("menuitem", { name: /中文/i })).toHaveTextContent("🇨🇳");

    const menu = screen.getByRole("menu");

    expect(within(menu).queryAllByText(/^EN$/)).toHaveLength(0);
    expect(within(menu).queryAllByText(/^KH$/)).toHaveLength(0);
  });
});
