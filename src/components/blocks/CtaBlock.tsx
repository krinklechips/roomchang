import Link from "next/link";

export function CtaBlock({
  buttonText,
  buttonUrl,
}: {
  buttonText?: string;
  buttonUrl?: string;
}) {
  if (!buttonText) return null;
  return (
    <section className="border-y border-[color:var(--border-strong)] bg-[color:var(--surface)]">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 py-14 text-center sm:flex-row sm:text-left lg:px-8">
        <p className="font-display text-3xl text-[color:var(--text-main)] lg:text-4xl">
          {buttonText}
        </p>
        {buttonUrl && (
          <Link href={buttonUrl} className="btn-primary shrink-0">
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
