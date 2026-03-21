const shortcuts = [
  {
    label: "Treatment Costs",
    href: "#costs",
    accent: "bg-[linear-gradient(135deg,#0fa5a4,#0b8b8a)]",
  },
  {
    label: "Testimonials",
    href: "#testimonials",
    accent: "bg-[linear-gradient(135deg,#a22f7b,#8c2a8d)]",
  },
  {
    label: "Our Team",
    href: "#team",
    accent: "bg-[linear-gradient(135deg,#c76ad7,#a750b7)]",
  },
  {
    label: "Make Appointment",
    href: "#book",
    accent: "bg-[linear-gradient(135deg,#1592db,#0e7cc7)]",
  },
  {
    label: "Plan Your Trip",
    href: "#trip",
    accent: "bg-[linear-gradient(135deg,#6cab18,#5a9514)]",
  },
];

const featuredCards = [
  {
    id: "international",
    title: "International Patients",
    description:
      "Support for overseas visitors, treatment planning, and a smoother arrival experience for patients coming to Phnom Penh.",
    imageSrc: "/hero/roomchang-patient-care.jpg",
    imageAlt: "Roomchang patient care team",
    href: "#trip",
  },
  {
    id: "team",
    title: "Meet Our Team",
    description:
      "Get a clearer picture of the doctors, specialists, and wider team behind Roomchang's hospital-level care model.",
    imageSrc: "/hero/roomchang-team.jpg",
    imageAlt: "Roomchang dental hospital team",
    href: "#team",
  },
  {
    id: "aligner",
    title: "Clear Aligner",
    description:
      "Featured treatment spotlight for discreet alignment options, digital planning, and smile design with clear guidance.",
    imageSrc: "/hero/roomchang-clear-aligner.jpg",
    imageAlt: "Roomchang clear aligner treatment",
    href: "#services",
  },
];

export function HomeHighlights() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[980px] grid-cols-5 gap-3 lg:min-w-0">
          {shortcuts.map((shortcut) => (
            <a
              key={shortcut.label}
              href={shortcut.href}
              className={`${shortcut.accent} group flex min-h-28 flex-col justify-between rounded-[1.75rem] p-5 text-white shadow-[0_16px_40px_rgba(34,22,31,0.12)] transition hover:-translate-y-0.5`}
            >
              <span className="text-[0.76rem] font-semibold uppercase tracking-[0.22em] text-white/70">
                Quick Access
              </span>
              <div className="space-y-2">
                <p className="text-xl font-extrabold uppercase leading-none tracking-[0.04em]">
                  {shortcut.label}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/92">
                  See more
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
            className="overflow-hidden rounded-[2rem] border border-[--border-strong] bg-white shadow-[0_20px_60px_rgba(57,28,45,0.08)]"
          >
            <div
              role="img"
              aria-label={card.imageAlt}
              className="h-60 bg-[--surface-strong] bg-cover bg-center"
              style={{ backgroundImage: `url(${card.imageSrc})` }}
            />
            <div className="space-y-4 p-6">
              <h2 className="font-display text-[2rem] leading-none text-[--text-main]">{card.title}</h2>
              <p className="text-sm leading-7 text-[--text-soft]">{card.description}</p>
              <a
                href={card.href}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[--brand-deep] transition hover:text-[--brand]"
              >
                See more
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
