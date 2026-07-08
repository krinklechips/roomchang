import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const payloadLiveRefresh =
    process.env.CONTENT_SOURCE === "payload"
      ? await import("@/components/site/payload-live-refresh")
      : null;
  const PayloadLiveRefresh = payloadLiveRefresh?.PayloadLiveRefresh;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {PayloadLiveRefresh ? (
        <PayloadLiveRefresh serverURL={process.env.PAYLOAD_API_URL || "http://localhost:3100"} />
      ) : null}
      {children}
    </NextIntlClientProvider>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
