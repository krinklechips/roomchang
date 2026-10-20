import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";
import { ClinicalResultsGrid } from "./clinical-results-grid";
import type { ClinicalCase } from "@/lib/data";
import en from "../../../messages/en.json";
import km from "../../../messages/km.json";
import zh from "../../../messages/zh.json";

vi.mock("@/i18n/navigation", () => ({ Link: ({ children, ...props }: ComponentProps<"a">) => <a {...props}>{children}</a> }));

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: vi.fn() });
});
afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
  Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");
});

it.each([["en", en], ["kh", km], ["cn", zh]] as const)("keeps %s gallery click and hash navigation on canonical case IDs", (locale, messages) => {
  const cases = [
    { id: "a", slug: "a", title: "Selected case", category: "Localized full mouth", categoryKey: "full-mouth-reconstruction", tag: "", treatment: "", duration: "", cardImage: null, images: [], order: 0, published: true, description: null, fullText: null },
    { id: "b", slug: "b", title: "Other case", category: "Localized orthodontics", categoryKey: "orthodontics", tag: "", treatment: "", duration: "", cardImage: null, images: [], order: 1, published: true, description: null, fullText: null },
  ] satisfies ClinicalCase[];
  render(<NextIntlClientProvider locale={locale} messages={messages}><ClinicalResultsGrid cases={cases} /></NextIntlClientProvider>);
  fireEvent.click(screen.getByRole("button", { name: messages.clinicalResultsGrid.cat.fullMouth }));
  expect(screen.getByRole("link", { name: /Selected case/ })).toHaveAttribute("href", "/clinical-results/a");
  expect(screen.queryByRole("link", { name: /Other case/ })).not.toBeInTheDocument();

  act(() => {
    window.history.replaceState(null, "", "/#orthodontics");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
  expect(screen.getByRole("link", { name: /Other case/ })).toHaveAttribute("href", "/clinical-results/b");
  expect(screen.queryByRole("link", { name: /Selected case/ })).not.toBeInTheDocument();

  act(() => {
    window.history.replaceState(null, "", "/#full-mouth");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
  expect(screen.getByRole("link", { name: /Selected case/ })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /Other case/ })).not.toBeInTheDocument();
});
