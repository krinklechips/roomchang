import { describe, expect, it } from "vitest";
import { matchesDoctorLanguage } from "./doctor-languages";

describe("doctor language comparison", () => {
  it("retains English case-insensitive matching and tolerates surrounding whitespace without mutating input", () => {
    const languages = Object.freeze([" english ", "ភាសាខ្មែរ", "普通话"]);
    expect(matchesDoctorLanguage(languages, "ENGLISH")).toBe(true);
    expect(matchesDoctorLanguage(languages, "Khmer")).toBe(true);
    expect(matchesDoctorLanguage(languages, "Mandarin")).toBe(true);
    expect(languages).toEqual([" english ", "ភាសាខ្មែរ", "普通话"]);
  });

  it("never guesses an identity from unknown, partial, or empty labels", () => {
    for (const label of ["", " ", "Unknown language", "English literature", "Thai", "Malay"]) {
      expect(matchesDoctorLanguage([label], "English")).toBe(false);
      expect(matchesDoctorLanguage([label], label)).toBe(false);
    }
    expect(matchesDoctorLanguage([], "English")).toBe(false);
    expect(matchesDoctorLanguage(["English"], "Unknown language")).toBe(false);
  });
});
