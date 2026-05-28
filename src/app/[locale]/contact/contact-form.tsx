"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { DatePicker } from "@/components/ui/date-picker";
import { CheckCircle2 } from "lucide-react";
import type { Branch, Doctor } from "@/lib/data";

const SERVICE_KEYS = [
  "implants",
  "crowns",
  "orthodontics",
  "cosmetic",
  "fullMouth",
  "oralSurgery",
  "endodontics",
  "whitening",
  "paediatric",
  "sleepApnea",
  "general",
  "other",
] as const;

export function ContactForm({ branches, doctors }: { branches: Branch[]; doctors: Doctor[] }) {
  const t = useTranslations("contactForm");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const [preferredDoctor, setPreferredDoctor] = useState("");
  const [doctorQuery, setDoctorQuery] = useState("");
  const [doctorDropdownOpen, setDoctorDropdownOpen] = useState(false);
  const doctorInputRef = useRef<HTMLInputElement>(null);
  const doctorDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const doc = searchParams.get("doctor");
    if (doc) {
      setPreferredDoctor(doc);
      setDoctorQuery(doc);
    }
  }, [searchParams]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        doctorDropdownRef.current &&
        !doctorDropdownRef.current.contains(e.target as Node) &&
        doctorInputRef.current &&
        !doctorInputRef.current.contains(e.target as Node)
      ) {
        setDoctorDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDoctors = useMemo(() => {
    if (!doctorQuery.trim()) return doctors;
    const q = doctorQuery.toLowerCase();
    return doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.some((s) => s.toLowerCase().includes(q)) ||
        d.department.toLowerCase().includes(q)
    );
  }, [doctorQuery, doctors]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = {
      name:      (form.elements.namedItem("name")    as HTMLInputElement).value,
      email:     (form.elements.namedItem("email")   as HTMLInputElement).value,
      phone:     (form.elements.namedItem("phone")   as HTMLInputElement).value,
      country:   (form.elements.namedItem("country") as HTMLInputElement).value,
      wechat:    (form.elements.namedItem("wechat")  as HTMLInputElement).value,
      treatment: (form.elements.namedItem("service") as HTMLSelectElement).value,
      branch:    (form.elements.namedItem("branch")  as HTMLSelectElement).value,
      doctor:    (form.elements.namedItem("doctor")  as HTMLInputElement).value,
      date:      (form.elements.namedItem("date")    as HTMLInputElement).value,
      message:   (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch {
      alert(t("error.generic"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <div>
          {submitted ? (
            <div className="flex flex-col items-start gap-4 rounded-3xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] p-10">
              <CheckCircle2 size={48} strokeWidth={1.5} className="text-[color:var(--brand)]" aria-hidden="true" />
              <h2 className="font-display text-3xl text-[color:var(--text-main)]">
                {t("success.heading")}
              </h2>
              <p className="text-sm leading-7 text-[color:var(--text-soft)]">
                {t("success.body")}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn-secondary mt-2"
              >
                {t("success.sendAnother")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                    {t("label.fullName")} <span className="text-[color:var(--brand)]">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="w-full rounded-xl border border-[color:var(--border-strong)] bg-white px-4 py-3 text-sm text-[color:var(--text-main)] placeholder-[color:var(--text-soft)]/50 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20"
                    placeholder={t("placeholder.name")}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                    {t("label.email")} <span className="text-[color:var(--brand)]">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-[color:var(--border-strong)] bg-white px-4 py-3 text-sm text-[color:var(--text-main)] placeholder-[color:var(--text-soft)]/50 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20"
                    placeholder={t("placeholder.email")}
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                    {t("label.phone")} <span className="text-[color:var(--brand)]">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    className="w-full rounded-xl border border-[color:var(--border-strong)] bg-white px-4 py-3 text-sm text-[color:var(--text-main)] placeholder-[color:var(--text-soft)]/50 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20"
                    placeholder="+855 ..."
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="country" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                    {t("label.country")}
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    autoComplete="country-name"
                    className="w-full rounded-xl border border-[color:var(--border-strong)] bg-white px-4 py-3 text-sm text-[color:var(--text-main)] placeholder-[color:var(--text-soft)]/50 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20"
                    placeholder={t("placeholder.country")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="wechat" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                  {t("label.wechat")}
                </label>
                <input
                  id="wechat"
                  name="wechat"
                  type="text"
                  className="w-full rounded-xl border border-[color:var(--border-strong)] bg-white px-4 py-3 text-sm text-[color:var(--text-main)] placeholder-[color:var(--text-soft)]/50 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20"
                  placeholder={t("placeholder.wechat")}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="service" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                    {t("label.treatment")}
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full rounded-xl border border-[color:var(--border-strong)] bg-white px-4 py-3 text-sm text-[color:var(--text-main)] outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20"
                  >
                    <option value="">{t("placeholder.treatment")}</option>
                    {SERVICE_KEYS.map((key) => (
                      <option key={key} value={t(`service.${key}`)}>
                        {t(`service.${key}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="branch" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                    {t("label.branch")}
                  </label>
                  <select
                    id="branch"
                    name="branch"
                    className="w-full rounded-xl border border-[color:var(--border-strong)] bg-white px-4 py-3 text-sm text-[color:var(--text-main)] outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20"
                  >
                    <option value="">{t("placeholder.branch")}</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative space-y-2">
                <label htmlFor="doctor" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                  {t("label.doctor")}
                </label>
                <input type="hidden" name="doctor" value={preferredDoctor} />
                <input
                  ref={doctorInputRef}
                  id="doctor"
                  type="text"
                  autoComplete="off"
                  value={doctorQuery}
                  onChange={(e) => {
                    setDoctorQuery(e.target.value);
                    setPreferredDoctor(e.target.value);
                    setDoctorDropdownOpen(true);
                  }}
                  onFocus={() => setDoctorDropdownOpen(true)}
                  className="w-full rounded-xl border border-[color:var(--border-strong)] bg-white px-4 py-3 text-sm text-[color:var(--text-main)] placeholder-[color:var(--text-soft)]/50 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20"
                  placeholder={t("placeholder.doctor")}
                />
                {doctorDropdownOpen && filteredDoctors.length > 0 && (
                  <div
                    ref={doctorDropdownRef}
                    className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-2xl border border-[color:var(--border-strong)] bg-white p-1.5 shadow-[0_20px_50px_rgba(61,24,47,0.14)]"
                  >
                    {filteredDoctors.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => {
                          setPreferredDoctor(doc.name);
                          setDoctorQuery(doc.name);
                          setDoctorDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-[color:var(--brand-soft)]"
                      >
                        {doc.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={doc.photoUrl}
                            alt=""
                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-xs font-semibold text-[color:var(--brand-deep)]">
                            {doc.initials}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-[color:var(--text-main)]">{doc.name}</p>
                          <p className="truncate text-xs text-[color:var(--text-soft)]">
                            {doc.specialty.length > 0 ? doc.specialty.join(", ") : doc.department}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                  {t("label.date")}
                </label>
                <DatePicker name="date" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                  {t("label.message")} <span className="text-[color:var(--brand)]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full resize-none rounded-xl border border-[color:var(--border-strong)] bg-white px-4 py-3 text-sm text-[color:var(--text-main)] placeholder-[color:var(--text-soft)]/50 outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20"
                  placeholder={t("placeholder.message")}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center disabled:opacity-60"
              >
                {submitting ? t("button.sending") : t("button.submit")}
              </button>

              <p className="text-center text-xs text-[color:var(--text-soft)]">
                {t("privacy")}
              </p>
            </form>
          )}
        </div>

        {/* Branch info */}
        <div id="branches" className="space-y-4">
          <h2 className="font-display text-2xl text-[color:var(--text-main)]">{t("branches.heading")}</h2>
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] p-5"
            >
              <p className="font-semibold text-[color:var(--text-main)]">{branch.name}</p>
              <p className="mt-1 text-sm leading-6 text-[color:var(--text-soft)]">{branch.address}</p>
              <p className="mt-1 text-sm text-[color:var(--text-soft)]">{branch.phone}</p>
              {branch.mobile && (
                <p className="text-sm text-[color:var(--text-soft)]">{branch.mobile}</p>
              )}
              {branch.email && (
                <p className="text-sm text-[color:var(--text-soft)]">{branch.email}</p>
              )}
              <p className="mt-1 text-xs text-[color:var(--text-soft)]/70">{branch.hours}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {t("branches.directions")}
              </a>
            </div>
          ))}

          {/* Messaging links */}
          <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--brand-soft)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-deep)]">
              {t("messaging.heading")}
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {([
                {
                  labelKey: "messenger" as const,
                  href: "https://m.me/roomchangdental",
                  bg: "bg-gradient-to-br from-[#0078FF] to-[#A334FA]",
                  icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.921 1.458 5.527 3.742 7.237V22l3.405-1.869c.91.252 1.872.388 2.853.388 5.523 0 10-4.145 10-9.276S17.523 2 12 2zm.99 12.49-2.548-2.718-4.973 2.718 5.473-5.808 2.611 2.718 4.91-2.718-5.473 5.808z" /></svg>,
                },
                {
                  labelKey: "whatsapp" as const,
                  href: "https://api.whatsapp.com/send/?phone=85569811338&text=",
                  bg: "bg-[#25D366]",
                  icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>,
                },
                {
                  labelKey: "telegram" as const,
                  href: "https://telegram.me/roomchang",
                  bg: "bg-[#2AABEE]",
                  icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>,
                },
                {
                  labelKey: "wechat" as const,
                  href: "#",
                  bg: "bg-[#07C160]",
                  icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.68 4.026c-2.958 0-5.337 1.476-6.686 3.438-.901 1.312-1.07 2.828-.479 4.164.595 1.344 1.862 2.39 3.463 2.852.485.14.99.213 1.508.257.376.033.756.05 1.14.05a8.8 8.8 0 0 0 2.312-.307.71.71 0 0 1 .588.08l1.56.912a.268.268 0 0 0 .137.044.24.24 0 0 0 .237-.241c0-.059-.023-.117-.039-.174l-.32-1.212a.484.484 0 0 1 .174-.544C19.886 18.24 21 16.593 21 14.74c0-2.496-2.597-4.523-5.722-4.523zm-2.37 2.768c.463 0 .838.381.838.851a.845.845 0 0 1-.838.849.845.845 0 0 1-.838-.849c0-.47.375-.851.838-.851zm4.133 0c.463 0 .838.381.838.851a.845.845 0 0 1-.838.849.845.845 0 0 1-.838-.849c0-.47.375-.851.838-.851z" /></svg>,
                },
              ] as const).map(({ labelKey, href, bg, icon }) => (
                <a
                  key={labelKey}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm font-semibold text-[color:var(--text-main)] transition hover:text-[color:var(--brand)]"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${bg}`}>
                    {icon}
                  </span>
                  {t(`messaging.${labelKey}`)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
