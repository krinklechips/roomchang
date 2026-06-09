import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terms of Service | Roomchang Dental Hospital",
  description:
    "Read the terms that apply when using the Roomchang Dental Hospital website, including informational content, intellectual property, and liability limits.",
};

export default function TermsOfServicePage() {
  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> Home
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            Terms of Service
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
        <div className="space-y-8 text-base leading-8 text-[color:var(--text-soft)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--brand)]">
            Last updated: June 2026
          </p>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Agreement to These Terms
            </h2>
            <p>
              These Terms of Service apply to your use of the Roomchang Dental
              Hospital website. Roomchang Dental Hospital was founded in 1996 and is
              located at No. 4, Street 184, Phnom Penh, Cambodia.
            </p>
            <p>
              By using this website, you agree to use it lawfully and in a way that
              does not interfere with the site, its security, or other users.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Website Content
            </h2>
            <p>
              The content on this website is provided for general information about
              dental care, Roomchang Dental Hospital, and available services. It is
              not a substitute for professional dental, medical, or clinical advice.
            </p>
            <p>
              No doctor-patient relationship is created by viewing this website,
              submitting a form, sending a message, or receiving a general response
              through the website. A clinical relationship begins only through
              appropriate consultation and acceptance by the hospital team.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Appointment Requests
            </h2>
            <p>
              Website forms allow you to request information or ask for an appointment.
              Submitting a request does not guarantee a booking, treatment availability,
              a specific doctor, or a specific appointment time. A Roomchang team
              member will confirm details with you directly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Intellectual Property
            </h2>
            <p>
              The website design, text, images, logos, service descriptions, and other
              content are owned by or licensed to Roomchang Dental Hospital unless
              otherwise stated. You may view the site for personal, informational use,
              but you may not copy, reuse, or distribute website content without
              permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Limitation of Liability
            </h2>
            <p>
              We aim to keep website information accurate and available, but we do not
              guarantee that the website will always be complete, current, error-free,
              or uninterrupted. To the extent permitted by law, Roomchang Dental
              Hospital is not liable for losses arising from website use, reliance on
              general website content, or technical issues outside our reasonable
              control.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Governing Law
            </h2>
            <p>
              These terms are governed by the laws of the Kingdom of Cambodia.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Contact
            </h2>
            <p>
              Questions about these terms may be sent to contact@roomchang.com or
              directed to +855 69 811 338 or +855 11 811 338.
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
