import Image from "next/image";
import { SiteShell } from "@/components/site/site-shell";

export default function Home() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top_left,_rgba(204,55,113,0.22),_transparent_48%),radial-gradient(circle_at_top_right,_rgba(111,49,161,0.18),_transparent_40%)]" />
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="relative z-10 max-w-2xl">
            <p className="inline-flex rounded-full border border-[--border-strong] bg-white/80 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[--text-soft] shadow-sm backdrop-blur">
              Premium Dental Care In Phnom Penh
            </p>
            <h1 className="mt-6 font-display text-5xl leading-[0.96] text-[--text-main] sm:text-6xl lg:text-7xl">
              A calmer, more modern front door for Roomchang.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[--text-soft] sm:text-lg">
              This is the new foundation for a multilingual, mobile-first patient experience with
              trusted service pages, streamlined appointment requests, and a premium hospital feel.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#book" className="btn-primary justify-center sm:justify-start">
                Request An Appointment
              </a>
              <a href="#services" className="btn-secondary justify-center sm:justify-start">
                Explore Services
              </a>
            </div>
          </div>

          <div className="relative z-10">
            <div className="panel-card mx-auto max-w-md p-4 sm:p-6">
              <Image
                src="/brand/roomchang-logo.jpeg"
                alt="Roomchang Dental Hospital logo"
                width={1074}
                height={768}
                priority
                className="h-auto w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
