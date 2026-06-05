import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { FloatingContact } from "./floating-contact";
import { Chatbot } from "./chatbot";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--canvas)] text-[color:var(--text-main)]">
      <SiteHeader />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <SiteFooter />
      <FloatingContact />
      <Chatbot />
    </div>
  );
}
