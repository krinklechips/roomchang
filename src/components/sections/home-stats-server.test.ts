import { describe, expect, it } from "vitest";
import { getHomepageStats } from "./home-stats-data";

describe("getHomepageStats", () => {
  it.each([null, "", " "])("uses the numeric count when a tracked CMS display value is %j", (display_value) => {
    const rows = ["years_experience", "specialist_dentists", "branches_count", "patients_treated"].map((key) => ({
      key, numeric_value: 42, suffix: "+", label: "CMS label", display_value, original_display_value: "37",
    }));
    expect(getHomepageStats(rows)[1]).toEqual({ numeric_value: 42, suffix: "+", label: "CMS label" });
  });
  it("keeps old CMS responses stable during a rolling CMS deployment", () => {
    expect(getHomepageStats([
      { key: "years_experience", numeric_value: 30, suffix: " yrs", display_value: "30 yrs", label: "Years" },
      { key: "specialist_dentists", numeric_value: 37, suffix: "+", display_value: "37", label: "Dentists" },
      { key: "branches_count", numeric_value: 5, suffix: "", label: "Branches" },
      { key: "patients_treated", numeric_value: 100000, suffix: "+", label: "Patients" },
    ])[1]).toEqual({ numeric_value: 37, suffix: "+", label: "Dentists" });
  });
  it("keeps pre-migration count formatting until the locale display value is edited", () => {
    expect(getHomepageStats([
      { key: "years_experience", numeric_value: 30, suffix: " yrs", display_value: "30 yrs", original_display_value: "30 yrs", label: "Years of Experience" },
      { key: "specialist_dentists", numeric_value: 37, suffix: "+", display_value: "37", original_display_value: "37", label: "Specialist Dentists" },
      { key: "branches_count", numeric_value: 5, suffix: "", display_value: "5", original_display_value: "5", label: "Phnom Penh Branches" },
      { key: "patients_treated", numeric_value: 100000, suffix: "+", display_value: "100,000+", original_display_value: "100,000+", label: "Patients Treated" },
    ])[1]).toEqual({ numeric_value: 37, suffix: "+", label: "Specialist Dentists" });
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
