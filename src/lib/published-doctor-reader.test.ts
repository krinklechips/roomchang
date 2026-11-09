import { afterEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ preview: false }));
vi.mock("next-intl/server", () => ({ getLocale: async () => "kh" }));
vi.mock("next/headers", () => ({ draftMode: async () => ({ isEnabled: state.preview }) }));
import { getPublishedPayloadDoctorNames } from "./payload-source";
afterEach(() => { vi.unstubAllEnvs(); });

describe("published-only appointment directory", () => {
  it.each([false, true])("ignores draft mode %j and never sends preview credentials", async preview => {
    state.preview = preview;
    vi.stubEnv("PAYLOAD_API_URL", "https://cms.example.test");
    vi.stubEnv("PAYLOAD_PREVIEW_API_KEY", "must-not-be-sent");
    const docs = [{ id: 1, name: { en: "Dr. Current", kh: "Fixture KH", cn: "Fixture CN" }, department: "GENERAL" }];
    const fetcher = vi.fn(async (input: string, init: RequestInit) => {
      const url = new URL(input);
      expect(url.pathname).toBe("/api/doctors");
      expect(url.searchParams.get("locale")).toBe("all");
      expect(url.searchParams.get("draft")).toBe("false");
      expect(init.cache).toBe("no-store");
      expect(init.headers).toBeUndefined();
      return { ok: true, json: async () => ({ docs, hasNextPage: false }) };
    });
    vi.stubGlobal("fetch", fetcher);
    expect(await getPublishedPayloadDoctorNames()).toEqual(docs);
    expect(fetcher).toHaveBeenCalledOnce();
  });
  it("does not substitute a partial directory when a later page is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: string) => new URL(input).searchParams.has("page")
      ? { ok: false, status: 503 }
      : { ok: true, json: async () => ({ docs: [{ id: 1 }], hasNextPage: true, nextPage: 2 }) }));
    await expect(getPublishedPayloadDoctorNames()).rejects.toThrow();
  });
});
