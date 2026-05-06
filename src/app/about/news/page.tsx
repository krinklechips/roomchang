import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Events | Roomchang Dental Hospital",
  description:
    "The latest news, events, and announcements from Roomchang Dental Hospital in Phnom Penh.",
};

export default function NewsPage() {
  return (
    <SiteShell>
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> About
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            News & Events
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            Stay updated with the latest news, events, and announcements from Roomchang Dental Hospital.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-3xl border border-[color:var(--border-strong)] bg-white p-12 text-center">
          <p className="font-display text-2xl text-[color:var(--text-main)]">Coming Soon</p>
          <p className="mt-3 text-sm text-[color:var(--text-soft)]">
            We are preparing our news and events section. Check back soon for updates.
          </p>
          <Link href="/about" className="btn-secondary mt-6 inline-block">Back to About</Link>
        </div>
      </div>
    </SiteShell>
  );
}
