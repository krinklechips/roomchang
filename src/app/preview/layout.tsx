import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Preview mode banner — fixed at top, always visible */}
      <div className="fixed left-0 right-0 top-0 z-[60] flex items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-sm font-semibold text-black shadow-md">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-[0.6rem] text-amber-500">
          P
        </span>
        Preview Mode — This is a draft. Changes are not visible on the live site.
      </div>
      {/* Push content below the banner */}
      <div className="pt-9">{children}</div>
    </>
  );
}
