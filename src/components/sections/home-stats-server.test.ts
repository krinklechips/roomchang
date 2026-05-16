import { describe, expect, it } from "vitest";
import { getHomepageStats } from "./home-stats-data";

describe("getHomepageStats", () => {
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
