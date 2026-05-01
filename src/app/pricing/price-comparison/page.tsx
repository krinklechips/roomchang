import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/site/site-shell";
import { supabaseServer } from "@/lib/supabase-server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Price Comparison — Australian Dental Fees | Roomchang Dental Hospital",
  description:
    "How Roomchang's prices compare to average Australian dental fees. Every treatment by ADA code, with Roomchang USD prices alongside Australian averages.",
};

type ComparisonRow = {
  ada: string;
  treatment: string;
  roomchang: string;
  australia: string;
};

const FALLBACK_COMPARISON = {
  exchangeRate: "1 USD ≈ 1.40 AUD",
  sourceNote:
    "Australian prices sourced from the Australian Dental Association's 2022 fee survey. Dental charges in Australia have increased on average 10–25% since that survey.",
  rows: [
    { ada: "013", treatment: "Oral examination — limited", roomchang: "Free", australia: "AUD $53" },
    { ada: "014", treatment: "Consultation", roomchang: "$25", australia: "AUD $67" },
    { ada: "022", treatment: "Intraoral periapical or bitewing X-ray (per exposure)", roomchang: "$8", australia: "AUD $45" },
    { ada: "037", treatment: "Panoramic X-ray (OPG)", roomchang: "$20", australia: "AUD $105" },
    { ada: "071", treatment: "Diagnostic model (per model)", roomchang: "$20", australia: "AUD $66" },
    { ada: "072", treatment: "Photographic records — intraoral", roomchang: "Free", australia: "AUD $37" },
    { ada: "111", treatment: "Removal of plaque and/or stain", roomchang: "$25–30", australia: "AUD $68" },
    { ada: "114", treatment: "Removal of calculus — first visit", roomchang: "$35", australia: "AUD $119" },
    { ada: "141", treatment: "Oral hygiene instruction", roomchang: "Free", australia: "AUD $40" },
    { ada: "161", treatment: "Fissure / tooth surface sealing (per tooth)", roomchang: "$20", australia: "AUD $61" },
    { ada: "232", treatment: "Periodontal flap surgery (per quadrant)", roomchang: "$100", australia: "AUD $295" },
    { ada: "311", treatment: "Tooth extraction", roomchang: "$30–80", australia: "AUD $205" },
    { ada: "521", treatment: "Adhesive restoration — one surface, anterior tooth", roomchang: "$20", australia: "AUD $395" },
    { ada: "531", treatment: "Adhesive restoration — one surface, posterior tooth", roomchang: "$20", australia: "AUD $393" },
    { ada: "582", treatment: "Direct composite veneer", roomchang: "$50–130", australia: "AUD $326" },
    { ada: "583", treatment: "Indirect porcelain veneer", roomchang: "$550–600", australia: "AUD $1,087" },
    { ada: "613", treatment: "Full crown — non-metallic (E-Max / ceramic)", roomchang: "$550–600", australia: "AUD $1,642–1,800" },
    { ada: "615", treatment: "Full crown — veneered (PFM)", roomchang: "$550–600", australia: "AUD $1,678" },
    { ada: "618", treatment: "Full crown — metallic", roomchang: "$300", australia: "AUD $1,730" },
    { ada: "625", treatment: "Post and core for crown", roomchang: "$50", australia: "AUD $477" },
    { ada: "643", treatment: "Bridge pontic (per pontic)", roomchang: "$200–600", australia: "AUD $1,174" },
    { ada: "651", treatment: "Recementing crown or veneer", roomchang: "$20–30", australia: "AUD $160" },
    { ada: "672", treatment: "Full crown on implant — veneered", roomchang: "$550–600", australia: "AUD $1,734" },
    { ada: "688", treatment: "Implant insertion (Myplant Two®, per implant)", roomchang: "$1,200", australia: "AUD $2,277" },
    { ada: "711", treatment: "Complete maxillary denture", roomchang: "$350–400", australia: "AUD $1,474" },
    { ada: "719", treatment: "Complete maxillary and mandibular dentures", roomchang: "$700–800", australia: "AUD $1,485" },
    { ada: "721", treatment: "Partial maxillary resin denture", roomchang: "$300–350", australia: "AUD $2,515" },
    { ada: "727", treatment: "Partial denture — cast framework (2 teeth)", roomchang: "$350–400", australia: "AUD $1,416" },
  ],
};

