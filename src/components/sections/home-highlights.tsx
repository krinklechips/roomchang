import { getTranslations } from "next-intl/server";

const shortcuts = [
  {
    id: "treatmentCosts",
    href: "#costs",
    accent: "bg-[linear-gradient(135deg,#0fa5a4,#0b8b8a)]",
  },
  {
    id: "testimonials",
    href: "#testimonials",
    accent: "bg-[linear-gradient(135deg,#a22f7b,#8c2a8d)]",
  },
  {
    id: "ourTeam",
    href: "#team",
    accent: "bg-[linear-gradient(135deg,#c76ad7,#a750b7)]",
  },
  {
    id: "makeAppointment",
    href: "#book",
    accent: "bg-[linear-gradient(135deg,#1592db,#0e7cc7)]",
  },
  {
    id: "planYourTrip",
    href: "#trip",
    accent: "bg-[linear-gradient(135deg,#6cab18,#5a9514)]",
  },
] as const;

const featuredCards = [
  {
    id: "international",
    imageSrc: "/hero/hero-customer-service.jpg?v=2",
    href: "/international",
    bgSize: "cover",
    bgPosition: "center",
  },
  {
    id: "team",
    imageSrc: "/hero/hero-all-staff.jpg",
    href: "/team",
    bgSize: "contain",
    bgPosition: "center top",
  },
  {
    id: "aligner",
    imageSrc: "/hero/roomchang-clear-aligner.jpg",
    href: "/technology/ca-clear-aligner",
    bgSize: "contain",
    bgPosition: "center",
  },
] as const;

export async function HomeHighlights() {
  const t = await getTranslations("homeHighlights");

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[980px] grid-cols-5 gap-3 lg:min-w-0">
          {shortcuts.map((shortcut) => (
            <a
              key={shortcut.id}
              href={shortcut.href}
              className={`${shortcut.accent} group flex min-h-28 flex-col justify-between rounded-2xl p-5 text-white shadow-[0_16px_40px_rgba(34,22,31,0.12)] transition hover:-translate-y-0.5`}
            >
              <span className="text-[0.76rem] font-semibold uppercase tracking-[0.22em] text-white/70">
                {t("shortcut.quickAccess")}
              </span>
              <div className="space-y-2">
                <p className="text-xl font-extrabold uppercase leading-none tracking-[0.04em]">
                  {t(`shortcut.${shortcut.id}`)}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/92">
                  {t("shortcut.seeMore")}
                  <span aria-hidden="true" className="transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {featuredCards.map((card) => (
          <article
            key={card.id}
            className="overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_20px_60px_rgba(57,28,45,0.08)]"
          >
            <div className="relative h-60 bg-[color:var(--brand-soft)] overflow-hidden">
              <img
                src={card.imageSrc}
                alt={t(`card.${card.id}.alt`)}
                className="absolute inset-0 h-full w-full"
                style={{
                  objectFit: card.bgSize as "cover" | "contain",
                  objectPosition: card.bgPosition,
                }}
              />
            </div>
            <div className="space-y-4 p-6">
              <h2 className="font-display text-[2rem] leading-none text-[color:var(--text-main)]">{t(`card.${card.id}.title`)}</h2>
              <p className="text-sm leading-7 text-[color:var(--text-soft)]">{t(`card.${card.id}.description`)}</p>
              <a
                href={card.href}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
              >
                {t(`card.${card.id}.cta`)}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
