import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cookie Policy | Roomchang Dental Hospital",
  description:
    "Review the cookies, anonymous analytics, and browser storage used by the Roomchang Dental Hospital website, including referral and preview cookies.",
};

export default function CookiePolicyPage() {
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
            Cookie Policy
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
              How This Website Uses Cookies
            </h2>
            <p>
              This policy explains the cookies and browser storage used by the
              Roomchang Dental Hospital website. Essential cookies are needed for
              parts of the site to function correctly. We do not use third-party
              advertising or marketing cookies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Essential Cookies
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <span className="font-semibold text-[color:var(--text-main)]">rc_ref:</span>{" "}
                a first-party, HTTP-only referral cookie set when a valid Roomchang
                referral code is present in the website URL. It lasts for about 30
                days and helps connect website enquiries with the referral source.
              </li>
              <li>
                <span className="font-semibold text-[color:var(--text-main)]">rc_preview_session:</span>{" "}
                a first-party, HTTP-only cookie used to protect CMS preview access
                for authorized users. It is not used for public advertising or
                marketing.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Analytics and Performance
            </h2>
            <p>
              The website uses Vercel Web Analytics and Vercel Speed Insights to
              understand aggregate traffic and performance. These tools provide
              anonymous, aggregate measurements and do not collect personally
              identifiable information through this website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Browser Storage
            </h2>
            <p>
              The chatbot uses browser storage to improve the chat experience. The
              <span className="font-semibold text-[color:var(--text-main)]"> rc-bubble-seen</span>{" "}
              sessionStorage key remembers that the chat prompt has been shown or
              dismissed during the current browser session. The
              <span className="font-semibold text-[color:var(--text-main)]"> rc-chatbot-session</span>{" "}
              localStorage key temporarily keeps recent chatbot messages for about 30
              minutes so a conversation can continue if the page reloads.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Managing Cookies
            </h2>
            <p>
              You can control cookies and browser storage through your browser
              settings. Blocking essential cookies or clearing storage may affect
              referral tracking, preview access, or chatbot convenience features, but
              the public website should remain generally accessible.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              Contact
            </h2>
            <p>
              For questions about this Cookie Policy, contact Roomchang Dental
              Hospital at contact@roomchang.com, +855 69 811 338, or +855 11 811
              338.
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
