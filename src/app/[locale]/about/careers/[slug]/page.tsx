import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, Check, Mail, Phone } from "lucide-react";
import { POSITIONS, getPositionBySlug } from "@/lib/careers";
import type { Metadata } from "next";

export function generateStaticParams() {
  return POSITIONS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pos = getPositionBySlug(slug);
  if (!pos) return {};
  return {
    title: `${pos.title} | Careers | Roomchang Dental Hospital`,
    description: pos.shortDescription,
  };
}

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pos = getPositionBySlug(slug);
  if (!pos) notFound();

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about/careers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> All Positions
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-deep)]">
              {pos.category}
            </span>
          </div>
          <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            {pos.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            {pos.shortDescription}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Main content */}
          <div>
            {/* Requirements */}
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--brand)]">
              Requirements
            </h2>
            <ul className="mt-5 space-y-3">
              {pos.requirements.map((req) => (
                <li
                  key={req}
                  className="flex items-start gap-3 text-sm leading-7 text-[color:var(--text-soft)]"
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                    <Check size={11} strokeWidth={3} aria-hidden="true" />
                  </span>
                  {req}
                </li>
              ))}
            </ul>

            {/* Benefits */}
            {pos.benefits && (
              <>
                <h2 className="mt-10 text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--brand)]">
                  Benefits
                </h2>
                <ul className="mt-5 space-y-3">
                  {pos.benefits.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-sm leading-7 text-[color:var(--text-soft)]"
                    >
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                        <Check size={11} strokeWidth={3} aria-hidden="true" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Sidebar — How to Apply */}
          <div className="lg:mt-0">
            <div className="sticky top-28 rounded-3xl border border-[color:var(--border-strong)] bg-white p-8 shadow-[0_12px_40px_rgba(57,28,45,0.05)]">
              <h3 className="font-display text-xl text-[color:var(--text-main)]">How to Apply</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                Send your resume with related references and a cover letter to our HR team.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                    <Mail size={15} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-[color:var(--text-main)]">
                      hr@roomchang.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                    <Phone size={15} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                      Phone
                    </p>
                    <p className="text-sm font-semibold text-[color:var(--text-main)]">
                      098 843 322
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/contact" className="btn-primary mt-6 w-full justify-center">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Other positions */}
        <div className="mt-16 border-t border-[color:var(--border-strong)] pt-12">
          <h2 className="font-display text-2xl text-[color:var(--text-main)]">
            Other Positions
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POSITIONS.filter((p) => p.slug !== pos.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/about/careers/${other.slug}`}
                className="group rounded-2xl border border-[color:var(--border-strong)] bg-white px-6 py-5 transition hover:border-[color:var(--brand-light)] hover:shadow-[0_8px_24px_rgba(57,28,45,0.08)]"
              >
                <span className="rounded-full bg-[color:var(--surface)] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[color:var(--text-soft)]">
                  {other.category}
                </span>
                <h3 className="mt-2 font-display text-lg text-[color:var(--text-main)] group-hover:text-[color:var(--brand-deep)]">
                  {other.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[color:var(--text-soft)]">
                  {other.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
