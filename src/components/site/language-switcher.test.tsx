import { screen, within } from "@testing-library/react";
import { render, router } from "@/test/render";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LanguageSwitcher } from "./language-switcher";

describe("LanguageSwitcher", () => {
  it("uses a visible hoverable trigger style", () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole("button", { name: /change language/i }).className).toContain(
      "hover:border-[color:var(--brand)]",
    );
  });

  it("opens a native-label dropdown with Khmer unavailable during review", async () => {
    const user = userEvent.setup();

    render(<LanguageSwitcher />);

    expect(
      screen.getByRole("button", { name: /change language/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /change language/i }));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
    expect(screen.getByRole("menuitem", { name: "English" })).toHaveAttribute("aria-current", "true");
    const khmer = screen.getByRole("menuitem", { name: /ខ្មែរ/ });
    expect(khmer).toBeDisabled();
    expect(khmer).toHaveAttribute("aria-disabled", "true");
    expect(khmer).toHaveTextContent("Soon");
    expect(screen.getByRole("menuitem", { name: "中文" })).toBeEnabled();

    const menu = screen.getByRole("menu");

    expect(within(menu).queryAllByText(/^EN$/)).toHaveLength(0);
    expect(within(menu).queryAllByText(/^KH$/)).toHaveLength(0);
    expect(within(menu).queryAllByText(/^CN$/)).toHaveLength(0);
    expect(menu).not.toHaveTextContent(/🇬🇧|🇰🇭|🇨🇳/);
    await user.click(khmer);
    expect(router.replace).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.click(screen.getByRole("menuitem", { name: "中文" }));
    expect(router.replace).toHaveBeenCalledExactlyOnceWith("/cn");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
