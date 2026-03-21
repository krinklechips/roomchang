export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-[--surface]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-3">
          <p className="font-display text-2xl text-[--brand-deep]">Roomchang Dental Hospital</p>
          <p className="max-w-xl text-sm leading-7 text-[--text-soft]">
            Premium dental care for local and international patients, with multilingual support,
            advanced treatment planning, and a mobile-first enquiry experience.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[--text-soft]">Contact</p>
          <div className="mt-3 space-y-2 text-sm text-[--text-main]">
            <p>contact@roomchang.com</p>
            <p>+855 23 211 338</p>
            <p>Phnom Penh, Cambodia</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[--text-soft]">Patient Access</p>
          <div className="mt-3 space-y-2 text-sm text-[--text-main]">
            <a href="#" className="block hover:text-[--brand-deep]">
              International Patients
            </a>
            <a href="#" className="block hover:text-[--brand-deep]">
              Treatment Services
            </a>
            <a href="#book" className="block hover:text-[--brand-deep]">
              Appointment Request
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
