import Image from "next/image";
import Link from "next/link";
import { getDoctors } from "@/lib/data";

export async function TeamGridBlock({
  title,
  filter,
  limit,
}: {
  title?: string;
  filter?: string;
  limit?: number;
}) {
  const take = limit || 8;
  const normalizedFilter = filter?.trim().toLowerCase();
  const doctors = await getDoctors();
  const items = doctors
    .filter((doctor) => {
      if (!normalizedFilter) return true;
      return (
        doctor.department?.toLowerCase().includes(normalizedFilter) ||
        doctor.role.toLowerCase().includes(normalizedFilter) ||
        doctor.specialty.some((item) => item.toLowerCase().includes(normalizedFilter))
      );
    })
    .slice(0, take);

  return (
    <section className="px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        {title && (
          <h2 className="mb-10 text-center font-display text-4xl text-[color:var(--text-main)] lg:text-5xl">
            {title}
          </h2>
        )}
        {items.length === 0 ? (
          <p className="text-center text-sm text-[color:var(--text-soft)]">No team members published yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((doc) => (
              <div key={doc.id} className="panel-card overflow-hidden p-0">
                <div className="relative h-56 w-full bg-[color:var(--brand-soft)]">
                  {doc.photoUrl ? (
                    <Image
                      src={doc.photoUrl}
                      alt={doc.name}
                      fill
                      className="object-cover object-top"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl font-semibold text-[color:var(--brand-deep)]/40">
                      {doc.initials}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[color:var(--text-main)]">{doc.name}</p>
                  {doc.credentials && (
                    <p className="text-xs text-[color:var(--brand)]">{doc.credentials}</p>
                  )}
                  <p className="mt-0.5 text-xs text-[color:var(--text-soft)]">{doc.role}</p>
                  {doc.specialty.length > 0 && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-[color:var(--text-soft)]">
                      {doc.specialty.join(" · ")}
                    </p>
                  )}
                  <Link
                    href={`/contact?doctor=${encodeURIComponent(doc.name)}`}
                    className="mt-2 inline-block text-xs font-medium text-[color:var(--brand)] hover:underline"
                  >
                    Book appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
