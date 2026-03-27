import { SiteShell } from "@/components/site/site-shell";
import { getBranches } from "@/lib/data";
import { ContactForm } from "./contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Appointments | Roomchang Dental Hospital",
  description:
    "Book an appointment at Roomchang Dental Hospital. Five branches across Phnom Penh with 24/7 emergency line.",
};

export default async function ContactPage() {
  const branches = await getBranches();

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[--brand]">
            Get In Touch
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">
            Contact & Appointments
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[--text-soft]">
            Fill in the form and one of our team will be in touch within one business day. For
            urgent enquiries, call us directly — we have a 24/7 line.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <a
              href="tel:+85523211338"
              className="inline-flex items-center gap-2 font-semibold text-[--brand-deep] hover:text-[--brand]"
            >
              <span aria-hidden="true">📞</span> +855 23 211 338
            </a>
            <a
              href="tel:+85511811338"
              className="inline-flex items-center gap-2 font-semibold text-[--brand-deep] hover:text-[--brand]"
            >
              <span aria-hidden="true">📱</span> +855 11 811 338 (24/7)
            </a>
            <a
              href="mailto:contact@roomchang.com"
              className="inline-flex items-center gap-2 font-semibold text-[--brand-deep] hover:text-[--brand]"
            >
              <span aria-hidden="true">✉</span> contact@roomchang.com
            </a>
          </div>
        </div>
      </div>

      <ContactForm branches={branches} />
    </SiteShell>
  );
}
