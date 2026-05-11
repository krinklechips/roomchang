import { supabaseServer } from "@/lib/supabase-server";
import Image from "next/image";
import Link from "next/link";

interface Doctor {
  id: string;
  name: string;
  title: string | null;
  specialty: string | null;
  photo_url: string | null;
  slug: string | null;
}

export async function TeamGridBlock({
  title,
  filter,
  limit,
}: {
  title?: string;
  filter?: string;
  limit?: number;
}) {
  const supabase = supabaseServer;
  const take = limit || 8;

  let query = supabase
    .from("team_members")
    .select("id, name, title, specialty, photo_url, slug")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .limit(take);

  if (filter?.trim()) {
    query = query.ilike("specialty", `%${filter.trim()}%`);
  }

  const { data: doctors, error } = await query;
  if (error) console.error("[TeamGridBlock] Supabase error:", error.message);

  const items: Doctor[] = doctors ?? [];

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
                  {doc.photo_url ? (
                    <Image
                      src={doc.photo_url}
                      alt={doc.name}
                      fill
                      className="object-cover object-top"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl text-[color:var(--brand-soft)]">
                      👤
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[color:var(--text-main)]">{doc.name}</p>
                  {doc.title && (
                    <p className="text-xs text-[color:var(--brand)]">{doc.title}</p>
                  )}
                  {doc.specialty && (
                    <p className="mt-0.5 text-xs text-[color:var(--text-soft)]">{doc.specialty}</p>
                  )}
                  {doc.slug && (
                    <Link
                      href={`/team/${doc.slug}`}
                      className="mt-2 inline-block text-xs font-medium text-[color:var(--brand)] hover:underline"
                    >
                      View profile →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
