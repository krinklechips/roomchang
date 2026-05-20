import Link from "next/link";

interface IconCardItem {
  icon?: string;
  title: string;
  description: string;
  href?: string;
}

interface IconCardGridBlockProps {
  iconCardTitle?: string;
  iconCardColumns?: 2 | 3 | 4;
  iconCardItems?: IconCardItem[];
}

function getGridClass(columns: 2 | 3 | 4) {
  if (columns === 2) return "sm:grid-cols-2";
  if (columns === 4) return "sm:grid-cols-2 lg:grid-cols-4";
  return "sm:grid-cols-2 lg:grid-cols-3";
}

function CardContent({ item }: { item: IconCardItem }) {
  return (
    <>
      {item.icon && <span className="text-4xl leading-none">{item.icon}</span>}
      <h3 className="mt-5 font-display text-2xl text-[color:var(--text-main)]">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
        {item.description}
      </p>
    </>
  );
}

export function IconCardGridBlock({
  iconCardTitle,
  iconCardColumns = 3,
  iconCardItems,
}: IconCardGridBlockProps) {
  const columns = [2, 3, 4].includes(iconCardColumns) ? iconCardColumns : 3;
  const items = iconCardItems?.filter((item) => item.title && item.description) ?? [];

  if (items.length === 0) return null;

  return (
    <section className="px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        {iconCardTitle && (
          <h2 className="mb-10 text-center font-display text-4xl text-[color:var(--text-main)] lg:text-5xl">
            {iconCardTitle}
          </h2>
        )}
        <div className={`grid gap-5 ${getGridClass(columns)}`}>
          {items.map((item, i) =>
            item.href ? (
              <Link
                key={`${item.title}-${i}`}
                href={item.href}
                className="panel-card block p-6 transition-transform hover:-translate-y-1"
              >
                <CardContent item={item} />
              </Link>
            ) : (
              <div key={`${item.title}-${i}`} className="panel-card p-6">
                <CardContent item={item} />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
