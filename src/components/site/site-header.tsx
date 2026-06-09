"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";

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
  {
    tKey: "doctors",
    href: "/team",
  },
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
      { tKey: "priceComparison", href: "/international/price-comparison" },
      { tKey: "implantsComparison", href: "/pricing/implants-comparison" },
    ],
  },
  {
    tKey: "clinicalResults",
    href: "/clinical-results",
    children: [
      { tKey: "allCases", href: "/clinical-results" },
      { tKey: "fullMouthReconstructionResults", href: "/clinical-results/category/full-mouth-reconstruction" },
      { tKey: "implantsCrowns", href: "/clinical-results/category/implants-and-crowns" },
      { tKey: "implantBridges", href: "/clinical-results/category/implant-bridges" },
      { tKey: "orthodonticsResults", href: "/clinical-results/category/orthodontics" },
      { tKey: "cosmeticEmax", href: "/clinical-results/category/cosmetic-and-emax" },
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

export function SiteHeader() {
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");

  // Which dropdown is open via tap (touch devices have no hover, so CSS
  // group-hover alone never opens the menus on iPad/tablets).
  const [openKey, setOpenKey] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close the tapped-open menu when tapping/clicking outside the nav.
  useEffect(() => {
    if (!openKey) return;
    function onPointerDown(e: PointerEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenKey(null);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openKey]);

  return (
    <header
      aria-label={tHeader("ariaLabel")}
      className="sticky top-0 z-50 border-b border-black/5 bg-[color:rgba(255,250,251,0.92)] backdrop-blur-xl"
    >
      <div className="flex w-full items-center justify-between gap-4 px-4 py-2 sm:px-6 sm:py-4 lg:gap-2 lg:px-4 lg:py-4 xl:gap-4 xl:px-6 2xl:px-8">
        <Link href="/" className="flex min-w-0 items-center" aria-label={tHeader("homeAriaLabel")}>
          <div className="relative h-[52px] w-[105px] sm:h-[74px] sm:w-[145px] lg:h-[62px] lg:w-[122px] xl:h-[74px] xl:w-[145px] 2xl:h-[84px] 2xl:w-[164px]">
            <Image
              src="/brand/roomchang-logo-header-padded.png"
              alt={tHeader("logoAlt")}
              fill
              priority
              sizes="(max-width: 640px) 105px, (max-width: 1024px) 145px, (max-width: 1280px) 122px, (max-width: 1536px) 145px, 164px"
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-3 xl:gap-4 2xl:gap-6 lg:flex">
          <nav ref={navRef} aria-label="Primary" className="flex items-center gap-px xl:gap-0.5 2xl:gap-1">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div key={item.tKey} className="group relative">
                  <Link
                    href={item.href}
                    aria-expanded={openKey === item.tKey}
                    onClick={(e) => {
                      // On touch devices (no hover) the first tap opens the
                      // menu instead of navigating; a second tap follows the link.
                      if (
                        openKey !== item.tKey &&
                        typeof window !== "undefined" &&
                        window.matchMedia("(hover: none)").matches
                      ) {
                        e.preventDefault();
                        setOpenKey(item.tKey);
                      }
                    }}
                    className="flex items-center gap-0.5 rounded-lg px-1.5 py-2 text-[11px] font-semibold text-[color:var(--text-soft)] transition-colors hover:bg-[color:var(--brand-soft)] hover:text-[color:var(--brand-deep)] xl:gap-1 xl:px-2 xl:text-[13px] 2xl:px-3 2xl:text-sm"
                  >
                    {t(item.tKey)}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                      className={`mt-px size-2.5 transition-transform duration-200 group-hover:rotate-180 2xl:size-3 ${openKey === item.tKey ? "rotate-180" : ""}`}
                    >
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>

                  {/* Dropdown — opens on hover (mouse) or tap (touch) */}
                  <div
                    className={`absolute left-0 top-[calc(100%+0.25rem)] z-50 min-w-52 transition-all duration-150 group-hover:visible group-hover:opacity-100 ${
                      openKey === item.tKey ? "visible opacity-100" : "invisible opacity-0"
                    }`}
                  >
                    <div className="rounded-2xl border border-[color:var(--border-strong)] bg-white/98 p-1.5 shadow-[0_20px_50px_rgba(61,24,47,0.14)] backdrop-blur">
                      {item.children.map((child) => (
                        <Link
                          key={child.tKey}
                          href={child.href}
                          onClick={() => setOpenKey(null)}
                          className="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-[color:var(--text-main)] transition-colors hover:bg-[color:var(--brand-soft)] hover:text-[color:var(--brand-deep)]"
                        >
                          {t(child.tKey)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.tKey}
                  href={item.href}
                  className="rounded-lg px-1.5 py-2 text-[11px] font-semibold text-[color:var(--text-soft)] transition-colors hover:bg-[color:var(--brand-soft)] hover:text-[color:var(--brand-deep)] xl:px-2 xl:text-[13px] 2xl:px-3 2xl:text-sm"
                >
                  {t(item.tKey)}
                </Link>
              )
            )}
          </nav>
          <LanguageSwitcher />
          <Link href="/contact" className="btn-primary btn-primary-sm whitespace-nowrap">
            {tHeader("bookAppointment")}
          </Link>
        </div>

        {/* Mobile nav */}
        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
