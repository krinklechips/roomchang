import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { getFaqItems } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "FAQ | Roomchang Dental Hospital",
  description:
    "Frequently asked questions about dental treatments, costs, and visiting Roomchang Dental Hospital in Phnom Penh.",
};

export default async function FaqPage() {
  const faqs = await getFaqItems();

  // Group by category
  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const cat = faq.category ?? "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> Education Blog
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            Answers to the most common questions about dental care, treatments, costs, and what to expect at Roomchang.
          </p>
        </div>
      </div>

      {/* FAQ content */}
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {faqs.length === 0 ? (
          <p className="text-center text-sm text-[color:var(--text-soft)]">
            FAQs are being prepared. Please check back soon.
          </p>
        ) : (
          <div className="space-y-12">
            {categories.map((cat) => (
              <div key={cat}>
                <h2 className="font-display text-2xl text-[color:var(--text-main)]">{cat}</h2>
                <div className="mt-6 divide-y divide-[color:var(--border-strong)]">
                  {grouped[cat].map((faq) => (
                    <details key={faq.id} className="group py-5">
                      <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-[color:var(--text-main)] transition hover:text-[color:var(--brand-deep)] [&::-webkit-details-marker]:hidden">
                        {faq.question}
                        <span className="shrink-0 text-[color:var(--text-soft)] transition group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-[color:var(--brand-soft)] px-8 py-8 text-center">
          <h3 className="font-display text-2xl text-[color:var(--brand-deep)]">
            Still have questions?
          </h3>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">
            Our team is happy to help — reach out anytime.
          </p>
          <Link href="/contact" className="btn-primary mt-5 inline-block">Contact Us</Link>
        </div>
      </div>
    </SiteShell>
  );
}
