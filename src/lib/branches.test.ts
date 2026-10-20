import { describe, expect, it } from "vitest";
import { BRANCHES, matchStaticBranch } from "./branches";

describe("branch identity precedence", () => {
  it("lets the source UUID win over conflicting canonical slugs and names", () => {
    expect(matchStaticBranch({ id: "74b77631-3bd3-4bf4-bc0d-400bc4dab254", slug: "rose-condo", name: "AEON Mall Sen Sok" })).toBe(BRANCHES[4]);
  });
  it("uses an explicit canonical slug despite conflicting names and map links", () => {
    expect(matchStaticBranch({ id: "fresh-row", slug: "rose-condo", name: "AEON Mall Sen Sok", map_place_url: BRANCHES[2].mapPlaceUrl })).toBe(BRANCHES[1]);
  });
  it("never relocates an unknown explicit slug through a name or map alias", () => {
    expect(matchStaticBranch({ slug: "new-location", name: "AEON Mall Sen Sok", map_place_url: BRANCHES[2].mapPlaceUrl })).toBeUndefined();
  });
  it("never relocates an unknown explicit ID through a name alias", () => {
    expect(matchStaticBranch({ id: "fresh-row", name: "AEON Mall Sen Sok" })).toBeUndefined();
  });
  it("retains name aliases only when no explicit identity is present", () => {
    expect(matchStaticBranch({ name: "Roomchang Dental Clinic - Aeon Mall Sen Sok City Branch" })).toBe(BRANCHES[2]);
  });
});
