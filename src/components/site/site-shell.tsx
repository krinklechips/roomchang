import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { FloatingContact } from "./floating-contact";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[--canvas] text-[--text-main]">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingContact />
    </div>
  );
}
