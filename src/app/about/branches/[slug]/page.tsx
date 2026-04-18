import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, Phone, Clock, MapPin, Navigation } from "lucide-react";
import { BRANCHES, getBranchBySlug } from "@/lib/branches";
import type { Metadata } from "next";

export function generateStaticParams() {
  return BRANCHES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);
  if (!branch) return {};
  return {
    title: `${branch.shortName} | Roomchang Dental Hospital`,
    description: `${branch.description} ${branch.address}, ${branch.addressLine2 ?? "Phnom Penh"}.`,
  };
}

export default async function BranchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);
  if (!branch) notFound();

  // Google Maps embed URL (no API key needed for search-based embed)
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(branch.mapQuery)}&output=embed&hl=en`;

  // Directions URL
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${branch.mapDirectionsQuery}`;

  // Other branches for "Also nearby" section
  const otherBranches = BRANCHES.filter((b) => b.slug !== slug);

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> Our Branches
          </Link>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-[color:var(--brand)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white">
                {branch.badge}
              </span>
              <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
                {branch.shortName}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--text-soft)]">
                {branch.description}
              </p>
            </div>

            {/* Quick info pills */}
            <div className="flex flex-col gap-2 sm:items-end">
              <a
                href={`tel:${branch.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--text-main)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
              >
                <Phone size={14} strokeWidth={2} className="text-[color:var(--brand)]" />
                {branch.phone}
              </a>
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[color:var(--text-soft)]">
                <Clock size={14} strokeWidth={2} className="text-[color:var(--brand)]" />
                {branch.hours}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] xl:gap-12">

          {/* Left — photo + map */}
          <div className="flex flex-col gap-6">
            {/* Branch photo */}
            <div className="relative overflow-hidden rounded-3xl">
              <Image
                src={branch.imageSrc}
                alt={branch.imageAlt}
                width={900}
                height={520}
                className="h-72 w-full object-cover sm:h-[28rem]"
                priority
              />
            </div>

            {/* Google Map embed */}
            <div className="overflow-hidden rounded-3xl border border-[color:var(--border-strong)] shadow-[0_8px_32px_rgba(57,28,45,0.06)]">
              <iframe
                title={`Map — ${branch.shortName}`}
                src={mapEmbedUrl}
                width="100%"
                height="380"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Directions CTA */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <Navigation size={16} strokeWidth={2} aria-hidden="true" />
              Get Directions in Google Maps
            </a>
          </div>

          {/* Right — address card + other branches */}
          <div className="flex flex-col gap-6">

            {/* Address card */}
            <div className="rounded-3xl border border-[color:var(--border-strong)] bg-white p-8 shadow-[0_12px_40px_rgba(57,28,45,0.05)]">
              <h2 className="font-display text-2xl text-[color:var(--text-main)]">Visit Us</h2>

              <div className="mt-6 flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                    <MapPin size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--text-soft)]">Address</p>
                    <p className="mt-1 text-sm font-medium leading-6 text-[color:var(--text-main)]">
                      {branch.address}
                    </p>
                    {branch.addressLine2 && (
                      <p className="text-sm text-[color:var(--text-soft)]">{branch.addressLine2}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                    <Clock size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--text-soft)]">Opening Hours</p>
                    <p className="mt-1 text-sm font-medium text-[color:var(--text-main)]">{branch.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                    <Phone size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--text-soft)]">Phone</p>
                    <a
                      href={`tel:${branch.phone.replace(/\s/g, "")}`}
                      className="mt-1 block text-sm font-medium text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
                    >
                      {branch.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Link href="/contact" className="btn-primary w-full justify-center">
                  Book an Appointment
                </Link>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full justify-center"
                >
                  <Navigation size={14} strokeWidth={2} aria-hidden="true" />
                  Get Directions
                </a>
              </div>
            </div>

            {/* Other branches */}
            <div className="rounded-3xl border border-[color:var(--border-strong)] bg-white p-6 shadow-[0_12px_40px_rgba(57,28,45,0.05)]">
              <h3 className="font-display text-lg text-[color:var(--text-main)]">Other Branches</h3>
              <div className="mt-4 flex flex-col gap-2">
                {otherBranches.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/about/branches/${b.slug}`}
                    className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm transition hover:bg-[color:var(--brand-soft)]"
                  >
                    <div>
                      <p className="font-semibold text-[color:var(--text-main)] group-hover:text-[color:var(--brand-deep)]">
                        {b.shortName}
                      </p>
                      <p className="text-xs text-[color:var(--text-soft)]">{b.hours}</p>
                    </div>
                    <ArrowLeft
                      size={14}
                      strokeWidth={2}
                      className="rotate-180 text-[color:var(--text-soft)] transition group-hover:text-[color:var(--brand)]"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </SiteShell>
  );
}
