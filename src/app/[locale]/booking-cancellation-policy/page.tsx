import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Booking & Cancellation Policy | Roomchang Dental Hospital",
  description:
    "Learn how appointment requests, confirmations, rescheduling, and cancellations work at Roomchang Dental Hospital in Phnom Penh.",
};

export default function BookingCancellationPolicyPage() {
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
            Booking &amp; Cancellation Policy
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
              Appointment Requests
            </h2>
            <p>
              The Roomchang Dental Hospital website accepts appointment requests
              through the contact and booking form. A request is not a confirmed
              appointment until a Roomchang team member contacts you and confirms the
              details.
            </p>
            <p>
              We usually respond within about one business day. Response times may vary
              depending on clinic workload, public holidays, the complexity of your
              request, and the contact details provided.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Information Needed
            </h2>
            <p>
              To help us review your request, please provide accurate contact details
              and relevant preferences, such as your treatment interest, preferred
              branch, preferred doctor, preferred date, and any important notes about
              your visit.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Rescheduling and Cancellations
            </h2>
            <p>
              If you need to reschedule or cancel, please contact the clinic as soon as
              possible by phone, WhatsApp, Telegram, or email. Early notice helps us
              offer the appointment time to another patient and arrange a new time for
              you.
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Email: contact@roomchang.com</li>
              <li>Phone: +855 69 811 338</li>
              <li>Phone: +855 11 811 338, available 24/7</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Clinic Hours
            </h2>
            <p>
              Roomchang Dental Hospital clinic hours are Monday to Saturday, 08:00 to
              17:30. Appointment availability may vary by branch, doctor, treatment,
              and clinical schedule.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Location
            </h2>
            <p>
              Roomchang Dental Hospital is located at No. 4, Street 184, Phnom Penh,
              Cambodia. The hospital has served local and international dental patients
              since 1996.
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
