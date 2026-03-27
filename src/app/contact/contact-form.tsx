"use client";

import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import type { Branch } from "@/lib/data";

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

export function ContactForm({ branches }: { branches: Branch[] }) {
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
                    {branches.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[--text-soft]">
                  Preferred Appointment Date
                </label>
                <DatePicker name="date" />
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
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="rounded-[1.75rem] border border-[--border-strong] bg-[--surface] p-5"
            >
              <p className="font-semibold text-[--text-main]">{branch.name}</p>
              <p className="mt-1 text-sm leading-6 text-[--text-soft]">{branch.address}</p>
              <p className="mt-1 text-sm text-[--text-soft]">{branch.phone}</p>
              {branch.mobile && (
                <p className="text-sm text-[--text-soft]">{branch.mobile}</p>
              )}
              {branch.email && (
                <p className="text-sm text-[--text-soft]">{branch.email}</p>
              )}
              <p className="mt-1 text-xs text-[--text-soft]/70">{branch.hours}</p>
            </div>
          ))}

          {/* Messaging links */}
          <div className="rounded-[1.75rem] border border-[--border-strong] bg-[--brand-soft] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--brand-deep]">
              Message Us
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {[
                {
                  label: "Facebook Messenger",
                  href: "https://m.me/roomchangdental",
                  bg: "bg-gradient-to-br from-[#0078FF] to-[#A334FA]",
                  icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.921 1.458 5.527 3.742 7.237V22l3.405-1.869c.91.252 1.872.388 2.853.388 5.523 0 10-4.145 10-9.276S17.523 2 12 2zm.99 12.49-2.548-2.718-4.973 2.718 5.473-5.808 2.611 2.718 4.91-2.718-5.473 5.808z" /></svg>,
                },
                {
                  label: "WhatsApp",
                  href: "https://api.whatsapp.com/send/?phone=85569811338&text=",
                  bg: "bg-[#25D366]",
                  icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>,
                },
                {
                  label: "Telegram",
                  href: "https://telegram.me/roomchang",
                  bg: "bg-[#2AABEE]",
                  icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>,
                },
              ].map(({ label, href, bg, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm font-semibold text-[color:var(--text-main)] transition hover:text-[color:var(--brand)]"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${bg}`}>
                    {icon}
                  </span>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
