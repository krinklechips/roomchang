import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  ClipboardText,
  Sparkle,
  Scales,
  UserCircle,
  Stethoscope,
  ArrowLeft,
  EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";
import { SiteShell } from "@/components/site/site-shell";
import { getWarrantyTerms } from "@/lib/data";

// Re-fetch the warranty terms from Supabase at most every 60s so clinic edits go
// live without a redeploy.
export const revalidate = 60;

const SITE = "https://www.roomchang.com";

export const metadata: Metadata = {
  title: "Dental Services Warranty Terms | Roomchang Dental Hospital",
  description:
    "Roomchang Dental Hospital's Dental Services Warranty Program: coverage periods for implants, crowns, veneers and composite restorations, what is and isn't covered, validity conditions, and the post-warranty benefit.",
  alternates: { canonical: `${SITE}/en/pricing/warranty` },
};

export default async function WarrantyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const warranty = await getWarrantyTerms();

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} weight="bold" aria-hidden="true" /> Back to Pricing
          </Link>
          <div className="mt-5 flex items-start gap-4">
            <span
              className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--surface-strong)] text-[color:var(--brand-deep)] sm:flex"
              aria-hidden="true"
            >
              <ShieldCheck size={30} weight="duotone" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
                Dental Services Warranty Program
              </p>
              <h1 className="mt-2 font-display text-4xl leading-none text-[color:var(--text-main)] sm:text-5xl">
                Warranty Terms
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        {!warranty ? (
          // Fail-loud: content couldn't be loaded — show a clear notice, never blank.
          <div className="rounded-2xl border border-[color:var(--brand-soft)] bg-[color:var(--surface)] px-6 py-8 text-center">
            <p className="text-base text-[color:var(--text-main)]">
              Our warranty terms are being updated. Please{" "}
              <Link href="/contact" className="font-semibold text-[color:var(--brand)] hover:text-[color:var(--brand-deep)]">
                contact us
              </Link>{" "}
              and our team will be glad to walk you through your warranty coverage.
            </p>
          </div>
        ) : (
          <div className="space-y-12 sm:space-y-16">
            {/* Intro */}
            {warranty.intro && (
              <p className="text-base leading-8 text-[color:var(--text-soft)]">{warranty.intro}</p>
            )}

            {/* Coverage period table */}
            {warranty.coverageRows.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-[color:var(--text-main)] sm:text-3xl">
                  Warranty Coverage Period
                </h2>
                <div className="mt-5 overflow-x-auto rounded-2xl border border-[color:var(--brand-soft)] bg-white shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                  <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-[color:var(--brand-soft)] bg-[color:var(--surface)]/60">
                        <th className="px-5 py-3.5 font-semibold uppercase tracking-[0.14em] text-xs text-[color:var(--text-soft)]">
                          Treatment
                        </th>
                        <th className="px-5 py-3.5 font-semibold uppercase tracking-[0.14em] text-xs text-[color:var(--text-soft)]">
                          Coverage
                        </th>
                        <th className="px-5 py-3.5 font-semibold uppercase tracking-[0.14em] text-xs text-[color:var(--text-soft)]">
                          Warranty Period
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[color:var(--brand-soft)]">
                      {warranty.coverageRows.map((row, i) => (
                        <tr key={i}>
                          <td className="px-5 py-3.5 font-semibold text-[color:var(--text-main)]">{row.treatment}</td>
                          <td className="px-5 py-3.5 text-[color:var(--text-soft)]">{row.coverage}</td>
                          <td className="px-5 py-3.5 font-bold text-[color:var(--brand-deep)]">{row.period}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Covered / Not covered */}
            <div className="grid gap-6 lg:grid-cols-2">
              {warranty.covered.length > 0 && (
                <section className="rounded-2xl border border-[color:var(--brand-soft)] bg-white p-6 shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                  <h2 className="flex items-center gap-2 font-display text-xl text-[color:var(--text-main)]">
                    <CheckCircle size={22} weight="fill" className="text-emerald-600" aria-hidden="true" />
                    What Is Covered
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {warranty.covered.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-[color:var(--text-soft)]">
                        <CheckCircle size={16} weight="bold" className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {warranty.notCovered.length > 0 && (
                <section className="rounded-2xl border border-[color:var(--brand-soft)] bg-white p-6 shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                  <h2 className="flex items-center gap-2 font-display text-xl text-[color:var(--text-main)]">
                    <XCircle size={22} weight="fill" className="text-[color:var(--brand)]" aria-hidden="true" />
                    What Is Not Covered
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {warranty.notCovered.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-[color:var(--text-soft)]">
                        <XCircle size={16} weight="bold" className="mt-0.5 shrink-0 text-[color:var(--brand)]" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Validity conditions */}
            {warranty.validityConditions.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 font-display text-2xl text-[color:var(--text-main)] sm:text-3xl">
                  <ClipboardText size={26} weight="duotone" className="text-[color:var(--brand-deep)]" aria-hidden="true" />
                  Conditions for Warranty Validity
                </h2>
                <p className="mt-3 text-sm text-[color:var(--text-soft)]">To maintain warranty coverage, patients must:</p>
                <ol className="mt-4 space-y-3">
                  {warranty.validityConditions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-[color:var(--text-soft)]">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--surface-strong)] text-xs font-bold text-[color:var(--brand-deep)]">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{item}</span>
                    </li>
                  ))}
                </ol>
                {warranty.validityNote && (
                  <p className="mt-4 rounded-xl border border-[color:var(--brand-soft)] bg-[color:var(--surface)] px-4 py-3 text-sm font-medium text-[color:var(--text-main)]">
                    {warranty.validityNote}
                  </p>
                )}
              </section>
            )}

            {/* Post-warranty benefit */}
            {(warranty.postWarrantyIntro || warranty.postWarrantyBenefit || warranty.postWarrantyTerms.length > 0) && (
              <section className="rounded-3xl border border-[color:var(--brand-soft)] bg-[color:var(--surface)] p-6 sm:p-8">
                <h2 className="flex items-center gap-2 font-display text-2xl text-[color:var(--text-main)] sm:text-3xl">
                  <Sparkle size={26} weight="duotone" className="text-[color:var(--brand-deep)]" aria-hidden="true" />
                  Post-Warranty Benefit
                </h2>
                {warranty.postWarrantyIntro && (
                  <p className="mt-4 text-base leading-8 text-[color:var(--text-soft)]">{warranty.postWarrantyIntro}</p>
                )}
                {warranty.postWarrantyBenefit && (
                  <p className="mt-3 text-base leading-8 text-[color:var(--text-main)]">{warranty.postWarrantyBenefit}</p>
                )}
                {warranty.postWarrantyTerms.length > 0 && (
                  <>
                    <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--brand)]">
                      Terms and Conditions for Post-Warranty Benefit
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {warranty.postWarrantyTerms.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-[color:var(--text-soft)]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand-light)]" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </section>
            )}

            {/* Limitation + Non-transferability + Clinical assessment */}
            <div className="space-y-8">
              {warranty.limitationOfLiability && (
                <section className="flex items-start gap-4">
                  <Scales size={24} weight="duotone" className="mt-1 shrink-0 text-[color:var(--brand-deep)]" aria-hidden="true" />
                  <div>
                    <h2 className="font-display text-xl text-[color:var(--text-main)]">Limitation of Liability</h2>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">{warranty.limitationOfLiability}</p>
                  </div>
                </section>
              )}
              {warranty.nonTransferability && (
                <section className="flex items-start gap-4">
                  <UserCircle size={24} weight="duotone" className="mt-1 shrink-0 text-[color:var(--brand-deep)]" aria-hidden="true" />
                  <div>
                    <h2 className="font-display text-xl text-[color:var(--text-main)]">Non-Transferability</h2>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">{warranty.nonTransferability}</p>
                  </div>
                </section>
              )}
              {warranty.clinicalAssessment && (
                <section className="flex items-start gap-4">
                  <Stethoscope size={24} weight="duotone" className="mt-1 shrink-0 text-[color:var(--brand-deep)]" aria-hidden="true" />
                  <div>
                    <h2 className="font-display text-xl text-[color:var(--text-main)]">Clinical Assessment</h2>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">{warranty.clinicalAssessment}</p>
                  </div>
                </section>
              )}
            </div>

            {/* Contact + discrepancy note */}
            <section className="rounded-3xl bg-[color:var(--brand)] p-8 text-white sm:p-10">
              <h2 className="font-display text-2xl">Questions about your warranty?</h2>
              <p className="mt-2 max-w-xl text-sm leading-7 text-white/80">
                Our team is happy to explain your coverage and help with any warranty claim.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                {warranty.contactEmail && (
                  <a
                    href={`mailto:${warranty.contactEmail}`}
                    className="inline-flex items-center gap-2 font-semibold hover:text-white/90"
                  >
                    <EnvelopeSimple size={16} weight="fill" aria-hidden="true" /> {warranty.contactEmail}
                  </a>
                )}
                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[color:var(--brand)] transition hover:bg-white/90"
                >
                  Contact Us
                </Link>
              </div>
            </section>

            {warranty.discrepancyNote && (
              <p className="text-center text-xs italic text-[color:var(--text-soft)]">{warranty.discrepancyNote}</p>
            )}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
