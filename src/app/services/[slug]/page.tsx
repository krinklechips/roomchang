import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { Check } from "lucide-react";
import { getServiceBySlug, getServices, type ServiceSection } from "@/lib/data";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.name} | Roomchang Dental Hospital`,
    description: service.description ?? undefined,
  };
}

// ─── Section renderers ───────────────────────────────────────────────────────

function Callout({ s }: { s: Extract<ServiceSection, { type: "callout" }> }) {
  return (
    <div className="rounded-3xl bg-[color:var(--brand-soft)] px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {s.icon && <div className="shrink-0 text-3xl">{s.icon}</div>}
        <div className="flex-1">
          <p className="font-semibold text-[color:var(--brand-deep)]">{s.title}</p>
          <p className="mt-1 text-sm leading-7 text-[--text-soft]">{s.body}</p>
        </div>
      </div>
      {s.stats && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {s.stats.map((st) => (
            <div key={st.label} className="rounded-2xl bg-white/60 px-4 py-3 text-center">
              <p className="text-xl font-bold text-[color:var(--brand-deep)]">{st.value}</p>
              <p className="mt-1 text-xs text-[--text-soft]">{st.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TextBlock({ s }: { s: Extract<ServiceSection, { type: "text" }> }) {
  const inner = (
    <>
      <h2 className="font-display text-2xl text-[--text-main]">{s.heading}</h2>
      <div className="mt-3 text-sm leading-7 text-[--text-soft] space-y-3">
        {String(s.body).split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </>
  );
  return s.card ? (
    <div className="rounded-3xl border border-[--border-strong] bg-white p-8">{inner}</div>
  ) : (
    <div>{inner}</div>
  );
}

function BulletList({ s }: { s: Extract<ServiceSection, { type: "list" }> }) {
  return (
    <div>
      {s.heading && <h2 className="font-display text-3xl text-[--text-main] mb-6">{s.heading}</h2>}
      <div className="grid gap-3 sm:grid-cols-2">
        {s.items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl border border-[--border-strong] bg-white px-5 py-4">
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-[color:var(--brand)] text-white flex items-center justify-center"><Check size={9} strokeWidth={3.5} aria-hidden="true" /></span>
            <span className="text-sm leading-6 text-[--text-soft]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cards({ s }: { s: Extract<ServiceSection, { type: "cards" }> }) {
  const cols = s.columns ?? 3;
  const gridClass =
    cols === 2 ? "sm:grid-cols-2" :
    cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" :
    "sm:grid-cols-3";
  return (
    <div>
      <h2 className="font-display text-3xl text-[--text-main]">{s.heading}</h2>
      {s.subheading && <p className="mt-3 text-sm text-[--text-soft]">{s.subheading}</p>}
      <div className={`mt-8 grid gap-6 ${gridClass}`}>
        {s.items.map((item, i) => (
          <div key={item.title} className="rounded-2xl border border-[--border-strong] bg-white p-6">
            {s.numbered && (
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--brand)] text-white text-sm font-bold">
                {i + 1}
              </div>
            )}
            {item.icon && !s.numbered && (
              <div className="mb-3 text-3xl">{item.icon}</div>
            )}
            {item.badge && (
              <span className="mb-2 inline-block rounded-full bg-[color:var(--brand-soft)] px-2.5 py-0.5 text-xs font-semibold text-[color:var(--brand-deep)]">
                {item.badge}
              </span>
            )}
            <h3 className="font-display text-xl text-[--text-main]">{item.title}</h3>
            {item.spec && (
              <p className="mt-1 text-xs font-semibold text-[color:var(--brand)]">{item.spec}</p>
            )}
            {item.tag && (
              <span className="mt-1 inline-block rounded-full bg-[color:var(--brand-soft)] px-2 py-0.5 text-xs font-medium text-[color:var(--brand-deep)]">
                {item.tag}
              </span>
            )}
            <p className="mt-2 text-sm leading-7 text-[--text-soft]">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Steps({ s }: { s: Extract<ServiceSection, { type: "steps" }> }) {
  return (
    <div>
      <h2 className="font-display text-3xl text-[--text-main]">{s.heading}</h2>
      {s.subheading && <p className="mt-3 text-sm text-[--text-soft]">{s.subheading}</p>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {s.items.map((item) => (
          <div key={item.step} className="rounded-2xl border border-[--border-strong] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">{item.step}</p>
            <p className="mt-2 text-sm leading-7 text-[--text-soft]">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingTable({ s }: { s: Extract<ServiceSection, { type: "pricing" }> }) {
  return (
    <div>
      {s.heading && <h2 className="font-display text-3xl text-[--text-main]">{s.heading}</h2>}
      {s.subheading && <p className="mt-3 text-sm text-[--text-soft] mb-8">{s.subheading}</p>}
      <div className="overflow-hidden rounded-2xl border border-[--border-strong]">
        <table className="w-full text-sm">
          <thead className="bg-[--surface]">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-[--text-main]">Treatment</th>
              <th className="px-6 py-4 text-right font-semibold text-[--text-main]">Price (USD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[--border-strong] bg-white">
            {s.rows.map((row) => (
              <tr key={row.treatment}>
                <td className="px-6 py-4 text-[--text-soft]">{row.treatment}</td>
                <td className="px-6 py-4 text-right font-semibold text-[--text-main]">{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RenderSection({ s }: { s: ServiceSection }) {
  if (s.type === "callout") return <Callout s={s} />;
  if (s.type === "text") return <TextBlock s={s} />;
  if (s.type === "list") return <BulletList s={s} />;
  if (s.type === "cards") return <Cards s={s} />;
  if (s.type === "steps") return <Steps s={s} />;
  if (s.type === "pricing") return <PricingTable s={s} />;
  if (s.type === "twocol") {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <RenderSection s={s.left} />
        <RenderSection s={s.right} />
      </div>
    );
  }
  return null;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const sections = service.content?.sections ?? [];

  return (
    <SiteShell>
      {/* Hero */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          {service.eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
              {service.eyebrow}
            </p>
          )}
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">
            {service.name}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            {service.heroDescription ?? service.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Book a Consultation</Link>
            <Link href="/services" className="btn-secondary">All Services</Link>
          </div>
        </div>
      </div>

      {/* Sections */}
      {sections.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 space-y-16">
          {sections.map((s, i) => (
            <RenderSection key={i} s={s} />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="border-t border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-[--text-main]">Ready to restore your smile?</h2>
            <p className="mt-2 text-sm text-[--text-soft]">
              Call us on{" "}
              <a href="tel:+85523211338" className="font-semibold text-[color:var(--brand)]">
                +855 23 211 338
              </a>{" "}
              or send an enquiry and we&apos;ll get back to you within one business day.
            </p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">Book a Consultation</Link>
        </div>
      </div>
    </SiteShell>
  );
}
