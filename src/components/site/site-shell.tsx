import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
// Roomy (AI chatbot) is temporarily hidden at the clinic's request. To bring it
// back: uncomment the import + <Chatbot /> below and remove <FloatingContact />.
// import { Chatbot } from "./chatbot";
import { FloatingContact } from "./floating-contact";
import { ConsentBanner } from "./consent-banner";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--canvas)] text-[color:var(--text-main)]">
      <SiteHeader />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <SiteFooter />
      {/* <Chatbot /> — Roomy hidden for now; using the classic contact buttons */}
      <FloatingContact />
      <ConsentBanner />
    </div>
  );
}
