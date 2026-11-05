import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const layoutSource = readFileSync(
  join(__dirname, "[locale]/layout.tsx"),
  "utf8",
);

describe("organization structured data", () => {
  it("advertises the verified clinical and customer-service languages", () => {
    expect(layoutSource).toContain(
      'availableLanguage: ["English", "Khmer", "Chinese", "Japanese", "French", "German"]',
    );
    expect(layoutSource).toContain(
      'availableLanguage: ["English", "Khmer", "Chinese", "Japanese"],',
    );
    expect(layoutSource).toContain(
      'a: "Our team serves patients in English, Khmer, Chinese, and Japanese. One of our dentists speaks French, and one speaks German.",',
    );
    expect(layoutSource).not.toContain('"Japanese", "Malay"');
  });
});
