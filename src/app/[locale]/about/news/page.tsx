import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabaseServer } from "@/lib/supabase-server";
import { getTranslatedFieldsBatch, mergeTranslation } from "@/lib/i18n-content";
import { getPayloadNewsArticles, isPayloadSource } from "@/lib/payload-source";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NEWS_ARTICLES_SORTED } from "@/lib/news";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("newsPage");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

type Article = {
  id?: string;
  slug: string;
  date: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { data, error } = isPayloadSource()
    ? { data: await getPayloadNewsArticles(), error: null }
    : await supabaseServer
        .from("news_articles")
        .select("id, slug, date, title, description, image, imageAlt")
        .eq("published", true)
        .order("order", { ascending: true });

  if (error) {
    console.error("[NewsPage] news_articles fetch failed:", error.message);
  }

  const baseArticles: Article[] =
    (data as Article[] | null)?.filter((a) => a.slug) ??
    NEWS_ARTICLES_SORTED.map((a) => ({
      slug: a.slug,
      date: a.date,
      title: a.title,
      description: a.description,
      image: a.image,
      imageAlt: a.imageAlt,
    }));
  const newsTr = isPayloadSource()
    ? new Map<string, Record<string, unknown>>()
    : await getTranslatedFieldsBatch(
        "news_article",
        baseArticles.map((a) => a.id).filter((id): id is string => Boolean(id)),
      );
  const articles: Article[] = baseArticles.map((a) =>
    a.id ? mergeTranslation(a, newsTr.get(a.id) ?? {}) : a,
  );

  const t = await getTranslations("newsPage");

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> {t("backToAbout")}
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            {t("heading")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            {t("intro")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
        {/* Article grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
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
                  className="object-contain"
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
                  {t("readArticle")} <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
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
                {t("stayConnectedTitle")}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-[color:var(--text-soft)]">
                {t("stayConnectedBody")}
              </p>
            </div>
            <Link href="/contact#enquiry-form" className="btn-primary shrink-0">
              {t("contactUs")}
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
