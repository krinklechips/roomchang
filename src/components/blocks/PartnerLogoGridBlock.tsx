import Image from "next/image";

interface PartnerLogo {
  name: string;
  logo: string;
}

interface PartnerCategory {
  name: string;
  logos: PartnerLogo[];
}

interface PartnerLogoGridBlockProps {
  partnerTitle?: string;
  partnerSubtitle?: string;
  partnerCategories?: PartnerCategory[];
}

export function PartnerLogoGridBlock({
  partnerTitle,
  partnerSubtitle,
  partnerCategories,
}: PartnerLogoGridBlockProps) {
  const categories =
    partnerCategories
      ?.map((category) => ({
        ...category,
        logos: category.logos?.filter((logo) => logo.name && logo.logo) ?? [],
      }))
      .filter((category) => category.name && category.logos.length > 0) ?? [];

  if (categories.length === 0) return null;

  return (
    <section className="px-6 py-8 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {(partnerTitle || partnerSubtitle) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {partnerTitle && (
              <h2 className="font-display text-4xl text-[color:var(--text-main)] lg:text-5xl">
                {partnerTitle}
              </h2>
            )}
            {partnerSubtitle && (
              <p className="mt-4 text-sm leading-7 text-[color:var(--text-soft)]">
                {partnerSubtitle}
              </p>
            )}
          </div>
        )}
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category.name}>
              <h3 className="mb-5 font-display text-2xl text-[color:var(--brand-deep)]">
                {category.name}
              </h3>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {category.logos.map((logo) => (
                  <div
                    key={`${category.name}-${logo.name}`}
                    className="flex min-h-28 items-center justify-center rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] p-5"
                  >
                    <Image
                      src={logo.logo}
                      alt={logo.name}
                      width={180}
                      height={72}
                      className="h-12 w-auto max-w-full object-contain"
                      sizes="(min-width: 1024px) 20vw, 45vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
