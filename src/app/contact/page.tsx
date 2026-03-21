"use client";

import { useState } from "react";
import { SiteShell } from "@/components/site/site-shell";

const BRANCHES = [
  {
    name: "Phsar Thmey (Main Branch)",
    address: "No.4, Street 184, Sangkat Phsar Thmey 3, Khan Daun Penh",
    phone: "+855 23 211 338",
    hours: "Mon – Sat: 8:00 am – 7:00 pm",
  },
  {
    name: "Toul Kork Branch",
    address: "Phnom Penh, Cambodia",
    phone: "+855 11 811 338",
    hours: "Mon – Sat: 8:00 am – 7:00 pm",
  },
  {
    name: "Boeung Keng Kang Branch",
    address: "Phnom Penh, Cambodia",
    phone: "+855 69 811 338",
    hours: "Mon – Sat: 8:00 am – 7:00 pm",
  },
];

const SERVICES = [
  "Dental Implants",
  "Crowns & Bridges",
  "Orthodontics (Braces / Clear Aligner)",
  "Cosmetic Dentistry",
  "Full Mouth Reconstruction",
  "Oral Surgery",
  "Teeth Whitening",
  "Paediatric Dentistry",
  "Sleep Apnea Treatment",
  "General Dentistry / Check-up",
  "Other",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: wire up to /api/enquiry when server action / API route is added
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setSubmitting(false);
  }

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

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-start gap-4 rounded-[2rem] border border-[--border-strong] bg-[--surface] p-10">
                <span className="text-4xl" aria-hidden="true">✓</span>
                <h2 className="font-display text-3xl text-[--text-main]">
                  Thanks, we&apos;ll be in touch!
                </h2>
                <p className="text-sm leading-7 text-[--text-soft]">
                  Your enquiry has been received. A member of our team will contact you within one
                  business day to confirm your appointment or answer your questions.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary mt-2"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[--text-soft]">
                      Full Name <span className="text-[--brand]">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className="w-full rounded-xl border border-[--border-strong] bg-white px-4 py-3 text-sm text-[--text-main] placeholder-[--text-soft]/50 outline-none transition focus:border-[--brand] focus:ring-2 focus:ring-[--brand]/20"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[--text-soft]">
                      Email <span className="text-[--brand]">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="w-full rounded-xl border border-[--border-strong] bg-white px-4 py-3 text-sm text-[--text-main] placeholder-[--text-soft]/50 outline-none transition focus:border-[--brand] focus:ring-2 focus:ring-[--brand]/20"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[--text-soft]">
                      Phone / WhatsApp
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className="w-full rounded-xl border border-[--border-strong] bg-white px-4 py-3 text-sm text-[--text-main] placeholder-[--text-soft]/50 outline-none transition focus:border-[--brand] focus:ring-2 focus:ring-[--brand]/20"
                      placeholder="+855 ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="country" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[--text-soft]">
                      Country
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      autoComplete="country-name"
                      className="w-full rounded-xl border border-[--border-strong] bg-white px-4 py-3 text-sm text-[--text-main] placeholder-[--text-soft]/50 outline-none transition focus:border-[--brand] focus:ring-2 focus:ring-[--brand]/20"
                      placeholder="Cambodia"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="service" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[--text-soft]">
                    Treatment Needed
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full rounded-xl border border-[--border-strong] bg-white px-4 py-3 text-sm text-[--text-main] outline-none transition focus:border-[--brand] focus:ring-2 focus:ring-[--brand]/20"
                  >
                    <option value="">Select a treatment (optional)</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="date" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[--text-soft]">
                    Preferred Appointment Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="text"
                    className="w-full rounded-xl border border-[--border-strong] bg-white px-4 py-3 text-sm text-[--text-main] placeholder-[--text-soft]/50 outline-none transition focus:border-[--brand] focus:ring-2 focus:ring-[--brand]/20"
                    placeholder="e.g. Any Monday morning, or a specific date"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[--text-soft]">
                    Message <span className="text-[--brand]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full resize-none rounded-xl border border-[--border-strong] bg-white px-4 py-3 text-sm text-[--text-main] placeholder-[--text-soft]/50 outline-none transition focus:border-[--brand] focus:ring-2 focus:ring-[--brand]/20"
                    placeholder="Tell us about your dental concerns or what you're hoping to achieve..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send Enquiry"}
                </button>

                <p className="text-center text-xs text-[--text-soft]">
                  We respond within one business day. Your information is kept private.
                </p>
              </form>
            )}
          </div>

          {/* Branch info */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl text-[--text-main]">Our Branches</h2>
            {BRANCHES.map((branch) => (
              <div
                key={branch.name}
                className="rounded-[1.75rem] border border-[--border-strong] bg-[--surface] p-5"
              >
                <p className="font-semibold text-[--text-main]">{branch.name}</p>
                <p className="mt-1 text-sm leading-6 text-[--text-soft]">{branch.address}</p>
                <p className="mt-1 text-sm text-[--text-soft]">{branch.phone}</p>
                <p className="mt-1 text-xs text-[--text-soft]/70">{branch.hours}</p>
              </div>
            ))}

            {/* Messaging links */}
            <div className="rounded-[1.75rem] border border-[--border-strong] bg-[--brand-soft] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--brand-deep]">
                Message Us
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <a
                  href="https://t.me/roomchang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[--brand-deep] hover:text-[--brand]"
                >
                  <span aria-hidden="true">✈</span> Telegram
                </a>
                <a
                  href="https://wa.me/85511811338"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[--brand-deep] hover:text-[--brand]"
                >
                  <span aria-hidden="true">💬</span> WhatsApp
                </a>
                <a
                  href="https://m.me/roomchang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[--brand-deep] hover:text-[--brand]"
                >
                  <span aria-hidden="true">💬</span> Facebook Messenger
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
