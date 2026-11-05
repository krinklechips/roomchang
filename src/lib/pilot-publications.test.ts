import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readPublishedPublications } from "./pilot-publications";

const publication = {
  id: 1, sourceId: "original-publication", title: "Original research title", displayTitle: "Edited display title",
  authors: "A. Researcher", journal: "Research Journal", year: 2025, order: 1,
  doi: "10.1234/research.1", url: null, abstract: "Published abstract", _status: "published",
};
const envelope = (docs: unknown[] = [publication]) => ({ docs, totalDocs: docs.length, hasNextPage: false, nextPage: null });
const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
let fetcher: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetcher = vi.fn().mockResolvedValue(response(envelope()));
  vi.stubGlobal("fetch", fetcher);
});
afterEach(() => vi.unstubAllGlobals());

describe("published-only Publications pilot reader", () => {
  it("reads the selected English published collection without sending draft credentials or cookies", async () => {
    const rows = await readPublishedPublications({ origin: "https://roomchang.serviettelab.com", locale: "en" });
    expect(rows).toEqual([{
      id: "original-publication", title: "Edited display title", originalTitle: "Original research title",
      authors: "A. Researcher", journal: "Research Journal", year: 2025, order: 1,
      doi: "https://doi.org/10.1234/research.1", url: null, abstract: "Published abstract",
    }]);
    const [input, init] = fetcher.mock.calls[0];
    const url = new URL(input);
    expect(url.origin).toBe("https://roomchang.serviettelab.com");
    expect(url.pathname).toBe("/api/publications");
    expect(url.searchParams.get("locale")).toBe("en");
    expect(url.searchParams.get("fallback-locale")).toBe("none");
    expect(url.searchParams.get("sort")).toBe("-year,order,id");
    expect(url.searchParams.has("draft")).toBe(false);
    expect(new Headers(init.headers).has("authorization")).toBe(false);
    expect(new Headers(init.headers).has("cookie")).toBe(false);
    expect(init.credentials).toBe("omit");
    expect(init.cache).toBe("no-store");
    expect(init.redirect).toBe("error");
  });

  it.each(["kh", "cn", "en/../kh"])("refuses a language outside the first pilot: %s", async locale => {
    await expect(readPublishedPublications({ origin: "https://roomchang.serviettelab.com", locale })).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each([
    "http://untrusted.example", "file:///etc/passwd", "https://user:password@example.com", "https://example.com?draft=true",
  ])("refuses an unsafe CMS origin: %s", async origin => {
    await expect(readPublishedPublications({ origin, locale: "en" })).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each([
    {}, { docs: null }, envelope([]), envelope([{ ...publication, _status: "draft" }]),
    envelope([{ ...publication, title: "" }]), envelope([{ ...publication, year: "2025" }]),
    envelope([{ ...publication, year: Number.NaN }]), envelope([{ ...publication, doi: "javascript:alert(1)" }]),
    envelope([{ ...publication, url: "data:text/html,bad" }]), envelope([publication, publication]),
    { ...envelope(), hasNextPage: true, nextPage: 1 },
    { ...envelope(), totalDocs: 100000, hasNextPage: true, nextPage: 2 },
    { ...envelope(), totalDocs: 2 },
  ])("rejects missing, empty, draft, unsafe or inconsistent required content", async data => {
    fetcher.mockImplementation(async () => response(data));
    await expect(readPublishedPublications({ origin: "https://roomchang.serviettelab.com", locale: "en" }))
      .rejects.toThrow(/publication/i);
  });

  it.each([403, 404, 429, 500, 503])("does not turn upstream HTTP %s into an empty successful page", async status => {
    fetcher.mockImplementation(async () => response({ error: "upstream failure" }, status));
    await expect(readPublishedPublications({ origin: "https://roomchang.serviettelab.com", locale: "en" }))
      .rejects.toThrow(/publication/i);
  });

  it("rejects malformed JSON instead of reusing old content silently", async () => {
    fetcher.mockResolvedValue(new Response("not JSON", { status: 200 }));
    await expect(readPublishedPublications({ origin: "https://roomchang.serviettelab.com", locale: "en" })).rejects.toThrow(/publication/i);
  });

  it("bounds an unresponsive fetch and succeeds again when the provider recovers", async () => {
    fetcher.mockImplementationOnce((_url: unknown, init: RequestInit) => new Promise((_resolve, reject) => {
      init.signal!.addEventListener("abort", () => reject(init.signal!.reason), { once: true });
    }));
    await expect(readPublishedPublications({ origin: "http://127.0.0.1:4001", locale: "en", timeoutMs: 25 })).rejects.toThrow(/publication/i);
    fetcher.mockResolvedValue(response(envelope()));
    await expect(readPublishedPublications({ origin: "http://127.0.0.1:4001", locale: "en" })).resolves.toHaveLength(1);
  });

  it("paginates deterministically within a single deadline and keeps every unique publication", async () => {
    fetcher.mockResolvedValueOnce(response({ docs: [publication], totalDocs: 2, hasNextPage: true, nextPage: 2 }));
    fetcher.mockResolvedValueOnce(response({ docs: [{ ...publication, id: 2, sourceId: "second-publication", year: 2024 }], totalDocs: 2, hasNextPage: false, nextPage: null }));
    const rows = await readPublishedPublications({ origin: "https://roomchang.serviettelab.com", locale: "en" });
    expect(rows.map(row => row.id)).toEqual(["original-publication", "second-publication"]);
    expect(new URL(fetcher.mock.calls[1][0]).searchParams.get("page")).toBe("2");
    expect(fetcher.mock.calls[1][1].signal).toBe(fetcher.mock.calls[0][1].signal);
  });
});
