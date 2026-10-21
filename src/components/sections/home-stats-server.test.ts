import { describe, expect, it } from "vitest";
import { getHomepageStats } from "./home-stats-data";

const explicitRows = (display_value: string, original_display_value?: string) => [
  { key: "years_experience", numeric_value: 30, suffix: " yrs", display_value: "30 yrs", label: "Years" },
  { key: "specialist_dentists", numeric_value: 37, suffix: "+", display_value, original_display_value, label: "Dentists" },
  { key: "branches_count", numeric_value: 5, suffix: "", display_value: "5", label: "Branches" },
  { key: "patients_treated", numeric_value: 100000, suffix: "+", display_value: "100,000+", label: "Patients" },
];

describe("getHomepageStats", () => {
  it.each([null, "", " "])("uses the numeric count when a tracked CMS display value is %j", (display_value) => {
    const rows = ["years_experience", "specialist_dentists", "branches_count", "patients_treated"].map((key) => ({
      key, numeric_value: 42, suffix: "+", label: "CMS label", display_value, original_display_value: "37",
    }));
    expect(getHomepageStats(rows)[1]).toEqual({ numeric_value: 42, suffix: "+", label: "CMS label" });
  });
  it("honors explicit text from older CMS responses without an import baseline", () => {
    expect(getHomepageStats([
      { key: "years_experience", numeric_value: 30, suffix: " yrs", display_value: "30 yrs", label: "Years" },
      { key: "specialist_dentists", numeric_value: 37, suffix: "+", display_value: "37", label: "Dentists" },
      { key: "branches_count", numeric_value: 5, suffix: "", label: "Branches" },
      { key: "patients_treated", numeric_value: 100000, suffix: "+", label: "Patients" },
    ])[1]).toEqual({ numeric_value: 37, suffix: "+", display_value: "37", label: "Dentists" });
  });
  it("honors imported display text even when it still matches its baseline", () => {
    expect(getHomepageStats([
      { key: "years_experience", numeric_value: 30, suffix: " yrs", display_value: "30 yrs", original_display_value: "30 yrs", label: "Years of Experience" },
      { key: "specialist_dentists", numeric_value: 37, suffix: "+", display_value: "37", original_display_value: "37", label: "Specialist Dentists" },
      { key: "branches_count", numeric_value: 5, suffix: "", display_value: "5", original_display_value: "5", label: "Phnom Penh Branches" },
      { key: "patients_treated", numeric_value: 100000, suffix: "+", display_value: "100,000+", original_display_value: "100,000+", label: "Patients Treated" },
    ])[1]).toEqual({ numeric_value: 37, suffix: "+", display_value: "37", label: "Specialist Dentists" });
  });
  it.each(["37", "37+", "0", "37 dentists", " 37 "])("does not compose a suffix onto explicit text %j", (display_value) => {
    expect(getHomepageStats(explicitRows(display_value, display_value))[1].display_value).toBe(display_value);
  });
  it("uses explicit text even when the shared numeric value is absent", () => {
    const rows = explicitRows("37", "37").map((row) => ({ ...row, numeric_value: null }));
    expect(getHomepageStats(rows).map((stat) => stat.display_value)).toEqual(["30 yrs", "37", "5", "100,000+"]);
  });
  it("uses explicit text even when the shared numeric value is not finite", () => {
    const rows = explicitRows("37", "37").map((row) => ({ ...row, numeric_value: Number.NaN }));
    expect(getHomepageStats(rows)[1].display_value).toBe("37");
    expect(getHomepageStats(rows)[1].numeric_value).toBe(0);
  });
  it("keeps authoritative text when another row has no usable text or number", () => {
    const rows = explicitRows("37", "37");
    rows[0] = { ...rows[0], numeric_value: Number.NaN, display_value: "" };
    const stats = getHomepageStats(rows, { years_experience: "Localized experience fallback" });
    expect(stats[0]).toEqual({ numeric_value: 30, suffix: " yrs", label: "Localized experience fallback" });
    expect(stats[1]).toEqual({ numeric_value: 37, suffix: "+", display_value: "37", label: "Dentists" });
  });
  it("keeps authoritative text when another homepage statistic is missing", () => {
    const stats = getHomepageStats(explicitRows("37", "37").filter((row) => row.key !== "years_experience"));
    expect(stats[0]).toEqual({ numeric_value: 30, suffix: " yrs", label: "Years of Experience" });
    expect(stats[1]).toEqual({ numeric_value: 37, suffix: "+", display_value: "37", label: "Dentists" });
  });
  it("keeps the existing whole-strip fallback for incomplete numeric-only responses", () => {
    expect(getHomepageStats([{ key: "specialist_dentists", numeric_value: 42, suffix: "+", label: "Numeric-only label" }])).toEqual([
      { numeric_value: 30, suffix: " yrs", label: "Years of Experience" },
      { numeric_value: 37, suffix: "+", label: "Specialist Dentists" },
      { numeric_value: 5, suffix: "", label: "Phnom Penh Branches" },
      { numeric_value: 100000, suffix: "+", label: "Patients Treated" },
    ]);
  });
  it("keeps each language's published values and pending drafts untouched while reading", () => {
    const locales = {
      en: { published: explicitRows("37", "37"), draft: explicitRows("38", "37") },
      kh: { published: explicitRows("\u17e3\u17e7", "\u17e3\u17e7"), draft: explicitRows("\u17e3\u17e8", "\u17e3\u17e7") },
      cn: { published: explicitRows("37 \u4f4d", "37 \u4f4d"), draft: explicitRows("38 \u4f4d", "37 \u4f4d") },
    };
    const before = structuredClone(locales);
    Object.values(locales).forEach(({ published, draft }) => {
      published.forEach(Object.freeze);
      draft.forEach(Object.freeze);
    });
    expect(getHomepageStats(locales.en.published)[1].display_value).toBe("37");
    expect(getHomepageStats(locales.kh.published)[1].display_value).toBe("\u17e3\u17e7");
    expect(getHomepageStats(locales.cn.published)[1].display_value).toBe("37 \u4f4d");
    expect(getHomepageStats(locales.cn.draft)[1].display_value).toBe("38 \u4f4d");
    expect(locales).toEqual(before);
  });
  it("preserves a localized CMS display value instead of discarding it", () => {
    const rows = [
      { key: "years_experience", numeric_value: 30, suffix: " yrs", display_value: "30 Khmer years", original_display_value: null, label: "Experience" },
      { key: "specialist_dentists", numeric_value: 37, suffix: "+", label: "Dentists" },
      { key: "branches_count", numeric_value: 5, suffix: "", label: "Branches" },
      { key: "patients_treated", numeric_value: 100000, suffix: "+", label: "Patients" },
    ];
    expect(getHomepageStats(rows)[0]).toEqual({ numeric_value: 30, suffix: " yrs", display_value: "30 Khmer years", label: "Experience" });
  });
  it("keeps facility and clinical metrics out of the homepage stats strip", () => {
    const stats = getHomepageStats([
      { key: "years_experience", numeric_value: 30, suffix: " yrs", label: "Years of Experience" },
      { key: "specialist_dentists", numeric_value: 37, suffix: "+", label: "Specialist Dentists" },
      { key: "branches_count", numeric_value: 5, suffix: "", label: "Phnom Penh Branches" },
      { key: "patients_treated", numeric_value: 100000, suffix: "+", label: "Patients Treated" },
      { key: "dental_chairs", numeric_value: 74, suffix: "", label: "Dental Chairs" },
      { key: "clinical_experience", numeric_value: 30, suffix: " yrs", label: "Clinical experience" },
    ]);

    expect(stats).toEqual([
      { numeric_value: 30, suffix: " yrs", label: "Years of Experience" },
      { numeric_value: 37, suffix: "+", label: "Specialist Dentists" },
      { numeric_value: 5, suffix: "", label: "Phnom Penh Branches" },
      { numeric_value: 100000, suffix: "+", label: "Patients Treated" },
    ]);
  });
});
