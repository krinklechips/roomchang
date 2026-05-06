import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content from the CMS before rendering.
 * Strips scripts, event handlers, and dangerous attributes
 * while preserving safe formatting tags.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    // Allow common formatting + layout tags
    ALLOWED_TAGS: [
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
    // Allow safe attributes only
    ALLOWED_ATTR: [
      "href", "target", "rel",
      "src", "alt", "width", "height", "loading",
      "class", "id",
      "colspan", "rowspan",
      "autoplay", "loop", "muted", "playsinline", "controls",
      "type",
    ],
    // Force rel="noopener noreferrer" on links with target
    ADD_ATTR: ["target"],
    // Remove any data: or javascript: URIs
    ALLOW_DATA_ATTR: false,
    FORBID_ATTR: ["style", "onerror", "onload", "onclick", "onmouseover"],
  });
}
