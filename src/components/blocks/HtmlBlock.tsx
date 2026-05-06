import { sanitizeHtml } from "@/lib/sanitize";

export function HtmlBlock({ html }: { html?: string }) {
  if (!html) return null;
  return (
    <section
      className="mx-auto max-w-5xl px-6 py-10 lg:px-8"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
