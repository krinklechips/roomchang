import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getPricingCategories } from "@/lib/data";

export async function PricingBlock({
  title,
  category,
}: {
  title?: string;
  category?: string;
}) {
  const t = await getTranslations("blocks.pricing");
  const allCategories = await getPricingCategories();
  const filter = category?.trim().toLowerCase();
  const categories = filter
    ? allCategories.filter((item) => item.title.toLowerCase().includes(filter))
    : allCategories;

  function formatPrice(price: string) {
    return price.toLowerCase() === "free" ? t("freeLabel") : `$${price}`;
  }

  return (
    <section className="px-6 py-8 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center font-display text-4xl text-[color:var(--text-main)] lg:text-5xl">
          {title || t("defaultTitle")}
        </h2>
        {categories.length === 0 ? (
          <p className="text-center text-sm text-[color:var(--text-soft)]">
            {t("emptyState")}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.flatMap((pricingCategory) =>
              pricingCategory.items.map((item) => (
                <div key={item.id} className="panel-card flex flex-col gap-2">
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[color:var(--brand)]">
                    {pricingCategory.title}
                  </p>
                  <p className="font-semibold text-[color:var(--text-main)]">{item.name}</p>
                  {item.ada && (
                    <p className="text-xs leading-6 text-[color:var(--text-soft)]">
                      {t("adaCode", { code: item.ada })}
                    </p>
                  )}
                  <p className="mt-auto pt-2 text-sm font-semibold text-[color:var(--brand-deep)]">
                    {formatPrice(item.price)}
                  </p>
                  <Link
                    href="/pricing"
                    className="text-xs font-medium text-[color:var(--brand)] hover:underline"
                  >
                    {t("viewFullPricing")}
                  </Link>
                </div>
              )),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
