import Image from "next/image";

export function ImageBlock({ url, alt }: { url?: string; alt?: string }) {
  if (!url) return null;
  return (
    <section className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
      <div className="relative overflow-hidden rounded-xl">
        <Image
          src={url}
          alt={alt || ""}
          width={1200}
          height={630}
          className="h-auto w-full object-cover"
          sizes="(min-width: 1024px) 80vw, 100vw"
        />
      </div>
    </section>
  );
}
