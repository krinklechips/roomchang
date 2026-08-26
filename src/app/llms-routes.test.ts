import { describe, expect, it } from "vitest";
import { GET as getLlms } from "./llms.txt/route";
import { GET as getLlmsFull } from "./llms-full.txt/route";

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
});
