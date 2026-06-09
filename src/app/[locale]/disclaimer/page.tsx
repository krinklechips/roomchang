import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Disclaimer | Roomchang Dental Hospital",
  description:
    "Understand the medical and informational limits of the Roomchang Dental Hospital website, including dental advice, treatment outcomes, and illustrative cases.",
};

export default function DisclaimerPage() {
  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> Home
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            Disclaimer
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="space-y-8 text-base leading-8 text-[color:var(--text-soft)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--brand)]">
            Last updated: June 2026
          </p>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              General Information Only
            </h2>
            <p>
              The information on this website is provided by Roomchang Dental Hospital
              for general educational and informational purposes. It is not medical,
              dental, or clinical advice and should not be used as a substitute for an
              in-person consultation with a qualified dentist or other healthcare
              professional.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Professional Consultation
            </h2>
            <p>
              Dental needs vary from patient to patient. You should consult a qualified
              dentist before starting, changing, or delaying any dental or medical
              treatment. If you have pain, swelling, trauma, infection symptoms, or
              another urgent concern, contact a healthcare professional promptly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Treatment Results
            </h2>
            <p>
              Treatment outcomes depend on many factors, including oral health,
              diagnosis, treatment plan, patient cooperation, and follow-up care.
              Results vary, and no website content can guarantee a specific result.
            </p>
            <p>
              Any before-and-after cases, clinical examples, photographs, or patient
              stories shown on this website are illustrative. They may not represent
              the outcome that every patient can expect.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Website Accuracy
            </h2>
            <p>
              We aim to keep website information clear and current, but dental
              techniques, fees, availability, and service details may change. Please
              contact Roomchang Dental Hospital directly to confirm information that
              may affect your care or appointment.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Contact
            </h2>
            <p>
              Roomchang Dental Hospital is located at No. 4, Street 184, Phnom Penh,
              Cambodia. For questions or appointment enquiries, contact
              contact@roomchang.com, +855 69 811 338, or +855 11 811 338.
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
