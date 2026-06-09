import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { ClinicalResultsGrid } from "@/components/sections/clinical-results-grid";
import { getClinicalCases, getSeoPageMeta } from "@/lib/data";
import { buildSeoMetadata } from "@/lib/seo";
import {
  CLINICAL_CATEGORIES,
  getClinicalCategoryBySlug,
} from "@/lib/clinical-categories";

export const revalidate = 60;

export function generateStaticParams() {
  return CLINICAL_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getClinicalCategoryBySlug(slug);
  if (!category) return {};

  const path = `/clinical-results/category/${slug}`;
  const seo = await getSeoPageMeta(path);

  return buildSeoMetadata(
    {
      path,
      title: category.metaTitle,
      description: category.metaDescription,
    },
    seo,
  );
}

export default async function ClinicalResultsCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getClinicalCategoryBySlug(slug);
  if (!category) notFound();

  const cases = await getClinicalCases();
  const categoryCases = cases.filter((c) => c.category === category.category);

  return (
    <SiteShell>
      {/* Hero */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/clinical-results"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> All Clinical Results
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            {category.label}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            {category.intro}
          </p>

          {/* Sibling categories — real links for navigation + internal linking */}
          <div className="mt-7 flex flex-wrap gap-2">
            <Link
              href="/clinical-results"
              className="rounded-full border border-[color:var(--border-strong)] bg-white px-4 py-1.5 text-xs font-semibold text-[color:var(--text-soft)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
            >
              All cases
            </Link>
            {CLINICAL_CATEGORIES.map((c) => {
              const isActive = c.slug === category.slug;
              return (
                <Link
                  key={c.slug}
                  href={`/clinical-results/category/${c.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "border-[color:var(--brand)] bg-[color:var(--brand)] text-white"
                      : "border-[color:var(--border-strong)] bg-white text-[color:var(--text-soft)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
                  }`}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cases for this category */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
        {categoryCases.length > 0 ? (
          <ClinicalResultsGrid
            cases={categoryCases}
            initialCategory={category.category}
            showFilters={false}
          />
        ) : (
          <p className="text-sm text-[color:var(--text-soft)]">
            New {category.label.toLowerCase()} cases are coming soon.{" "}
            <Link href="/clinical-results" className="font-semibold text-[color:var(--brand)] underline">
              Browse all clinical results
            </Link>
            .
          </p>
        )}
      </div>
    </SiteShell>
  );
}
