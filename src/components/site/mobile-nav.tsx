"use client";

import { useState } from "react";
import Link from "next/link";

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
      { label: "Cosmetic Dentistry", href: "/services/cosmetic-dentistry" },
      { label: "Endodontics", href: "/services/endodontics" },
      { label: "Dental Crowns", href: "/services/dental-crowns" },
      { label: "Orthodontics", href: "/services/orthodontics" },
      { label: "Pediatric Dentistry", href: "/services/pediatric-dentistry" },
      { label: "Periodontal Dentistry", href: "/services/periodontics" },
      { label: "Dental Implants", href: "/services/dental-implants" },
      { label: "Oral Surgery", href: "/services/oral-surgery" },
      { label: "Full Mouth Reconstruction", href: "/services/full-mouth-reconstruction" },
      { label: "Teeth Whitening", href: "/services/teeth-whitening" },
      { label: "Snoring & Sleep Apnea", href: "/services/sleep-apnea" },
    ],
  },
  { label: "Doctors", href: "/team" },
  {
    label: "Technology",
    href: "/technology",
    children: [
      { label: "CAD/CAM Digital Dentistry", href: "/technology/cad-cam" },
      { label: "CA® Clear Aligner Splint", href: "/technology/ca-clear-aligner" },
      { label: "Invisalign Clear Aligners", href: "/technology/invisalign" },
      { label: "Ortho-Tain® System", href: "/technology/ortho-tain" },
      { label: "Beyond® Teeth Whitening", href: "/technology/beyond-whitening" },
      { label: "Sterilisation Technologies", href: "/technology/sterilisation" },
    ],
  },
  { label: "International", href: "/international" },
  {
    label: "Pricing",
    href: "/pricing",
    children: [
      { label: "Dental Treatment Costs", href: "/pricing" },
      { label: "Price Comparison", href: "/pricing/price-comparison" },
      { label: "Dental Implants Price Comparison", href: "/pricing/implants-comparison" },
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
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (label: string) =>
    setExpanded((prev) => (prev === label ? null : label));

  const close = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[--border-strong] bg-white/80 text-[--text-main] backdrop-blur transition hover:bg-[color:var(--surface-strong)]"
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
        <div className="flex max-h-[100dvh] flex-col border-b border-[--border-strong] bg-[color:rgba(255,250,251,0.97)] shadow-[0_20px_60px_rgba(36,20,31,0.14)] backdrop-blur-xl">

          {/* Fixed header — never scrolls away */}
          <div className="flex shrink-0 items-center justify-between px-4 pb-4 pt-4 sm:px-6">
            <Link href="/" onClick={close} className="font-display text-2xl text-[--brand-deep]">
              Roomchang
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[--border-strong] bg-white/80 text-[--text-main]"
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
                  <div key={item.label}>
                    {/* Accordion toggle row */}
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={close}
                        className="flex-1 rounded-xl px-4 py-3 text-base font-semibold text-[--text-main] transition hover:bg-[color:var(--surface-strong)] hover:text-[--brand-deep]"
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        aria-label={`Toggle ${item.label} submenu`}
                        onClick={() => toggle(item.label)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[--text-soft] transition hover:bg-[color:var(--surface-strong)] hover:text-[--brand-deep]"
                      >
                        <svg
                          width="14" height="14" viewBox="0 0 14 14" fill="none"
                          className={`transition-transform duration-200 ${expanded === item.label ? "rotate-180" : ""}`}
                        >
                          <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    {/* Collapsible children */}
                    {expanded === item.label && (
                      <div className="mb-1 ml-4 flex flex-col gap-0.5 border-l border-[--border-strong] pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={close}
                            className="rounded-lg px-3 py-2.5 text-sm font-medium text-[--text-soft] transition hover:bg-[color:var(--surface-strong)] hover:text-[--brand-deep]"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={close}
                    className="rounded-xl px-4 py-3 text-base font-semibold text-[--text-main] transition hover:bg-[color:var(--surface-strong)] hover:text-[--brand-deep]"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </nav>

          {/* Fixed footer CTA */}
          <div className="shrink-0 border-t border-[--border-strong] px-4 pb-6 pt-4 sm:px-6">
            <Link
              href="/contact"
              onClick={close}
              className="btn-primary w-full justify-center"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
