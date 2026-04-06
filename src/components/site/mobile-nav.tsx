"use client";

import { useState } from "react";
import Link from "next/link";

type NavChild = { label: string; href: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Doctors", href: "/team" },
  {
    label: "Technology",
    href: "/technology",
    children: [
      { label: "CA® Clear Aligner", href: "/technology/ca-clear-aligner" },
      { label: "CAD/CAM Dentistry", href: "/technology/cad-cam" },
      { label: "Invisalign", href: "/technology/invisalign" },
      { label: "Beyond® Whitening", href: "/technology/beyond-whitening" },
      { label: "Sterilisation", href: "/technology/sterilisation" },
      { label: "3D CBCT Imaging", href: "/technology/cbct-imaging" },
    ],
  },
  { label: "International", href: "/international" },
  { label: "Pricing", href: "/pricing" },
  { label: "Clinical Results", href: "/clinical-results" },
  { label: "Contact", href: "/contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[--border-strong] bg-white/80 text-[--text-main] backdrop-blur transition hover:bg-[--surface-strong]"
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
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-x-0 top-0 z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="border-b border-[--border-strong] bg-[color:rgba(255,250,251,0.97)] px-4 pb-6 pt-4 shadow-[0_20px_60px_rgba(36,20,31,0.14)] backdrop-blur-xl sm:px-6">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={() => setOpen(false)} className="font-display text-2xl text-[--brand-deep]">
              Roomchang
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[--border-strong] bg-white/80 text-[--text-main]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="2" x2="14" y2="14" />
                <line x1="14" y1="2" x2="2" y2="14" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile primary" className="mt-6 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-semibold text-[--text-main] transition hover:bg-[--surface-strong] hover:text-[--brand-deep]"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 flex flex-col gap-0.5 border-l border-[--border-strong] pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-[--text-soft] transition hover:bg-[--surface-strong] hover:text-[--brand-deep]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-5 border-t border-[--border-strong] pt-5">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
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
