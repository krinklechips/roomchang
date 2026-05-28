"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type NavChild = { tKey: string; href: string };
type NavItem = { tKey: string; href: string; children?: NavChild[] };

const NAV_ITEMS: NavItem[] = [
  { tKey: "home", href: "/" },
  {
    tKey: "about",
    href: "/about",
    children: [
      { tKey: "aboutRoomchang", href: "/about" },
      { tKey: "ourFacilities", href: "/about/facilities" },
      { tKey: "visionMission", href: "/about/vision-mission-values" },
      { tKey: "directorMessage", href: "/about/director-message" },
      { tKey: "newsEvents", href: "/about/news" },
      { tKey: "communityCharity", href: "/about/community" },
      { tKey: "corporatePartnerships", href: "/about/partnerships" },
      { tKey: "employmentOpportunities", href: "/about/careers" },
    ],
  },
  {
    tKey: "services",
    href: "/services",
    children: [
      { tKey: "preventiveDentistry", href: "/services/preventive-dentistry" },
      { tKey: "cosmeticDentistry", href: "/services/cosmetic-dentistry" },
      { tKey: "endodontics", href: "/services/endodontics" },
      { tKey: "dentalCrowns", href: "/services/dental-crowns" },
      { tKey: "orthodontics", href: "/services/orthodontics" },
      { tKey: "pediatricDentistry", href: "/services/pediatric-dentistry" },
      { tKey: "periodontalDentistry", href: "/services/periodontics" },
      { tKey: "dentures", href: "/services/dentures" },
      { tKey: "dentalImplants", href: "/services/dental-implants" },
      { tKey: "oralSurgery", href: "/services/oral-surgery" },
      { tKey: "fullMouthReconstruction", href: "/services/full-mouth-reconstruction" },
      { tKey: "teethWhitening", href: "/services/teeth-whitening" },
      { tKey: "snoringApnea", href: "/services/sleep-apnea" },
    ],
  },
  { tKey: "doctors", href: "/team" },
  {
    tKey: "technology",
    href: "/technology",
    children: [
      { tKey: "cadCam", href: "/technology/cad-cam" },
      { tKey: "clearAligner", href: "/technology/ca-clear-aligner" },
      { tKey: "invisalign", href: "/technology/invisalign" },
      { tKey: "orthoTain", href: "/technology/ortho-tain" },
      { tKey: "resmedApnealink", href: "/technology/resmed-apnealink" },
      { tKey: "beyondWhitening", href: "/technology/beyond-whitening" },
      { tKey: "iconVestibular", href: "/technology/icon-vestibular" },
      { tKey: "sterilisationTech", href: "/technology/sterilisation" },
    ],
  },
  { tKey: "international", href: "/international" },
  {
    tKey: "pricing",
    href: "/pricing",
    children: [
      { tKey: "dentalTreatmentCosts", href: "/pricing" },
      { tKey: "implantsComparison", href: "/pricing/implants-comparison" },
    ],
  },
  {
    tKey: "clinicalResults",
    href: "/clinical-results",
    children: [
      { tKey: "allCases", href: "/clinical-results" },
      { tKey: "fullMouthReconstructionResults", href: "/clinical-results#full-mouth" },
      { tKey: "implantsCrowns", href: "/clinical-results#implants" },
      { tKey: "implantBridges", href: "/clinical-results#bridges" },
      { tKey: "orthodonticsResults", href: "/clinical-results#orthodontics" },
      { tKey: "cosmeticEmax", href: "/clinical-results#cosmetic" },
      { tKey: "patientTestimonials", href: "/about/testimonials" },
    ],
  },
  {
    tKey: "educationBlog",
    href: "/blog",
    children: [
      { tKey: "faq", href: "/blog/faq" },
      { tKey: "dentistTalks", href: "/blog/dentist-talks" },
      { tKey: "publications", href: "/blog/publications" },
    ],
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const t = useTranslations("nav");
  const tMobile = useTranslations("mobileNav");

  const toggle = (tKey: string) =>
    setExpanded((prev) => (prev === tKey ? null : tKey));

  const close = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    <>
      <button
        type="button"
        aria-label={open ? tMobile("closeMenu") : tMobile("openMenu")}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-strong)] bg-white/80 text-[color:var(--text-main)] backdrop-blur transition hover:bg-[color:var(--surface-strong)]"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="2" x2="16" y2="16" />
            <line x1="16" y1="2" x2="2" y2="16" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="5" x2="16" y2="5" />
            <line x1="2" y1="9" x2="16" y2="9" />
            <line x1="2" y1="13" x2="16" y2="13" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-x-0 top-0 z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Scrollable panel — max full screen height with overflow scroll */}
        <div className="flex max-h-[100dvh] flex-col border-b border-[color:var(--border-strong)] bg-[color:rgba(255,250,251,0.97)] shadow-[0_20px_60px_rgba(36,20,31,0.14)] backdrop-blur-xl">

          {/* Fixed header — never scrolls away */}
          <div className="flex shrink-0 items-center justify-between px-4 pb-4 pt-4 sm:px-6">
            <Link href="/" onClick={close} className="font-display text-2xl text-[color:var(--brand-deep)]">
              {tMobile("brandName")}
            </Link>
            <button
              type="button"
              aria-label={tMobile("closeMenu")}
              onClick={close}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-strong)] bg-white/80 text-[color:var(--text-main)]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="2" x2="14" y2="14" />
                <line x1="14" y1="2" x2="2" y2="14" />
              </svg>
            </button>
          </div>

          {/* Scrollable nav body */}
          <nav aria-label="Mobile primary" className="flex-1 overflow-y-auto px-4 pb-2 sm:px-6">
            <div className="flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) =>
                item.children ? (
                  <div key={item.tKey}>
                    {/* Accordion toggle row */}
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={close}
                        className="flex-1 rounded-xl px-4 py-3 text-base font-semibold text-[color:var(--text-main)] transition hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--brand-deep)]"
                      >
                        {t(item.tKey)}
                      </Link>
                      <button
                        type="button"
                        aria-label={tMobile("toggleSubmenu", { label: t(item.tKey) })}
                        onClick={() => toggle(item.tKey)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[color:var(--text-soft)] transition hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--brand-deep)]"
                      >
                        <svg
                          width="14" height="14" viewBox="0 0 14 14" fill="none"
                          className={`transition-transform duration-200 ${expanded === item.tKey ? "rotate-180" : ""}`}
                        >
                          <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    {/* Collapsible children */}
                    {expanded === item.tKey && (
                      <div className="mb-1 ml-4 flex flex-col gap-0.5 border-l border-[color:var(--border-strong)] pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.tKey}
                            href={child.href}
                            onClick={close}
                            className="rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--text-soft)] transition hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--brand-deep)]"
                          >
                            {t(child.tKey)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.tKey}
                    href={item.href}
                    onClick={close}
                    className="rounded-xl px-4 py-3 text-base font-semibold text-[color:var(--text-main)] transition hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--brand-deep)]"
                  >
                    {t(item.tKey)}
                  </Link>
                )
              )}
            </div>
          </nav>

          {/* Fixed footer CTA */}
          <div className="shrink-0 border-t border-[color:var(--border-strong)] px-4 pb-6 pt-4 sm:px-6">
            <Link
              href="/contact"
              onClick={close}
              className="btn-primary w-full justify-center"
            >
              {tMobile("bookAppointment")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
