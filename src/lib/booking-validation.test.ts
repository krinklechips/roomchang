import { describe, expect, it } from "vitest";
import {
  bookableWindow,
  isBookableDate,
  isBookableTime,
  isSunday,
  isValidDate,
  normalizeTime,
  sanitizeBranch,
  sanitizeDoctor,
} from "./booking-validation";

// Fixed reference "today" so the date tests are deterministic (not tied to the
// wall clock). 2026-07-10 is a Friday.
const TODAY = "2026-07-10";

// Ground-truth resident dentists for the doctor tests (visiting consultants,
// department SENIOR_CONSULTANT, are intentionally NOT in this list).
const RESIDENTS = ["Dr. Tithphit Aliza", "Dr. Meng Sally", "Dr. Sok Piseth"];
const VISITING = ["Prof. Dr. Georg-Hubertus Nentwig", "Dr. Yue Weng Cheu"];

describe("isValidDate", () => {
  it("accepts a real calendar date", () => {
    expect(isValidDate("2026-09-14")).toBe(true);
  });
  it("rejects malformed or impossible dates", () => {
    expect(isValidDate("2026-13-01")).toBe(false); // month 13
    expect(isValidDate("2026-02-30")).toBe(false); // rolls over
    expect(isValidDate("14-09-2026")).toBe(false); // wrong format
    expect(isValidDate("next week")).toBe(false);
  });
});

describe("isBookableDate — the guard the 2023 bug slipped past", () => {
  it("REJECTS the exact bug date (2023-10-18)", () => {
    expect(isBookableDate("2023-10-18", TODAY)).toBe(false);
  });
  it("rejects today (bookings must be tomorrow onward)", () => {
    expect(isBookableDate(TODAY, TODAY)).toBe(false);
  });
  it("accepts tomorrow", () => {
    expect(isBookableDate(bookableWindow(TODAY).min, TODAY)).toBe(true);
  });
  it("accepts a date ~1 year out but rejects beyond it", () => {
    const { max } = bookableWindow(TODAY);
    expect(isBookableDate(max, TODAY)).toBe(true);
    expect(isBookableDate("2028-01-01", TODAY)).toBe(false);
  });
  it("rejects any past date regardless of format validity", () => {
    expect(isBookableDate("2025-01-01", TODAY)).toBe(false);
  });
});

describe("isSunday", () => {
  it("flags Sundays (clinic closed)", () => {
    expect(isSunday("2026-07-12")).toBe(true); // Sunday
    expect(isSunday("2026-07-13")).toBe(false); // Monday
  });
});

describe("time slots", () => {
  it("normalizes HH:MM(:SS)", () => {
    expect(normalizeTime("10:00")).toBe("10:00");
    expect(normalizeTime("10:00:00")).toBe("10:00");
    expect(normalizeTime("nonsense")).toBe("");
  });
  it("accepts real slots and rejects off-schedule times", () => {
    expect(isBookableTime("10:00")).toBe(true);
    expect(isBookableTime("17:30")).toBe(false); // clinic stops at 17:00
    expect(isBookableTime("03:00")).toBe(false);
  });
});

describe("sanitizeBranch — drop invented branches, canonicalize real ones", () => {
  it("maps short/partial names to the canonical branch", () => {
    expect(sanitizeBranch("Sisowath High School")).toBe("Main Hospital — Sisowath High School");
    expect(sanitizeBranch("AEON Mall")).toBe("AEON Mall Sen Sok");
    expect(sanitizeBranch("Rose Condo")).toBe("Rose Condo — Bassac Garden City");
  });
  it("drops an unknown/hallucinated branch", () => {
    expect(sanitizeBranch("Hogwarts Clinic")).toBe("");
    expect(sanitizeBranch("")).toBe("");
  });
});

describe("sanitizeDoctor — never record a visiting consultant", () => {
  it("keeps a real resident dentist (incl. partial name)", () => {
    expect(sanitizeDoctor("Dr. Meng Sally", RESIDENTS)).toBe("Dr. Meng Sally");
    expect(sanitizeDoctor("Dr. Aliza", RESIDENTS)).toBe("Dr. Tithphit Aliza");
  });
  it("DROPS visiting consultants (the explicit 'never book' rule)", () => {
    for (const v of VISITING) {
      expect(sanitizeDoctor(v, RESIDENTS)).toBe("");
    }
  });
  it("drops an unknown/invented doctor", () => {
    expect(sanitizeDoctor("Dr. Imaginary Person", RESIDENTS)).toBe("");
    expect(sanitizeDoctor("", RESIDENTS)).toBe("");
  });
});

// ── Regression eval: representative & adversarial model outputs run through the
// guard pipeline. Every real-world failure should be added here as a new case so
// the bot can never regress on a problem we've already seen. ──
describe("guardrail regression eval (model-output scenarios)", () => {
  type Scenario = {
    name: string;
    date: string;
    time: string;
    branch: string;
    doctor: string;
    expect: { dateOk: boolean; timeOk: boolean; branchOut: string; doctorOut: string };
  };

  const scenarios: Scenario[] = [
    {
      name: "the real Nakhin bug — hallucinated 2023 date",
      date: "2023-10-18", time: "10:00", branch: "Sisowath High School", doctor: "Dr. Meng Sally",
      expect: { dateOk: false, timeOk: true, branchOut: "Main Hospital — Sisowath High School", doctorOut: "Dr. Meng Sally" },
    },
    {
      name: "valid future booking with partial names",
      date: "2026-09-14", time: "10:00", branch: "AEON Mall", doctor: "Dr. Aliza",
      expect: { dateOk: true, timeOk: true, branchOut: "AEON Mall Sen Sok", doctorOut: "Dr. Tithphit Aliza" },
    },
    {
      name: "model tries to book a visiting consultant + invented branch",
      date: "2026-08-03", time: "14:00", branch: "Downtown Clinic", doctor: "Prof. Dr. Georg-Hubertus Nentwig",
      expect: { dateOk: true, timeOk: true, branchOut: "", doctorOut: "" },
    },
    {
      name: "today + off-schedule time both rejected",
      date: TODAY, time: "17:30", branch: "", doctor: "",
      expect: { dateOk: false, timeOk: false, branchOut: "", doctorOut: "" },
    },
  ];

  it.each(scenarios)("$name", (s) => {
    expect(isBookableDate(s.date, TODAY)).toBe(s.expect.dateOk);
    expect(isBookableTime(s.time)).toBe(s.expect.timeOk);
    expect(sanitizeBranch(s.branch)).toBe(s.expect.branchOut);
    expect(sanitizeDoctor(s.doctor, RESIDENTS)).toBe(s.expect.doctorOut);
  });
});
