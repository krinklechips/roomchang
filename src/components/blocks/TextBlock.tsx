import { sanitizeHtml } from "@/lib/sanitize";

export function TextBlock({ content }: { content?: string }) {
  if (!content) return null;
  return (
    <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
      <div
        className="prose prose-lg max-w-none
          prose-headings:font-display prose-headings:text-[color:var(--text-main)]
          prose-p:text-[color:var(--text-soft)] prose-p:leading-8
          prose-a:text-[color:var(--brand)] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[color:var(--text-main)]
          prose-ul:text-[color:var(--text-soft)] prose-ol:text-[color:var(--text-soft)]"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    </section>
  );
}
