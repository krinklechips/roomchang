import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Privacy Policy | Roomchang Dental Hospital",
  description:
    "Learn how Roomchang Dental Hospital collects, uses, stores, and protects information submitted through its website forms and appointment enquiries.",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
              Who We Are
            </h2>
            <p>
              Roomchang Dental Hospital is a dental hospital founded in 1996 in
              Phnom Penh, Cambodia. We serve local and international patients through
              a multilingual website in English, Chinese, and Khmer.
            </p>
            <p>
              Our main address is No. 4, Street 184, Phnom Penh, Cambodia. You can
              contact us at contact@roomchang.com, +855 69 811 338, or +855 11 811
              338, which is available 24/7.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Information We Collect
            </h2>
            <p>
              When you submit an enquiry or appointment request through this website,
              we may collect the information you choose to provide, including:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Name, email address, phone, WhatsApp, Telegram, or WeChat details.</li>
              <li>Country, treatment interest, preferred branch, preferred doctor, and preferred date.</li>
              <li>Any message or notes you include with your request.</li>
            </ul>
            <p>
              We may also receive a first-party referral code if you arrived through a
              valid Roomchang referral link.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              How We Use Information
            </h2>
            <p>
              We use submitted information to respond to enquiries, manage appointment
              requests, coordinate with the relevant clinic team, and improve the way
              we support patients before their visit.
            </p>
            <p>
              Website form submissions are stored securely in Supabase, and notification
              emails are sent to the clinic so that the team can follow up. We do not
              sell your personal information to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Clinical Records
            </h2>
            <p>
              This policy covers information submitted through the website. Clinical,
              dental, and medical records created during care at Roomchang Dental
              Hospital are governed separately by the hospital&apos;s medical record
              practices.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Your Rights
            </h2>
            <p>
              You may ask to access, correct, or delete personal information submitted
              through the website by contacting contact@roomchang.com. We may need to
              verify your request before making changes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Contact
            </h2>
            <p>
              For privacy questions, contact Roomchang Dental Hospital at
              contact@roomchang.com or by phone at +855 69 811 338 or +855 11 811
              338.
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
