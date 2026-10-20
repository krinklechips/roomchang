import { describe, expect, it } from "vitest";
import { resolveSiteStat } from "./site-stats";

const fallback = { display_value: "37", label: "Bundled label" };

describe("resolveSiteStat", () => {
  it.each([null, "", " "])("uses the current number and suffix when display copy is %j", (display_value) => {
    expect(resolveSiteStat({ display_value, numeric_value: 42, suffix: "+", label: "CMS label" }, fallback)).toEqual({ display_value: "42+", label: "CMS label" });
  });
  it("preserves explicit localized display copy ahead of the numeric value", () => {
    expect(resolveSiteStat({ display_value: "Localized count", numeric_value: 42, suffix: "+", label: "CMS label" }, fallback)).toEqual({ display_value: "Localized count", label: "CMS label" });
  });
  it("formats zero and large numeric values without losing localized label fallbacks", () => {
    expect(resolveSiteStat({ numeric_value: 0, label: " " }, fallback)).toEqual({ display_value: "0", label: "Bundled label" });
    expect(resolveSiteStat({ numeric_value: 120000, suffix: "+" }, fallback).display_value).toBe("120,000+");
  });
  it.each([null, Number.NaN, Number.POSITIVE_INFINITY])("keeps the bundled value when the number is unusable (%j)", (numeric_value) => {
    expect(resolveSiteStat({ numeric_value }, fallback)).toEqual(fallback);
  });
});
