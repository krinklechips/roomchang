import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = [
  {
    heading: "Services",
    links: [
      { label: "Dental Implants", href: "/services/dental-implants" },
      { label: "All-on-4 / All-on-6", href: "/services/all-on-4" },
      { label: "Orthodontics & Braces", href: "/services/orthodontics" },
      { label: "Teeth Whitening", href: "/services/teeth-whitening" },
      { label: "Cosmetic Dentistry", href: "/services/cosmetic-dentistry" },
      { label: "Oral Surgery", href: "/services/oral-surgery" },
      { label: "Full Mouth Reconstruction", href: "/services/full-mouth-reconstruction" },
      { label: "All Services", href: "/services" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "About Roomchang", href: "/about" },
      { label: "Our Facilities", href: "/about/facilities" },
      { label: "Vision & Mission", href: "/about/vision-mission-values" },
      { label: "Our Doctors", href: "/team" },
      { label: "Technology", href: "/technology" },
      { label: "Community & Charity", href: "/about/community" },
    ],
  },
  {
    heading: "International Patients",
    links: [
      { label: "Coming to Cambodia?", href: "/international" },
      { label: "Price Comparison", href: "/pricing" },
      { label: "How It Works", href: "/international#how-it-works" },
      { label: "Before & After Gallery", href: "/clinical-results" },
      { label: "Treatment Cost Guide", href: "/pricing" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "Book Appointment", href: "/contact" },
      { label: "Our 5 Branches", href: "/contact#branches" },
      { label: "WhatsApp (+855 69 811 338)", href: "https://wa.me/85569811338" },
      { label: "Telegram", href: "https://t.me/roomchang" },
      { label: "Facebook", href: "https://www.facebook.com/roomchangdental" },
    ],
  },
];

const SOCIAL = [
  { label: "Facebook", href: "https://www.facebook.com/roomchangdental" },
  { label: "YouTube", href: "https://www.youtube.com/@roomchang" },
  { label: "Instagram", href: "https://www.instagram.com/roomchang/" },
  { label: "Telegram", href: "https://t.me/roomchang" },
  { label: "TikTok", href: "https://www.tiktok.com/@roomchangdentalhospital" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[--border-strong] bg-[--surface]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="grid gap-10 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
          {/* Brand */}
          <div className="space-y-4">
            <div className="relative h-[60px] w-[120px]">
              <Image
                src="/brand/roomchang-logo-header-padded.png"
                alt="Roomchang Dental Hospital"
                fill
                sizes="120px"
                className="object-contain object-left"
              />
            </div>
            <p className="max-w-xs text-sm leading-7 text-[--text-soft]">
              Premium dental care for local and international patients. Multilingual, technology-first,
              and rooted in compassionate care since 1996.
            </p>
            <div className="space-y-1 text-sm text-[--text-soft]">
              <p>No.4, Street 184, Phsar Thmey 3</p>
              <p>Khan Daun Penh, Phnom Penh 120203</p>
              <a href="tel:+85523211338" className="block hover:text-[--brand-deep]">
                +855 23 211 338
              </a>
              <a href="tel:+85511811338" className="block hover:text-[--brand-deep]">
                +855 11 811 338 <span className="text-xs">(Mobile 24/7)</span>
              </a>
              <a href="mailto:contact@roomchang.com" className="block hover:text-[--brand-deep]">
                contact@roomchang.com
              </a>
              <p className="mt-2 inline-block rounded border border-[--border-strong] px-2 py-0.5 text-xs font-medium tracking-wide text-[--text-soft]">
                ISO 9001:2015 Certified
              </p>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[--text-soft]">
                {col.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[--text-soft] transition-colors hover:text-[--brand]"
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start gap-4 border-t border-[--border-strong] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[--text-soft]">
            © {new Date().getFullYear()} Roomchang Dental Hospital. Operated by Kravan Healthcare Co., Ltd.
          </p>
          <div className="flex items-center gap-5">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[--text-soft] transition-colors hover:text-[--brand]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
