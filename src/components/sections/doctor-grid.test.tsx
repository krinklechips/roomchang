import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";
import type { Doctor } from "@/lib/data";
import { DoctorGrid } from "./doctor-grid";
import en from "../../../messages/en.json";
import km from "../../../messages/km.json";
import zh from "../../../messages/zh.json";

vi.mock("@/i18n/navigation", () => ({ Link: ({ children, ...props }: ComponentProps<"a">) => <a {...props}>{children}</a> }));
afterEach(cleanup);

// Exact labels observed in published doctors.languages arrays on 2026-10-22
// (locale=all, fallback-locale=none); not translations authored by this test.
const publishedLabels = [
  { key: "khmer", en: "Khmer", kh: "ភាសាខ្មែរ", cn: "高棉语" },
  { key: "english", en: "English", kh: "ភាសាអង់គ្លេស", cn: "英语" },
  { key: "mandarin", en: "Mandarin", kh: "ភាសាចិនកុកងឺ", cn: "普通话" },
  { key: "japanese", en: "Japanese", kh: "ភាសាជប៉ុន", cn: "日语" },
  { key: "german", en: "German", kh: "ភាសាអាល្លឺម៉ង់", cn: "德语" },
  { key: "french", en: "French", kh: "ភាសាបារាំង", cn: "法语" },
] as const;

const doctor = (id: string, languages: string[]): Doctor => ({
  id, name: `Fixture ${id}`, credentials: "", role: "", department: "GENERAL",
  specialty: [], languages, bio: null, note: null, initials: "", photoUrl: null,
  order: 0, published: true,
});

describe("unassigned doctor department fallback", () => {
  it.each(["", "   "])("keeps department %j in General before and after language filtering without changing data", (department) => {
    const unassigned = { ...doctor("unassigned", ["English"]), department };
    const general = doctor("general", ["Khmer"]);
    const specialist = { ...doctor("specialist", ["English"]), department: "ORTHODONTICS" };
    const doctors = [unassigned, general, specialist];
    const before = structuredClone(doctors);
    render(<NextIntlClientProvider locale="en" messages={en} timeZone="Asia/Phnom_Penh">
      <DoctorGrid doctors={doctors} />
    </NextIntlClientProvider>);

    const generalSection = () => screen.getByRole("heading", { name: en.doctorGrid.dept.general }).closest("section")!;
    expect(within(generalSection()).getAllByRole("button").map((button) => button.textContent)).toEqual([unassigned.name, general.name]);
    expect(within(screen.getByRole("heading", { name: en.doctorGrid.dept.orthodontics }).closest("section")!).getByRole("button", { name: specialist.name })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: en.doctorGrid.lang.english }));
    expect(screen.getByRole("button", { name: unassigned.name })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: general.name })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: en.doctorGrid.dept.general })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: en.doctorGrid.filterAll }));
    expect(within(generalSection()).getByRole("button", { name: unassigned.name })).toBeInTheDocument();
    expect(doctors).toEqual(before);
  });
});

describe.each([["en", en], ["kh", km], ["cn", zh]] as const)("%s doctor language filters", (locale, messages) => {
  it.each(publishedLabels)("matches published $key labels without altering the doctor's displayed languages", (labels) => {
    const matching = doctor("matching", [labels[locale]]);
    const other = doctor("other", [publishedLabels.find((row) => row.key !== labels.key)![locale]]);
    const snapshot = structuredClone([matching, other]);
    render(<NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Phnom_Penh">
      <DoctorGrid doctors={[matching, other]} />
    </NextIntlClientProvider>);

    const filterName = messages.doctorGrid.lang[labels.key];
    const filter = screen.getByRole("button", { name: filterName });
    fireEvent.click(filter);
    expect(screen.getByRole("button", { name: matching.name })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: other.name })).not.toBeInTheDocument();
    const result = messages.doctorGrid.filterResult.replace("{count}", "1").replace("{language}", filterName);
    expect(screen.getByText(result)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: matching.name }));
    const modal = screen.getByRole("dialog");
    expect(within(modal).getByText(labels[locale], { exact: true })).toBeInTheDocument();
    fireEvent.click(within(modal).getAllByRole("button", { name: messages.doctorGrid.modal.close })[0]);

    fireEvent.click(filter);
    expect(screen.getByRole("button", { name: other.name })).toBeInTheDocument();
    expect([matching, other]).toEqual(snapshot);
  });

  it("does not infer a known language from an unknown or empty label, and All restores the list", () => {
    render(<NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Phnom_Penh">
      <DoctorGrid doctors={[doctor("unknown", ["Unknown language"]), doctor("empty", [])]} />
    </NextIntlClientProvider>);
    fireEvent.click(screen.getByRole("button", { name: messages.doctorGrid.lang.english }));
    expect(screen.queryByRole("button", { name: "Fixture unknown" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Fixture empty" })).not.toBeInTheDocument();
    expect(screen.getByText(messages.doctorGrid.noResults.replace("{language}", messages.doctorGrid.lang.english))).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: messages.doctorGrid.filterAll }));
    expect(screen.getByRole("button", { name: "Fixture unknown" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fixture empty" })).toBeInTheDocument();
  });
});
