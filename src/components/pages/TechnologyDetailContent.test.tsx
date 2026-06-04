import { describe, expect, it } from "vitest";
import { getStepGridClass } from "./technology-step-grid";

describe("TechnologyDetailContent", () => {
  it("uses three desktop columns for five-step sections", () => {
    expect(getStepGridClass(5)).toBe("sm:grid-cols-2 lg:grid-cols-3");
  });

  it("keeps four desktop columns for four-step sections", () => {
    expect(getStepGridClass(4)).toBe("sm:grid-cols-2 lg:grid-cols-4");
  });
});
