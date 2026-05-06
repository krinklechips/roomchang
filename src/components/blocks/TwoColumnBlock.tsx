import Image from "next/image";
import { sanitizeHtml } from "@/lib/sanitize";

interface TwoColumnBlockProps {
  leftContent?: string;
  rightContent?: string;
  leftImage?: string;
  rightImage?: string;
  columnLayout?: "50-50" | "60-40" | "40-60";
}

export function TwoColumnBlock({
  leftContent,
  rightContent,
  leftImage,
  rightImage,
  columnLayout = "50-50",
}: TwoColumnBlockProps) {
  const leftClass =
    columnLayout === "60-40"
      ? "lg:w-3/5"
      : columnLayout === "40-60"
      ? "lg:w-2/5"
      : "lg:w-1/2";
  const rightClass =
    columnLayout === "60-40"
      ? "lg:w-2/5"
      : columnLayout === "40-60"
      ? "lg:w-3/5"
      : "lg:w-1/2";

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        {/* Left */}
        <div className={`w-full ${leftClass} space-y-6`}>
          {leftImage && (
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src={leftImage}
                alt=""
                width={800}
                height={500}
                className="h-64 w-full object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          )}
          {leftContent && (
            <div
              className="prose prose-sm max-w-none
                prose-headings:font-display prose-headings:text-[color:var(--text-main)]
                prose-p:text-[color:var(--text-soft)] prose-p:leading-8
                prose-a:text-[color:var(--brand)]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(leftContent) }}
            />
          )}
        </div>

        {/* Right */}
        <div className={`w-full ${rightClass} space-y-6`}>
          {rightImage && (
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src={rightImage}
                alt=""
                width={800}
                height={500}
                className="h-64 w-full object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          )}
          {rightContent && (
            <div
              className="prose prose-sm max-w-none
                prose-headings:font-display prose-headings:text-[color:var(--text-main)]
                prose-p:text-[color:var(--text-soft)] prose-p:leading-8
                prose-a:text-[color:var(--brand)]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(rightContent) }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
