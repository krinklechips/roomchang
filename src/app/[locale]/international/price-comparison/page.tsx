import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/site/site-shell";
import { supabaseServer } from "@/lib/supabase-server";
import type { Metadata } from "next";

// Re-fetch comparison rows from Supabase at most every 60s so CMS edits go live.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pricing.comparison");
  return {
    title: `${t("heading")} | Roomchang Dental Hospital`,
    description: t("subheading"),
  };
}

type ComparisonRow = { ada: string; treatment: string; roomchang: string; australia: string; singapore: string };

const FALLBACK_COMPARISON = {
  exchangeRate: "1 USD ≈ 1.40 AUD ≈ 1.35 SGD",
  sourceNote:
    "Australian prices sourced from the Australian Dental Association's 2022 fee survey (charges have since risen ~10–25%). Singapore figures are indicative, based on the Ministry of Health (MOH) fee benchmarks for common procedures and typical private-clinic ranges; actual fees vary and are subject to GST.",
  rows: [
    { ada: "013", treatment: "Oral examination — limited", roomchang: "Free", australia: "AUD $53", singapore: "SGD $21–31" },
    { ada: "014", treatment: "Consultation", roomchang: "$25", australia: "AUD $67", singapore: "SGD $21–31" },
    { ada: "022", treatment: "Intraoral periapical or bitewing X-ray (per exposure)", roomchang: "$8", australia: "AUD $45", singapore: "SGD $16–33" },
    { ada: "037", treatment: "Panoramic X-ray (OPG)", roomchang: "$20", australia: "AUD $105", singapore: "SGD $65–104" },
    { ada: "071", treatment: "Diagnostic model (per model)", roomchang: "$20", australia: "AUD $66", singapore: "SGD $50–80" },
    { ada: "072", treatment: "Photographic records — intraoral", roomchang: "Free", australia: "AUD $37", singapore: "SGD $30–60" },
    { ada: "111", treatment: "Removal of plaque and/or stain", roomchang: "$25–30", australia: "AUD $68", singapore: "SGD $26–38" },
    { ada: "114", treatment: "Removal of calculus — first visit", roomchang: "$35", australia: "AUD $119", singapore: "SGD $35–60" },
    { ada: "141", treatment: "Oral hygiene instruction", roomchang: "Free", australia: "AUD $40", singapore: "SGD $20–40" },
    { ada: "161", treatment: "Fissure / tooth surface sealing (per tooth)", roomchang: "$20", australia: "AUD $61", singapore: "SGD $30–60" },
    { ada: "232", treatment: "Periodontal flap surgery (per quadrant)", roomchang: "$100", australia: "AUD $295", singapore: "SGD $400–800" },
    { ada: "311", treatment: "Tooth extraction", roomchang: "$30–80", australia: "AUD $205", singapore: "SGD $70–164" },
    { ada: "521", treatment: "Adhesive restoration — one surface, anterior tooth", roomchang: "$20", australia: "AUD $395", singapore: "SGD $65–160" },
    { ada: "531", treatment: "Adhesive restoration — one surface, posterior tooth", roomchang: "$20", australia: "AUD $393", singapore: "SGD $80–180" },
    { ada: "582", treatment: "Direct composite veneer", roomchang: "$50–130", australia: "AUD $326", singapore: "SGD $150–350" },
    { ada: "583", treatment: "Indirect porcelain veneer", roomchang: "$550–600", australia: "AUD $1,087", singapore: "SGD $1,000–1,500" },
    { ada: "613", treatment: "Full crown — non-metallic (E-Max / ceramic)", roomchang: "$550–600", australia: "AUD $1,642–1,800", singapore: "SGD $750–1,400" },
    { ada: "615", treatment: "Full crown — veneered (PFM)", roomchang: "$550–600", australia: "AUD $1,678", singapore: "SGD $700–1,200" },
    { ada: "618", treatment: "Full crown — metallic", roomchang: "$300", australia: "AUD $1,730", singapore: "SGD $600–1,000" },
    { ada: "625", treatment: "Post and core for crown", roomchang: "$50", australia: "AUD $477", singapore: "SGD $200–400" },
    { ada: "643", treatment: "Bridge pontic (per pontic)", roomchang: "$200–600", australia: "AUD $1,174", singapore: "SGD $750–1,400" },
    { ada: "651", treatment: "Recementing crown or veneer", roomchang: "$20–30", australia: "AUD $160", singapore: "SGD $80–150" },
    { ada: "672", treatment: "Full crown on implant — veneered", roomchang: "$550–600", australia: "AUD $1,734", singapore: "SGD $1,000–1,800" },
    { ada: "688", treatment: "Implant insertion (Myplant Two®, per implant)", roomchang: "$1,200", australia: "AUD $2,277", singapore: "SGD $3,000–6,000" },
    { ada: "711", treatment: "Complete maxillary denture", roomchang: "$350–400", australia: "AUD $1,474", singapore: "SGD $500–818" },
    { ada: "719", treatment: "Complete maxillary and mandibular dentures", roomchang: "$700–800", australia: "AUD $1,485", singapore: "SGD $1,000–1,600" },
    { ada: "721", treatment: "Partial maxillary resin denture", roomchang: "$300–350", australia: "AUD $2,515", singapore: "SGD $320–603" },
    { ada: "727", treatment: "Partial denture — cast framework (2 teeth)", roomchang: "$350–400", australia: "AUD $1,416", singapore: "SGD $450–750" },
  ] as ComparisonRow[],
};

