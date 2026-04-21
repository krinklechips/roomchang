"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";

type NavChild = { label: string; href: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Roomchang", href: "/about" },
      { label: "Our Facilities", href: "/about/facilities" },
      { label: "Vision, Mission & Values", href: "/about/vision-mission-values" },
      { label: "Message from Our Director", href: "/about/director-message" },
      { label: "Community & Charity", href: "/about/community" },
      { label: "Corporate Partnerships", href: "/about/partnerships" },
      { label: "Patient Testimonials", href: "/about/testimonials" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Dental Implants", href: "/services/dental-implants" },
      { label: "Implant Bridges", href: "/services/implant-bridges" },
      { label: "All-on-4 / All-on-6", href: "/services/all-on-4" },
      { label: "Dental Crowns", href: "/services/dental-crowns" },
      { label: "Full Mouth Reconstruction", href: "/services/full-mouth-reconstruction" },
      { label: "Oral Surgery", href: "/services/oral-surgery" },
      { label: "Endodontics", href: "/services/endodontics" },
      { label: "Cosmetic Dentistry", href: "/services/cosmetic-dentistry" },
      { label: "Teeth Whitening", href: "/services/teeth-whitening" },
      { label: "Orthodontics", href: "/services/orthodontics" },
      { label: "Pediatric Dentistry", href: "/services/pediatric-dentistry" },
      { label: "Snoring & Sleep Apnea", href: "/services/sleep-apnea" },
    ],
  },
  {
    label: "Doctors",
    href: "/team",
  },
  {
    label: "Technology",
    href: "/technology",
    children: [
      { label: "CAD/CAM Digital Dentistry", href: "/technology/cad-cam" },
      { label: "CA® Clear Aligner Splint", href: "/technology/ca-clear-aligner" },
      { label: "Invisalign Clear Aligners", href: "/technology/invisalign" },
      { label: "Ortho-Tain®", href: "/technology/ortho-tain" },
      { label: "Beyond® Teeth Whitening", href: "/technology/beyond-whitening" },
      { label: "Sterilisation Technologies", href: "/technology/sterilisation" },
    ],
  },
  { label: "International", href: "/international" },
  {
    label: "Pricing",
    href: "/pricing",
    children: [
      { label: "All Treatment Prices", href: "/pricing" },
      { label: "Dental Implants", href: "/pricing#implants" },
      { label: "Crowns & Veneers", href: "/pricing#crowns" },
      { label: "Orthodontics", href: "/pricing#orthodontics" },
      { label: "Teeth Whitening", href: "/pricing#whitening" },
      { label: "International Comparison", href: "/pricing#international" },
    ],
  },
  {
    label: "Clinical Results",
    href: "/clinical-results",
    children: [
      { label: "All Cases", href: "/clinical-results" },
      { label: "Full Mouth Reconstruction", href: "/clinical-results#full-mouth" },
      { label: "Implants & Crowns", href: "/clinical-results#implants" },
      { label: "Implant Bridges", href: "/clinical-results#bridges" },
      { label: "Orthodontics", href: "/clinical-results#orthodontics" },
      { label: "Cosmetic & E-Max", href: "/clinical-results#cosmetic" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  return (
    <header
      aria-label="Roomchang Dental Hospital"
      className="sticky top-0 z-50 border-b border-black/5 bg-[color:rgba(255,250,251,0.92)] backdrop-blur-xl"
    >
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-4">
        <Link href="/" className="flex min-w-0 items-center" aria-label="Roomchang Dental Hospital home">
          <div className="relative h-[64px] w-[125px] sm:h-[74px] sm:w-[145px] lg:h-[84px] lg:w-[164px]">
            <Image
              src="/brand/roomchang-logo-header-padded.png"
              alt="Roomchang Dental Hospital logo"
              fill
              priority
              sizes="(max-width: 640px) 125px, (max-width: 1024px) 145px, 164px"
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 lg:flex">
          <nav aria-label="Primary" className="flex items-center gap-1">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-[color:var(--text-soft)] transition-colors hover:bg-[color:var(--brand-soft)] hover:text-[color:var(--brand-deep)]"
                  >
                    {item.label}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                      className="mt-px transition-transform duration-200 group-hover:rotate-180"
                    >
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>

                  {/* Dropdown */}
                  <div className="invisible absolute left-0 top-[calc(100%+0.25rem)] z-50 min-w-52 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                    <div className="rounded-2xl border border-[--border-strong] bg-white/98 p-1.5 shadow-[0_20px_50px_rgba(61,24,47,0.14)] backdrop-blur">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-[--text-main] transition-colors hover:bg-[color:var(--brand-soft)] hover:text-[color:var(--brand-deep)]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-[color:var(--text-soft)] transition-colors hover:bg-[color:var(--brand-soft)] hover:text-[color:var(--brand-deep)]"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
          <LanguageSwitcher />
          <Link href="/contact" className="btn-primary">
            Book Appointment
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
