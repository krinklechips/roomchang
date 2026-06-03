import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NEWS_ARTICLES_SORTED } from "@/lib/news";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Events | Roomchang Dental Hospital",
  description:
    "The latest news, events, press coverage, and announcements from Roomchang Dental Hospital — Cambodia's leading dental group since 1996.",
};

export default function NewsPage() {
  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> About
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            News & Events
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            Stay updated with the latest news, events, press coverage, and announcements from
            Roomchang Dental Hospital — Cambodia&apos;s leading dental group since 1996.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {/* Article grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {NEWS_ARTICLES_SORTED.map((article) => (
            <Link
              key={article.slug}
              href={`/about/news/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_12px_40px_rgba(57,28,45,0.05)] transition hover:border-[color:var(--brand-light)] hover:shadow-[0_16px_48px_rgba(57,28,45,0.10)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--surface)]">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  unoptimized
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--brand)]">
                  {article.date}
                </p>
                <h2 className="mt-2 font-display text-xl leading-snug text-[color:var(--text-main)] group-hover:text-[color:var(--brand-deep)] transition-colors">
                  {article.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-[color:var(--text-soft)]">
                  {article.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--brand-deep)] transition group-hover:text-[color:var(--brand)]">
                  Read Article <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-[color:var(--brand-soft)] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[color:var(--text-main)]">
                Stay Connected
              </h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-[color:var(--text-soft)]">
                Follow us on social media for the latest updates, events, and dental health tips
                from Roomchang Dental Hospital.
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
