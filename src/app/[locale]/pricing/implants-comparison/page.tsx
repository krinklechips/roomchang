import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Package, FlaskConical, Building2 } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { supabaseServer } from "@/lib/supabase-server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Dental Implants Price Comparison | Roomchang Dental Hospital",
  description:
    "Why Roomchang's dental implants cost a fraction of Australian prices without compromising material quality — a breakdown of implant costs and the Myplant Two® system.",
};

const COST_DRIVERS = [
  { id: "materials", icon: Package },
  { id: "laboratory", icon: FlaskConical },
  { id: "overheads", icon: Building2 },
];

const IMPLANT_PRICES = [
  { id: "single",     ada: "688", roomchang: "$1,200",       australia: "AUD $2,277" },
  { id: "crown",      ada: "672", roomchang: "$550–600",     australia: "AUD $1,734" },
  { id: "emax",       ada: "",    roomchang: "$2,400",       australia: "AUD $4,200+" },
  { id: "bridge",     ada: "",    roomchang: "$5,000–5,400", australia: "AUD $9,500+" },
];

type PricingComparisonRow = {
  ada: string | null;
  treatment: string;
  roomchang_price: string;
  australia_price: string;
  sort_order: number | null;
};

export default async function ImplantsComparisonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("implantsComparison");

  const { data, error } = await supabaseServer
    .from("pricing_comparison_sets")
    .select("pricing_comparison_rows(ada, treatment, roomchang_price, australia_price, sort_order)")
    .eq("slug", "implants-comparison")
    .maybeSingle();

  if (error) {
    console.error("[ImplantsComparisonPage] pricing comparison fetch failed:", error.message);
  }

  const rows = ((data?.pricing_comparison_rows as PricingComparisonRow[] | undefined) ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((row) => ({
      ada: row.ada ?? "",
      treatment: row.treatment,
      roomchang: row.roomchang_price,
      australia: row.australia_price,
    }));
  const fallbackPrices = IMPLANT_PRICES.map((row) => ({
    ada: row.ada,
    treatment: t(`prices.${row.id}.treatment`),
    roomchang: row.roomchang,
    australia: row.australia,
  }));
  const implantPrices = rows.length ? rows : fallbackPrices;

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
            {t("hero.body")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">{t("hero.ctaPrimary")}</Link>
            <Link href="/services/dental-implants" className="btn-secondary">{t("hero.ctaSecondary")}</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8 space-y-8 sm:space-y-16">

        {/* Cost drivers */}
        <section>
          <h2 className="font-display text-3xl text-[color:var(--text-main)]">
            {t("costDrivers.heading")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-soft)]">
            {t("costDrivers.intro")}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {COST_DRIVERS.map(({ icon: Icon, id }) => (
              <article
                key={id}
                className="rounded-3xl border border-[color:var(--border-strong)] bg-white p-7 shadow-[0_16px_48px_rgba(57,28,45,0.06)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                  <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-xl text-[color:var(--text-main)]">{t(`costDrivers.${id}.title`)}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">{t(`costDrivers.${id}.body`)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Material callout */}
        <section className="rounded-3xl bg-[color:var(--brand-soft)] px-8 py-10 sm:px-12 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
                {t("material.eyebrow")}
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-[color:var(--text-main)]">
                {t("material.title")}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--text-soft)]">
                {t("material.body")}
              </p>
            </div>
          </div>
        </section>

        {/* Price table */}
        <section>
          <h2 className="font-display text-3xl text-[color:var(--text-main)]">
            {t("table.heading")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-soft)]">
            {t("table.intro")}
          </p>

          <div className="mt-8 overflow-hidden rounded-3xl border border-[color:var(--brand-soft)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--brand-soft)] bg-[color:var(--surface)]">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      {t("table.colTreatment")}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      {t("table.colAda")}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-deep)]">
                      {t("table.colRoomchang")}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      {t("table.colAustralia")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--brand-soft)]">
                  {implantPrices.map((row, i) => (
                    <tr key={i} className="transition hover:bg-[color:var(--surface)]">
                      <td className="px-6 py-4 font-medium text-[color:var(--text-main)]">{row.treatment}</td>
                      <td className="px-6 py-4 text-center text-xs text-[color:var(--text-soft)]">{row.ada || "—"}</td>
                      <td className="px-6 py-4 text-right font-bold text-[color:var(--brand-deep)]">{row.roomchang}</td>
                      <td className="px-6 py-4 text-right text-[color:var(--text-soft)]">{row.australia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-[color:var(--brand)] p-10 text-white sm:p-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-4xl">{t("cta.heading")}</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-white/80">
                {t("cta.body")}
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full border border-white/30 bg-white px-7 py-4 text-sm font-bold text-[color:var(--brand)] transition hover:bg-white/90"
            >
              {t("cta.button")}
            </Link>
          </div>
        </section>

      </div>
    </SiteShell>
  );
}