type PricingComparisonRow = {
  ada: string | null;
  treatment: string;
  roomchang_price: string;
  australia_price: string;
  singapore_price: string | null;
  sort_order: number | null;
};

export default async function PriceComparisonPage() {
  const [comparisonResult, tComp] = await Promise.all([
    supabaseServer
      .from("pricing_comparison_sets")
      .select("exchange_rate, source_note, pricing_comparison_rows(ada, treatment, roomchang_price, australia_price, singapore_price, sort_order)")
      .eq("slug", "full-comparison")
      .maybeSingle(),
    getTranslations("pricing.comparison"),
  ]);

  if (comparisonResult.error) {
    console.error("[PriceComparisonPage] comparison fetch failed:", comparisonResult.error.message);
  }

  const cmsRows = (comparisonResult.data?.pricing_comparison_rows as PricingComparisonRow[] | undefined)
    ?.slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((row) => ({
      ada: row.ada ?? "",
      treatment: row.treatment,
      roomchang: row.roomchang_price,
      australia: row.australia_price,
      singapore: row.singapore_price ?? "—",
    }));

  const comparisonMeta = {
    exchangeRate: comparisonResult.data?.exchange_rate ?? FALLBACK_COMPARISON.exchangeRate,
    sourceNote: comparisonResult.data?.source_note ?? FALLBACK_COMPARISON.sourceNote,
  };
  const comparisonRows: ComparisonRow[] = cmsRows?.length ? cmsRows : FALLBACK_COMPARISON.rows;

  // Split the combined source note into numbered footnotes: ¹ Australia, ² Singapore.
  // Falls back gracefully to a single note if the "Singapore" boundary isn't found.
  const sourceParts = comparisonMeta.sourceNote.split(/\s*(?=Singapore figures)/i);
  const australiaNote = sourceParts[0]?.trim() ?? comparisonMeta.sourceNote;
  const singaporeNote = sourceParts[1]?.trim() ?? "";

  return (
    <SiteShell>
      {/* Hero */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
            {tComp("eyebrow")}
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            {tComp("heading")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            {tComp("subheading")}
          </p>
          <p className="mt-3 text-sm text-[color:var(--text-soft)]">
            {tComp("exchangeRateLabel")} {comparisonMeta.exchangeRate}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">{tComp("ctaPrimary")}</Link>
            <Link href="/pricing/implants-comparison" className="btn-secondary">
              {tComp("seeImplants")}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 space-y-16">
        {/* Comparison table */}
        <section>
          <div className="overflow-hidden rounded-3xl border border-[color:var(--brand-soft)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--brand-soft)] bg-[color:var(--surface)]">
                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      {tComp("colAda")}
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      {tComp("colTreatment")}
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-deep)]">
                      {tComp("colRoomchang")}
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      {tComp("colAustralia")}
                      <sup className="ml-0.5 font-bold text-[color:var(--brand)]">1</sup>
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      {tComp("colSingapore")}
                      <sup className="ml-0.5 font-bold text-[color:var(--brand)]">2</sup>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--brand-soft)]">
                  {comparisonRows.map((row) => (
                    <tr key={`${row.ada}-${row.treatment}`} className="transition hover:bg-[color:var(--surface)]">
                      <td className="px-5 py-4 text-center text-xs text-[color:var(--text-soft)]">{row.ada}</td>
                      <td className="px-5 py-4 font-medium text-[color:var(--text-main)]">{row.treatment}</td>
                      <td className="px-5 py-4 text-right font-bold text-[color:var(--brand-deep)]">{row.roomchang}</td>
                      <td className="px-5 py-4 text-right text-[color:var(--text-soft)]">{row.australia}</td>
                      <td className="px-5 py-4 text-right text-[color:var(--text-soft)]">{row.singapore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[color:var(--brand-soft)] bg-[color:var(--brand-soft)] px-6 py-4 space-y-1.5">
              <p className="text-xs leading-relaxed text-[color:var(--text-soft)]">
                <span className="mr-1 font-bold text-[color:var(--brand)]">1.</span>
                {australiaNote}
              </p>
              {singaporeNote && (
                <p className="text-xs leading-relaxed text-[color:var(--text-soft)]">
                  <span className="mr-1 font-bold text-[color:var(--brand)]">2.</span>
                  {singaporeNote}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-[color:var(--brand)] p-10 text-white sm:p-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-4xl">{tComp("ctaHeading")}</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-white/80">
                {tComp("ctaBody")}
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full border border-white/30 bg-white px-7 py-4 text-sm font-bold text-[color:var(--brand)] transition hover:bg-white/90"
            >
              {tComp("ctaButton")}
            </Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
