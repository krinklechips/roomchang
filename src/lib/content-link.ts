/** Public CMS actions may link to a site path, fragment or HTTP(S) page, never executable schemes. */
export function contentLink(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const href = value.trim();
  if (!href || /[\u0000-\u001f\u007f\\]/.test(href) || href.startsWith("//")) return null;
  try {
    const url = new URL(href, "https://cms-link.invalid");
    if (url.username || url.password || !["https:", "http:"].includes(url.protocol)) return null;
    if (href.startsWith("#")) return href;
    if (href.startsWith("/")) return `${url.pathname}${url.search}${url.hash}`;
    return /^https?:\/\//i.test(href) ? url.href : null;
  } catch { return null; }
}
