import { describe, expect, it } from "vitest";
import { GET as getLlms } from "./llms.txt/route";
import { GET as getLlmsFull } from "./llms-full.txt/route";
import { BRANCHES } from "../lib/branches";

describe("AI knowledge routes", () => {
  it("does not claim that Roomchang serves patients in Malay", async () => {
    const [llms, full] = await Promise.all([
      getLlms().text(),
      getLlmsFull().text(),
    ]);

    for (const body of [llms, full]) {
      expect(body).not.toMatch(/Malay/i);
      expect(body).toContain("English, Khmer, Chinese, and Japanese");
      expect(body).toContain("French");
      expect(body).toContain("German");
    }
  });
  it("states every branch's hours and phone exactly as the branch pages do", async () => {
    const full = await getLlmsFull().text();
    for (const b of BRANCHES) expect(full).toContain(b.hours);
    // The Main Hospital line carries the landline + emergency number instead.
    for (const b of BRANCHES.filter((x) => x.slug !== "sisowath-high-school")) {
      expect(full).toContain(b.phone);
    }
  });
});
