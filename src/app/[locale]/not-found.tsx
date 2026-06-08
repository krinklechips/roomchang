import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/site/site-shell";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <SiteShell>
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:py-32">
        <p className="font-display text-7xl font-bold leading-none text-[color:var(--brand-light)] sm:text-8xl">
          {t("code")}
        </p>
        <h1 className="mt-6 font-display text-3xl text-[color:var(--text-main)] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-[color:var(--text-soft)]">
          {t("body")}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            {t("home")}
          </Link>
          <Link href="/contact" className="btn-secondary">
            {t("contact")}
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
