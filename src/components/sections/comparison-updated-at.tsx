const UPDATED_LABELS: Record<string, string> = {
  en: "Last updated:",
  kh: "បានធ្វើបច្ចុប្បន្នភាពចុងក្រោយ៖",
  cn: "最后更新：",
};

export function ComparisonUpdatedAt({
  lastUpdated,
  locale,
  label,
}: {
  lastUpdated?: string | null;
  locale: string;
  label?: string;
}) {
  if (!lastUpdated?.trim()) return null;
  const date = new Date(lastUpdated);
  if (!Number.isFinite(date.getTime())) return null;
  const dateLocale = locale === "kh" ? "km-KH" : locale === "cn" ? "zh-CN" : "en-US";

  return (
    <p className="mt-3 text-xs leading-relaxed text-[color:var(--text-soft)]">
      {label ?? UPDATED_LABELS[locale] ?? UPDATED_LABELS.en}{" "}
      <time dateTime={lastUpdated}>
        {new Intl.DateTimeFormat(dateLocale, { dateStyle: "long", timeZone: "UTC" }).format(date)}
      </time>
    </p>
  );
}
