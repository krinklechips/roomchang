"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

const CONTACTS = [
  {
    id: "messenger",
    tKey: "messenger",
    href: "https://m.me/roomchangdental",
    iconBg: "bg-gradient-to-br from-[#0078FF] to-[#A334FA]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.921 1.458 5.527 3.742 7.237V22l3.405-1.869c.91.252 1.872.388 2.853.388 5.523 0 10-4.145 10-9.276S17.523 2 12 2zm.99 12.49-2.548-2.718-4.973 2.718 5.473-5.808 2.611 2.718 4.91-2.718-5.473 5.808z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    tKey: "whatsapp",
    href: "https://api.whatsapp.com/send/?phone=85569811338&text=",
    iconBg: "bg-[#25D366]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    id: "telegram",
    tKey: "telegram",
    href: "https://telegram.me/roomchang",
    iconBg: "bg-[#2AABEE]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    id: "wechat",
    tKey: "wechat",
    href: "weixin://dl/chat?viliyanpink",
    iconBg: "bg-[#07C160]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.96 4.494c-4.063 0-7.36 2.795-7.36 6.243 0 3.447 3.297 6.243 7.36 6.243a8.77 8.77 0 0 0 2.42-.34.86.86 0 0 1 .606.083l1.61.945a.283.283 0 0 0 .142.046c.134 0 .244-.112.244-.25 0-.06-.024-.12-.04-.18l-.33-1.255a.588.588 0 0 1 .18-.56c1.553-1.145 2.529-2.844 2.529-4.732 0-3.448-3.298-6.243-7.36-6.243zm-2.44 3.375c.543 0 .983.447.983.998a.99.99 0 0 1-.983.998.99.99 0 0 1-.983-.998c0-.551.44-.998.983-.998zm4.879 0c.543 0 .983.447.983.998a.99.99 0 0 1-.983.998.99.99 0 0 1-.983-.998c0-.551.44-.998.983-.998z" />
      </svg>
    ),
  },
  {
    id: "enquiry",
    tKey: "enquiry",
    href: "/contact#enquiry-form",
    iconBg: "bg-[color:var(--brand-soft)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[color:var(--brand-deep)]">
        <path d="M14 3H6a2 2 0 0 0-2 2v13l4-4h10a2 2 0 0 0 2-2V9" />
        <path d="M18 2l-3 3 3 3" />
        <path d="M15 5h6" />
      </svg>
    ),
  },
];

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("floatingContact");

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2.5 sm:bottom-6 sm:right-6 sm:gap-3">
      {/* Contact options */}
      {open && (
        <div className="flex flex-col gap-2.5 animate-[fadeSlideUp_0.2s_ease-out]">
          {CONTACTS.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target={c.id === "enquiry" ? "_self" : "_blank"}
              rel={c.id === "enquiry" ? undefined : "noopener noreferrer"}
              aria-label={t(c.tKey)}
              title={t(c.tKey)}
              className={`flex h-12 w-12 items-center justify-center rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.22)] ${c.iconBg}`}
            >
              {c.icon}
            </a>
          ))}
        </div>
      )}

      {/* Toggle button — Roomchang mark */}
      <button
        type="button"
        aria-label={open ? t("closeAriaLabel") : t("openAriaLabel")}
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--brand)] shadow-[0_8px_28px_rgba(204,55,113,0.45)] transition hover:bg-[color:var(--brand-deep)] hover:scale-105 active:scale-95 sm:h-14 sm:w-14"
      >
        {/* X icon when open */}
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
            open ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        </span>
        {/* Logo mark when closed */}
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
            open ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
          }`}
        >
          <Image
            src="/brand/roomchang-mark.jpeg"
            alt={t("contactAlt")}
            width={36}
            height={36}
            className="rounded-full object-cover"
            style={{ width: "auto", height: "auto" }}
          />
        </span>
      </button>
    </div>
  );
}
