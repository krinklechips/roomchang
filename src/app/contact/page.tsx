"use client";

import { useState } from "react";
import { SiteShell } from "@/components/site/site-shell";

const BRANCHES = [
  {
    name: "Phsar Thmey (Main Branch)",
    address: "No.4, Street 184 Keo Chea, Sangkat Phsar Thmey 3, Khan Daun Penh",
    phone: "+855 23 211 338",
    hours: "Tue – Sun: 8:00 am – 7:00 pm",
  },
  {
    name: "Fun Mall Branch",
    address: "2nd Floor, Fun Mall, Street 315, Phnom Penh",
    phone: "+855 11 811 338",
    hours: "Tue – Sun: 8:00 am – 8:00 pm",
  },
  {
    name: "Aeon Mall Sen Sok City Branch",
    address: "1st Floor, Aeon Mall Sen Sok City, Street 1003, Phnom Penh",
    phone: "+855 11 811 338",
    hours: "Daily: 8:00 am – 8:00 pm",
  },
  {
    name: "Rose Condo (Bassac Garden City) Branch",
    address: "No.10, Block 252, Bassac Garden City, Tonle Bassac, Chamkarmorn",
    phone: "+855 69 811 338",
    hours: "Tue – Sun: 8:00 am – 7:00 pm",
  },
  {
    name: "PH Euro Park Branch",
    address: "Euro Park, Borey Peng Hout Boeng Snor, National Road 1, Chbar Ampov",
    phone: "+855 69 811 338",
    hours: "Tue – Sun: 8:00 am – 7:00 pm",
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

                <div className="grid gap-6 sm:grid-cols-2">
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
                    <label htmlFor="branch" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[--text-soft]">
                      Preferred Branch
                    </label>
                    <select
                      id="branch"
                      name="branch"
                      className="w-full rounded-xl border border-[--border-strong] bg-white px-4 py-3 text-sm text-[--text-main] outline-none transition focus:border-[--brand] focus:ring-2 focus:ring-[--brand]/20"
                    >
                      <option value="">Any branch (optional)</option>
                      {BRANCHES.map((b) => (
                        <option key={b.name} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="date" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[--text-soft]">
                    Preferred Appointment Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-[--border-strong] bg-white px-4 py-3 text-sm text-[--text-main] outline-none transition focus:border-[--brand] focus:ring-2 focus:ring-[--brand]/20 [color-scheme:light]"
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
              <div className="mt-3 flex flex-col gap-3">
                <a
                  href="https://telegram.me/roomchang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm font-semibold text-[--text-main] transition hover:text-[--brand]"
                >
                  <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="12" fill="#29B6F6"/>
                    <path d="M5.3 11.9l3.5 1.3 1.4 4.3c.1.3.4.4.6.2l1.9-1.6 3.7 2.7c.3.2.7 0 .8-.3l2.4-9.8c.1-.4-.3-.8-.7-.6L5.3 10.8c-.4.2-.4.9 0 1.1z" fill="#fff"/>
                  </svg>
                  Telegram
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=85569811338&text="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm font-semibold text-[--text-main] transition hover:text-[--brand]"
                >
                  <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="12" fill="#25D366"/>
                    <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4C7.5 8 7 9 7 10.4c0 1.5 1 2.9 1.2 3.1.2.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.4.2-.6.2-1.2.2-1.3 0-.2-.2-.3-.2-.4z" fill="#fff"/>
                    <path d="M12 3.9C7.5 3.9 3.9 7.5 3.9 12c0 1.4.4 2.8 1.1 4L3.9 20l4.2-1.1c1.1.6 2.5.9 3.8.9 4.5 0 8.1-3.6 8.1-8.1S16.5 3.9 12 3.9z" stroke="#fff" strokeWidth=".5" fill="none"/>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href="https://m.me/roomchangdental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm font-semibold text-[--text-main] transition hover:text-[--brand]"
                >
                  <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="12" fill="url(#msg-grad)"/>
                    <defs>
                      <linearGradient id="msg-grad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00B2FF"/>
                        <stop offset="1" stopColor="#006AFF"/>
                      </linearGradient>
                    </defs>
                    <path d="M12 5C8.1 5 5 7.9 5 11.5c0 1.9.9 3.6 2.3 4.8V18l2.1-1.2c.5.1 1.1.2 1.6.2 3.9 0 7-2.9 7-6.5S15.9 5 12 5zm.7 8.7l-1.8-1.9-3.5 1.9 3.8-4 1.8 1.9 3.5-1.9-3.8 4z" fill="#fff"/>
                  </svg>
                  Facebook Messenger
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
