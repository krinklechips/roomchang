import "server-only";
import { unstable_rethrow } from "next/navigation";

export type PilotPublication = {
  id: string;
  title: string;
  originalTitle: string;
  authors: string | null;
  journal: string | null;
  year: number;
  order: number;
  doi: string | null;
  url: string | null;
  abstract: string | null;
};

export class PublicationsUnavailableError extends Error {
  constructor() {
    super("Published publications are temporarily unavailable.");
    this.name = "PublicationsUnavailableError";
  }
}

type ReaderOptions = { origin: string; locale: string; timeoutMs?: number };
const MAX_RECORDS = 500;
const DEADLINE_MS = 4000;

function optionalText(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value !== "string") throw new PublicationsUnavailableError();
  return value.trim() || null;
}

function externalLink(value: unknown, doi = false): string | null {
  const text = optionalText(value);
  if (!text) return null;
  const url = new URL(doi && /^10\.\d{4,9}\//.test(text) ? `https://doi.org/${text}` : text);
  if (url.protocol !== "https:" || url.username || url.password) throw new PublicationsUnavailableError();
  return url.href;
}

function publicationRecord(value: unknown): { nativeID: string; publication: PilotPublication } {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new PublicationsUnavailableError();
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" && typeof row.id !== "number") throw new PublicationsUnavailableError();
  const nativeID = String(row.id).trim();
  const originalTitle = optionalText(row.title);
  const year = row.year;
  if (!nativeID || !originalTitle || row._status !== "published" || typeof year !== "number"
    || !Number.isInteger(year) || year < 1800 || year > new Date().getUTCFullYear() + 1) {
    throw new PublicationsUnavailableError();
  }
  const order = row.order ?? 0;
  if (typeof order !== "number" || !Number.isFinite(order)) throw new PublicationsUnavailableError();
  const doi = externalLink(row.doi, true);
  const url = externalLink(row.url);
  if (!doi && !url) throw new PublicationsUnavailableError();
  return { nativeID, publication: {
    id: optionalText(row.sourceId) || nativeID,
    title: optionalText(row.displayTitle) || originalTitle,
    originalTitle, authors: optionalText(row.authors), journal: optionalText(row.journal), year, order,
    doi, url, abstract: optionalText(row.abstract),
  } };
}

export async function readPublishedPublications({ origin, locale, timeoutMs = DEADLINE_MS }: ReaderOptions): Promise<PilotPublication[]> {
  try {
    if (locale !== "en" || !Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > DEADLINE_MS) {
      throw new PublicationsUnavailableError();
    }
    const base = new URL(origin);
    const loopback = base.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(base.hostname);
    if ((!loopback && base.protocol !== "https:") || base.username || base.password || base.search || base.hash || base.pathname !== "/") {
      throw new PublicationsUnavailableError();
    }
    const signal = AbortSignal.timeout(timeoutMs);
    const nativeIDs = new Set<string>();
    const identities = new Set<string>();
    const publications: PilotPublication[] = [];
    let expectedTotal: number | undefined;
    for (let page = 1; page <= 5; page++) {
      const url = new URL("/api/publications", base);
      url.search = new URLSearchParams({ locale: "en", "fallback-locale": "none", depth: "0", limit: "100", sort: "-year,order,id", page: String(page) }).toString();
      const response = await fetch(url.href, { cache: "no-store", credentials: "omit", redirect: "error", signal,
        headers: { Accept: "application/json" } });
      if (!response.ok) throw new PublicationsUnavailableError();
      const result: unknown = await response.json();
      if (!result || typeof result !== "object" || Array.isArray(result)) throw new PublicationsUnavailableError();
      const data = result as Record<string, unknown>;
      if (!Array.isArray(data.docs) || !data.docs.length || typeof data.hasNextPage !== "boolean"
        || typeof data.totalDocs !== "number" || !Number.isInteger(data.totalDocs) || data.totalDocs < 1 || data.totalDocs > MAX_RECORDS
        || (expectedTotal !== undefined && data.totalDocs !== expectedTotal)) throw new PublicationsUnavailableError();
      expectedTotal = data.totalDocs;
      for (const value of data.docs) {
        const { nativeID, publication } = publicationRecord(value);
        if (nativeIDs.has(nativeID) || identities.has(publication.id)) throw new PublicationsUnavailableError();
        nativeIDs.add(nativeID);
        identities.add(publication.id);
        publications.push(publication);
      }
      if (publications.length > expectedTotal) throw new PublicationsUnavailableError();
      if (!data.hasNextPage) {
        if (publications.length !== expectedTotal) throw new PublicationsUnavailableError();
        return publications.sort((a, b) => b.year - a.year || a.order - b.order || a.id.localeCompare(b.id));
      }
      if (data.nextPage !== page + 1 || publications.length >= expectedTotal) throw new PublicationsUnavailableError();
    }
    throw new PublicationsUnavailableError();
  } catch (error) {
    unstable_rethrow(error);
    throw new PublicationsUnavailableError();
  }
}
