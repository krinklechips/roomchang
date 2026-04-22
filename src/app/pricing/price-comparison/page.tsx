import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/site/site-shell";
import pricingData from "@/data/pricing.json";

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

export default function PriceComparisonPage() {
  const { fullComparison } = pricingData;
  const rows: ComparisonRow[] = fullComparison.rows;

  return (
    <SiteShell>
      {/* Hero */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
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
                  <tr className="border-b border-[color:var(--brand-soft)] bg-[--surface]">
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
                    <tr key={row.ada} className="transition hover:bg-[--surface]">
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
