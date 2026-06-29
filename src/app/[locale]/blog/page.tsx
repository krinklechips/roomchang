import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowRight, HelpCircle, Mic, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogIndex" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

const BLOG_SECTIONS = [
  {
    id: "faq",
    href: "/blog/faq",
    icon: HelpCircle,
  },
  {
    id: "dentistTalks",
    href: "/blog/dentist-talks",
    icon: Mic,
  },
  {
    id: "publications",
    href: "/blog/publications",
    icon: BookOpen,
  },
];

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blogIndex");

  return (
    <SiteShell>
      {/* Hero */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            {t("hero.description")}
          </p>
        </div>
      </div>

      {/* Section cards */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {BLOG_SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex flex-col rounded-3xl border border-[color:var(--border-strong)] bg-white p-8 shadow-[0_12px_40px_rgba(57,28,45,0.05)] transition hover:border-[color:var(--brand-light)] hover:shadow-[0_16px_48px_rgba(204,55,113,0.1)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                <section.icon size={24} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-display text-2xl text-[color:var(--text-main)] group-hover:text-[color:var(--brand-deep)]">
                {t(`sections.${section.id}.title`)}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-[color:var(--text-soft)]">
                {t(`sections.${section.id}.description`)}
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-deep)] transition group-hover:text-[color:var(--brand)]">
                {t("browse")} <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}