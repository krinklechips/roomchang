import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type FooterLink = { tKey: string; href: string; external?: boolean };
type FooterColumn = { headingKey: string; links: FooterLink[] };

const FOOTER_STRUCTURE: FooterColumn[] = [
  {
    headingKey: "services",
    links: [
      { tKey: "cosmeticDentistry", href: "/services/cosmetic-dentistry" },
      { tKey: "endodontics", href: "/services/endodontics" },
      { tKey: "dentalCrowns", href: "/services/dental-crowns" },
      { tKey: "orthodontics", href: "/services/orthodontics" },
      { tKey: "dentures", href: "/services/dentures" },
      { tKey: "dentalImplants", href: "/services/dental-implants" },
      { tKey: "oralSurgery", href: "/services/oral-surgery" },
      { tKey: "fullMouthReconstruction", href: "/services/full-mouth-reconstruction" },
      { tKey: "teethWhitening", href: "/services/teeth-whitening" },
      { tKey: "allServices", href: "/services" },
    ],
  },
  {
    headingKey: "about",
    links: [
      { tKey: "aboutRoomchang", href: "/about" },
      { tKey: "ourFacilities", href: "/about/facilities" },
      { tKey: "visionMission", href: "/about/vision-mission-values" },
      { tKey: "ourDoctors", href: "/team" },
      { tKey: "technology", href: "/technology" },
      { tKey: "communityCharity", href: "/about/community" },
      { tKey: "employmentOpportunities", href: "/about/careers" },
    ],
  },
  {
    headingKey: "international",
    links: [
      { tKey: "comingToCambodia", href: "/international" },
      { tKey: "howItWorks", href: "/international#how-it-works" },
      { tKey: "treatmentCosts", href: "/pricing" },
      { tKey: "priceComparison", href: "/international/price-comparison" },
      { tKey: "implantsComparison", href: "/pricing/implants-comparison" },
      { tKey: "warranty", href: "/pricing/warranty" },
      { tKey: "clinicalResults", href: "/clinical-results" },
    ],
  },
  {
    headingKey: "contact",
    links: [
      { tKey: "bookAppointment", href: "/contact" },
      { tKey: "branches", href: "/contact#branches" },
      { tKey: "whatsapp", href: "https://wa.me/85569811338", external: true },
      { tKey: "wechat", href: "weixin://dl/chat?viliyanpink", external: true },
      { tKey: "telegram", href: "https://t.me/roomchang", external: true },
      { tKey: "facebook", href: "https://www.facebook.com/roomchangdental", external: true },
    ],
  },
];

const SOCIAL = [
  { tKey: "facebook", href: "https://www.facebook.com/roomchangdental" },
  { tKey: "youtube", href: "https://www.youtube.com/@roomchang" },
  { tKey: "instagram", href: "https://www.instagram.com/roomchangdental" },
  { tKey: "telegram", href: "https://t.me/roomchang" },
  { tKey: "tiktok", href: "https://www.tiktok.com/@roomchangdental" },
  { tKey: "linkedin", href: "https://www.linkedin.com/company/roomchang/" },
];

const LEGAL_LINKS = [
  { tKey: "privacyPolicy", href: "/privacy-policy" },
  { tKey: "termsOfService", href: "/terms-of-service" },
  { tKey: "disclaimer", href: "/disclaimer" },
  { tKey: "cookiePolicy", href: "/cookie-policy" },
  { tKey: "bookingCancellation", href: "/booking-cancellation-policy" },
];

export async function SiteFooter() {
  const tNav = await getTranslations("nav");
  const tFooter = await getTranslations("footer");

  // Resolve link labels: services column uses nav keys, others use footer.link keys
  function linkLabel(column: FooterColumn, link: FooterLink): string {
    const key = link.tKey;
    switch (column.headingKey) {
      case "services":
        // Service links share keys with nav except "allServices"
        return key === "allServices" ? tFooter("link.allServices") : tNav(key);
      case "about": {
        // Some about links share keys with nav; the rest are footer-specific
        const navKeys = ["aboutRoomchang", "ourFacilities", "technology", "communityCharity", "employmentOpportunities"];
        if (navKeys.includes(key)) return tNav(key);
        if (key === "visionMission") return tFooter("link.visionMission");
        if (key === "ourDoctors") return tFooter("link.ourDoctors");
        return key;
      }
      case "international": {
        const navKeys = ["priceComparison", "clinicalResults"];
        return navKeys.includes(key) ? tNav(key) : tFooter(`link.${key}`);
      }
      case "contact":
        // External social links vs footer link keys
        return link.external ? tFooter(`social.${key}`) : tFooter(`link.${key}`);
      default:
        return key;
    }
  }

  return (
    <footer className="border-t border-[color:var(--border-strong)] bg-[color:var(--surface)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
          {/* Brand */}
          <div className="space-y-4">
            <div className="relative h-[60px] w-[120px]">
              <Image
                src="/brand/roomchang-logo-header-padded.png"
                alt={tFooter("logoAlt")}
                fill
                sizes="120px"
                className="object-contain object-left"
              />
            </div>
            <p className="max-w-xs text-sm leading-7 text-[color:var(--text-soft)]">
              {tFooter("tagline")}
            </p>
            <div className="space-y-1 text-sm text-[color:var(--text-soft)]">
              <p>{tFooter("address.line1")}</p>
              <p>{tFooter("address.line2")}</p>
              <a href="tel:+85569811338" className="block hover:text-[color:var(--brand-deep)]">
                +855 69 811 338
              </a>
              <a href="tel:+85511811338" className="block hover:text-[color:var(--brand-deep)]">
                +855 11 811 338 <span className="text-xs">{tFooter("phoneMobile247")}</span>
              </a>
              <a href="mailto:contact@roomchang.com" className="block hover:text-[color:var(--brand-deep)]">
                contact@roomchang.com
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_STRUCTURE.map((col) => (
            <div key={col.headingKey}>
              <p className="flex min-h-[2.5em] items-start text-xs font-semibold uppercase leading-snug tracking-[0.22em] text-[color:var(--text-soft)]">
                {tFooter(`heading.${col.headingKey}`)}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.tKey}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[color:var(--text-soft)] transition-colors hover:text-[color:var(--brand)]"
                      >
                        {linkLabel(col, link)}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-[color:var(--text-soft)] transition-colors hover:text-[color:var(--brand)]"
                      >
                        {linkLabel(col, link)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start gap-4 border-t border-[color:var(--border-strong)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <p className="text-xs text-[color:var(--text-soft)]">
              {tFooter("copyright", { year: new Date().getFullYear() })}
            </p>
            <nav aria-label={tFooter("legal.ariaLabel")} className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-[color:var(--text-soft)] transition-colors hover:text-[color:var(--brand)]"
                >
                  {tFooter(`legal.${link.tKey}`)}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {SOCIAL.map((s) => (
              <a
                key={s.tKey}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[color:var(--text-soft)] transition-colors hover:text-[color:var(--brand)]"
              >
                {tFooter(`social.${s.tKey}`)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
