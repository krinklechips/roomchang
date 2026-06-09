import Image from "next/image";
import { sanitizeHtml } from "@/lib/sanitize";

interface ProfileMessageBlockProps {
  profileName?: string;
  profileTitle?: string;
  profileImage?: string;
  profileMessage?: string;
}

export function ProfileMessageBlock({
  profileName,
  profileTitle,
  profileImage,
  profileMessage,
}: ProfileMessageBlockProps) {
  if (!profileName || !profileMessage) return null;

  return (
    <section className="px-6 py-8 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-3 lg:items-start">
        <aside className="lg:sticky lg:top-24">
          <div className="panel-card p-5">
            {profileImage && (
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[color:var(--brand-soft)]">
                <Image
                  src={profileImage}
                  alt={profileName}
                  fill
                  sizes="(min-width: 1024px) 28vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <h2 className="mt-5 font-display text-3xl text-[color:var(--text-main)]">
              {profileName}
            </h2>
            {profileTitle && (
              <p className="mt-2 text-sm font-semibold text-[color:var(--brand)]">
                {profileTitle}
              </p>
            )}
          </div>
        </aside>

        <div className="lg:col-span-2">
          <div
            className="prose prose-lg max-h-none max-w-none overflow-y-visible rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] p-6
              prose-headings:font-display prose-headings:text-[color:var(--text-main)]
              prose-p:text-[color:var(--text-soft)] prose-p:leading-8
              prose-a:text-[color:var(--brand)] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[color:var(--text-main)]
              lg:max-h-[72vh] lg:overflow-y-auto lg:p-8"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(profileMessage) }}
          />
        </div>
      </div>
    </section>
  );
}