type PricingComparisonRow = {
  ada: string | null;
  treatment: string;
  roomchang_price: string;
  australia_price: string;
  sort_order: number | null;
};

export default async function PriceComparisonPage() {
  const { data, error } = await supabaseServer
    .from("pricing_comparison_sets")
    .select("exchange_rate, source_note, pricing_comparison_rows(ada, treatment, roomchang_price, australia_price, sort_order)")
    .eq("slug", "full-comparison")
    .maybeSingle();

  if (error) {
    console.error("[PriceComparisonPage] pricing comparison fetch failed:", error.message);
  }

  const cmsRows = (data?.pricing_comparison_rows as PricingComparisonRow[] | undefined)
    ?.slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((row) => ({
      ada: row.ada ?? "",
      treatment: row.treatment,
      roomchang: row.roomchang_price,
      australia: row.australia_price,
    }));

  const fullComparison = {
    exchangeRate: data?.exchange_rate ?? FALLBACK_COMPARISON.exchangeRate,
    sourceNote: data?.source_note ?? FALLBACK_COMPARISON.sourceNote,
  };
  const rows: ComparisonRow[] = cmsRows?.length ? cmsRows : FALLBACK_COMPARISON.rows;

  return (
    <SiteShell>
      {/* Hero */}
      <div className="border-b border-[--border-strong] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
            Roomchang vs. Australia
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            Price Comparison
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            Every treatment below follows the Australian Dental Association (ADA) schedule.
            Roomchang uses the same international-quality materials and protocols at a fraction
            of the cost — because Cambodia&apos;s operating costs are lower, not our standards.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Get a Personalised Quote</Link>
            <Link href="/pricing" className="btn-secondary">All Treatment Prices</Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 space-y-12">
        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[color:var(--text-main)]">
                Full Treatment Comparison
              </h2>
              <p className="mt-2 text-sm text-[color:var(--text-soft)]">
                Exchange rate used: {fullComparison.exchangeRate}
              </p>
            </div>
            <Link
              href="/pricing/implants-comparison"
              className="text-sm font-semibold text-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
            >
              See dental implants comparison →
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-[color:var(--brand-soft)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--brand-soft)] bg-[color:var(--surface)]">
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      ADA
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      Treatment
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-deep)]">
                      Roomchang (USD)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      Australia (AUD)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--brand-soft)]">
                  {rows.map((row) => (
                    <tr key={`${row.ada}-${row.treatment}`} className="transition hover:bg-[color:var(--surface)]">
                      <td className="px-6 py-4 text-center text-xs text-[color:var(--text-soft)]">{row.ada}</td>
                      <td className="px-6 py-4 font-medium text-[color:var(--text-main)]">{row.treatment}</td>
                      <td className="px-6 py-4 text-right font-bold text-[color:var(--brand-deep)]">{row.roomchang}</td>
                      <td className="px-6 py-4 text-right text-[color:var(--text-soft)]">{row.australia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[color:var(--brand-soft)] bg-[color:var(--brand-soft)] px-6 py-4">
              <p className="text-xs leading-relaxed text-[color:var(--text-soft)]">
                * {fullComparison.sourceNote} Prices subject to change — please contact us for the latest quote.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-[color:var(--brand)] p-10 text-white sm:p-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-4xl">Get your exact quote</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-white/80">
                Send us your X-rays or photos and we&apos;ll provide a detailed treatment plan
                with exact pricing within two business days — at no charge.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full border border-white/30 bg-white px-7 py-4 text-sm font-bold text-[color:var(--brand)] transition hover:bg-white/90"
            >
              Request a Free Quote
            </Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
