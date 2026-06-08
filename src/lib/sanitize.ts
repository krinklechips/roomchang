import sanitize from "sanitize-html";

/**
 * Sanitize HTML content from the CMS before rendering.
 * Strips scripts, event handlers, styles, and dangerous URIs while preserving
 * safe formatting/layout tags.
 *
 * Uses `sanitize-html` (htmlparser2-based) rather than DOMPurify so we don't
 * pull in `jsdom` on the server — jsdom's dependency chain (html-encoding-sniffer
 * → @exodus/bytes, ESM) fails to load in Vercel's serverless runtime, which was
 * crashing every dynamically-rendered route (e.g. the 404 page) with a 500.
 */
export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "ul", "ol", "li",
      "strong", "em", "b", "i", "u", "s", "mark", "small", "sub", "sup",
      "a", "span", "div", "section", "article",
      "blockquote", "pre", "code",
      "table", "thead", "tbody", "tfoot", "tr", "th", "td",
      "img", "figure", "figcaption",
      "video", "source",
    ],
    allowedAttributes: {
      "*": ["class", "id"],
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
      video: ["autoplay", "loop", "muted", "playsinline", "controls", "width", "height"],
      source: ["src", "type"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
    },
    // Only safe URL schemes — excludes javascript: and data:
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    // Force rel="noopener noreferrer" on links (esp. target="_blank")
    transformTags: {
      a: sanitize.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}
