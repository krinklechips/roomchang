"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import {
  CalendarDots,
  ChatCircleDots,
  PaperPlaneTilt,
  Tooth,
  X,
  SpinnerGap,
  CaretLeft,
  CaretRight,
  Microphone,
  WhatsappLogo,
  TelegramLogo,
  CheckCircle,
} from "@phosphor-icons/react";
import { useVoiceRecorder } from "@/lib/use-voice-recorder";

// ─── Types ───────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type BookingData = {
  name: string;
  email: string;
  phone: string;
  telegram: string;
  treatment: string;
  date: string;
  time: string;
  branch: string;
  doctor: string;
  notes?: string;
  message?: string;
};

type SlotOption = {
  time: string;
  available: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractBooking(text: string): BookingData | null {
  const match = text.match(
    /<<<BOOKING_DATA>>>([\s\S]*?)<<<END_BOOKING>>>/,
  );
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim()) as BookingData;
  } catch {
    return null;
  }
}

function stripBookingBlock(text: string): string {
  return text
    .replace(/<<<BOOKING_DATA>>>[\s\S]*?<<<END_BOOKING>>>/, "")
    .replace(/<<<SHOW_DATE_PICKER>>>/g, "")
    .replace(/<<<SHOW_TIME_PICKER>>>/g, "")
    .trim();
}

/** Strip Markdown/link syntax so text-to-speech reads naturally (no spoken
 *  asterisks, bullet dashes, headings, or raw URLs). */
function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, "$1") // [label](url) → label
    .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")        // `code` → code
    .replace(/(\*\*|__)(.*?)\1/g, "$2")            // **bold** / __bold__ → bold
    .replace(/(\*|_)(.*?)\1/g, "$2")               // *italic* / _italic_ → italic
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")            // # headings
    .replace(/^\s*[-*•]\s+/gm, "")                  // bullet markers
    .replace(/\n{2,}/g, ". ")                        // paragraph breaks → pause
    .replace(/\s+/g, " ")
    .trim();
}

function hasDatePickerMarker(text: string): boolean {
  return text.includes("<<<SHOW_DATE_PICKER>>>");
}

function hasTimePickerMarker(text: string): boolean {
  return text.includes("<<<SHOW_TIME_PICKER>>>");
}

// ─── Markdown renderer ─────────────────────────────────────────────────────
// onItemClick is optional — when provided, list items become clickable chips

function renderMarkdown(
  text: string,
  onItemClick?: (item: string) => void,
): ReactNode {
  const blocks = text.split(/\n\n+/);

  return blocks.map((block, bi) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Check if this block is a list (lines starting with - or *)
    const lines = trimmed.split("\n");
    const isList = lines.every((l) => /^\s*[-*]\s/.test(l));

    if (isList) {
      return (
        <ul key={bi} className="my-1.5 space-y-1">
          {lines.map((line, li) => {
            const itemText = line.replace(/^\s*[-*]\s+/, "");
            // Strip bold markers for the click text
            const plainText = itemText.replace(/\*\*/g, "");

            return (
              <li key={li} className="flex items-start gap-2 text-sm leading-relaxed">
                <Tooth size={12} weight="fill" className="mt-[5px] shrink-0 text-[color:var(--brand-light)]" aria-hidden="true" />
                <span className="min-w-0">
                  {onItemClick ? (
                    <button
                      type="button"
                      onClick={() =>
                        onItemClick(`Tell me more about ${plainText}`)
                      }
                      className="text-left underline decoration-[color:var(--brand-light)] decoration-1 underline-offset-2 transition hover:text-[color:var(--brand)] hover:decoration-2"
                    >
                      {renderInline(itemText)}
                    </button>
                  ) : (
                    renderInline(itemText)
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      );
    }

    // Numbered list (1. 2. 3.) — render each item on its own line. Without this,
    // the paragraph branch below collapses the newlines into spaces and the list
    // runs together (e.g. the branch picker in the booking flow).
    const isOrderedList =
      lines.length > 1 && lines.every((l) => /^\s*\d+\.\s/.test(l));

    if (isOrderedList) {
      return (
        <ol key={bi} className="my-1.5 space-y-1">
          {lines.map((line, li) => {
            const m = line.match(/^\s*(\d+)\.\s+(.*)$/);
            const num = m ? m[1] : String(li + 1);
            const itemText = m ? m[2] : line.trim();

            return (
              <li key={li} className="flex items-start gap-2 text-sm leading-relaxed">
                <span className="mt-[1px] shrink-0 font-semibold text-[color:var(--brand)]">
                  {num}.
                </span>
                <span className="min-w-0">{renderInline(itemText)}</span>
              </li>
            );
          })}
        </ol>
      );
    }

    // Regular paragraph — preserve intentional single line breaks as <br>, so a
    // list/sequence the model put on separate lines stays on separate lines.
    return (
      <p key={bi} className={bi > 0 ? "mt-2" : ""}>
        {lines.map((line, li) => (
          <span key={li}>
            {li > 0 && <br />}
            {renderInline(line)}
          </span>
        ))}
      </p>
    );
  });
}

function renderInline(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Match either **bold** or [link text](url)
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const linkMatch = remaining.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);

    // Pick whichever comes first
    const boldIdx = boldMatch?.index ?? Infinity;
    const linkIdx = linkMatch?.index ?? Infinity;

    if (boldIdx === Infinity && linkIdx === Infinity) {
      parts.push(remaining);
      break;
    }

    if (linkIdx < boldIdx && linkMatch && linkMatch.index !== undefined) {
      // Link comes first
      if (linkMatch.index > 0) {
        parts.push(remaining.slice(0, linkMatch.index));
      }
      parts.push(
        <a
          key={key++}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[color:var(--brand)] underline decoration-1 underline-offset-2 transition hover:text-[color:var(--brand-deep)]"
        >
          {linkMatch[1]}
        </a>,
      );
      remaining = remaining.slice(linkMatch.index + linkMatch[0].length);
    } else if (boldMatch && boldMatch.index !== undefined) {
      // Bold comes first
      if (boldMatch.index > 0) {
        parts.push(remaining.slice(0, boldMatch.index));
      }
      parts.push(
        <strong key={key++} className="font-semibold">
          {boldMatch[1]}
        </strong>,
      );
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
    }
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

// ─── Date helpers ───────────────────────────────────────────────────────────

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const FULL_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDateForMessage(date: Date): string {
  const day = DAY_NAMES[date.getDay()];
  const month = MONTH_NAMES[date.getMonth()];
  return `${day}, ${month} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function extractIsoDate(text: string): string | null {
  const match = text.match(/\b\d{4}-\d{2}-\d{2}\b/);
  return match ? match[0] : null;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Typing dots ─────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-light)] animate-pulse"
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </div>
  );
}

// ─── Booking confirmation ────────────────────────────────────────────────────

// Clinic channels patients send their booking summary to (staff monitor these).
const CLINIC_WHATSAPP_PHONE = "85569811338";
const CLINIC_TELEGRAM_URL = "https://telegram.me/roomchang";

// Always-reachable "talk to a human" channels, shown as a persistent row at the
// top of the chat panel so a patient can reach real staff at any point — not
// only at the end of a booking. Brand SVGs mirror <FloatingContact>.
const HUMAN_CHANNELS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://api.whatsapp.com/send/?phone=85569811338&text=",
    bg: "bg-[#25D366]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-white" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    id: "telegram",
    label: "Telegram",
    href: "https://telegram.me/roomchang",
    bg: "bg-[#2AABEE]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-white" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    id: "messenger",
    label: "Messenger",
    href: "https://m.me/roomchangdental",
    bg: "bg-gradient-to-br from-[#0078FF] to-[#A334FA]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-white" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.921 1.458 5.527 3.742 7.237V22l3.405-1.869c.91.252 1.872.388 2.853.388 5.523 0 10-4.145 10-9.276S17.523 2 12 2zm.99 12.49-2.548-2.718-4.973 2.718 5.473-5.808 2.611 2.718 4.91-2.718-5.473 5.808z" />
      </svg>
    ),
  },
] as const;

/** Human-readable summary the patient sends to the clinic to confirm. */
function buildBookingSummary(d: BookingData): string {
  const lines = [
    "Hi Roomchang! I'd like to book an appointment:",
    d.name && `• Name: ${d.name}`,
    d.phone && `• Phone: ${d.phone}`,
    d.email && `• Email: ${d.email}`,
    d.treatment && `• Treatment: ${d.treatment}`,
    d.date && `• Preferred date: ${d.date}`,
    d.time && `• Preferred time: ${d.time}`,
    d.branch && `• Branch: ${d.branch}`,
    d.doctor && `• Doctor: ${d.doctor}`,
    d.telegram && `• My Telegram: ${d.telegram}`,
    d.notes && `• Notes: ${d.notes}`,
  ].filter(Boolean);
  return lines.join("\n");
}

function BookingCard({
  data,
  submitting,
  error,
  onConfirm,
  onSend,
  onEdit,
}: {
  data: BookingData;
  submitting: boolean;
  error: string | null;
  onConfirm: () => void;
  onSend: (channel: "whatsapp" | "telegram") => void;
  onEdit: () => void;
}) {
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Treatment", data.treatment],
    ["Date", data.date],
    ["Time", data.time],
    ["Branch", data.branch],
    ["Doctor", data.doctor],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <div className="mx-3 mb-3 rounded-xl border border-[color:var(--brand-soft)] bg-[color:var(--brand-soft)] p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--brand)]">
        Confirm your appointment
      </p>
      <div className="mt-2 space-y-1 text-sm text-[color:var(--text-main)]">
        {rows.map(([label, value]) => (
          <p key={label}>
            <span className="font-semibold">{label}:</span> {value}
          </p>
        ))}
      </div>
      <p className="mt-2 text-[11px] leading-snug text-[color:var(--text-soft)]">
        Tap confirm to send your request — our team will review it and confirm your appointment.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium leading-snug text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2">
        {/* Primary action — books the appointment for real */}
        <button
          type="button"
          onClick={onConfirm}
          disabled={submitting}
          className="flex items-center justify-center gap-1.5 rounded-full bg-[color:var(--brand)] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[color:var(--brand-deep)] disabled:opacity-60"
        >
          {submitting ? (
            <>
              <SpinnerGap size={16} className="animate-spin" /> Booking…
            </>
          ) : (
            <>
              <CheckCircle size={16} weight="fill" />{" "}
              {error ? "Try again" : "Confirm appointment"}
            </>
          )}
        </button>

        {/* Alternative — message a human directly (does not reserve a slot) */}
        <p className="mt-1 text-center text-[10px] font-semibold uppercase tracking-wider text-[color:var(--text-soft)]">
          or message us directly
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSend("whatsapp")}
            disabled={submitting}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white transition hover:brightness-95 disabled:opacity-60"
          >
            <WhatsappLogo size={16} weight="fill" /> WhatsApp
          </button>
          <button
            type="button"
            onClick={() => onSend("telegram")}
            disabled={submitting}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#229ED9] px-4 py-2.5 text-xs font-bold text-white transition hover:brightness-95 disabled:opacity-60"
          >
            <TelegramLogo size={16} weight="fill" /> Telegram
          </button>
        </div>
        <button
          type="button"
          onClick={onEdit}
          disabled={submitting}
          className="rounded-full border border-[color:var(--border-strong)] bg-white px-4 py-2 text-xs font-bold text-[color:var(--text-soft)] transition hover:bg-[color:var(--surface-strong)] disabled:opacity-60"
        >
          Edit details
        </button>
      </div>
    </div>
  );
}

// ─── Date picker with month/year navigation ────────────────────────────────

function DatePicker({ onSelect }: { onSelect: (date: string) => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Compute bounds: tomorrow to ~1 year out
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  // Generate calendar grid for current view month
  const lastOfMonth = new Date(viewYear, viewMonth + 1, 0);

  // Build grid: 6 columns Mon–Sat (we skip Sundays)
  const daysInMonth: (Date | null)[] = [];
  for (let d = 1; d <= lastOfMonth.getDate(); d++) {
    const date = new Date(viewYear, viewMonth, d);
    const dow = date.getDay();
    if (dow === 0) continue; // Skip Sundays
    daysInMonth.push(date);
  }

  // Pad start: figure out what column the first non-Sunday day lands on
  // Mon=1 → col 0, Tue=2 → col 1, ... Sat=6 → col 5

  const canPrevMonth = () => {
    if (viewYear > today.getFullYear()) return true;
    if (viewYear === today.getFullYear() && viewMonth > today.getMonth())
      return true;
    return false;
  };

  const canNextMonth = () => {
    if (viewYear < maxDate.getFullYear()) return true;
    if (
      viewYear === maxDate.getFullYear() &&
      viewMonth < maxDate.getMonth()
    )
      return true;
    return false;
  };

  const prevMonth = () => {
    if (!canPrevMonth()) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (!canNextMonth()) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isDateSelectable = (date: Date) => {
    return date >= tomorrow && date <= maxDate;
  };

  // Generate available months for the picker
  const availableMonths: { month: number; year: number; label: string }[] = [];
  const cursor = new Date(today.getFullYear(), today.getMonth(), 1);
  while (cursor <= maxDate) {
    availableMonths.push({
      month: cursor.getMonth(),
      year: cursor.getFullYear(),
      label: `${FULL_MONTH_NAMES[cursor.getMonth()]} ${cursor.getFullYear()}`,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return (
    <div className="mx-3 mb-3 rounded-xl border border-[color:var(--brand-soft)] bg-white p-3">
      {/* Header with month/year */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[color:var(--brand)]">
          <CalendarDots size={14} weight="fill" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Pick a date
          </span>
        </div>
      </div>

      {/* Month/year navigation bar */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canPrevMonth()}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[color:var(--brand)] transition hover:bg-[color:var(--brand-soft)] disabled:opacity-30"
          aria-label="Previous month"
        >
          <CaretLeft size={14} weight="bold" />
        </button>

        {/* Clickable month/year label — opens month picker */}
        <button
          type="button"
          onClick={() => setShowMonthPicker((v) => !v)}
          className="rounded-lg px-3 py-1 text-sm font-bold text-[color:var(--brand-deep)] transition hover:bg-[color:var(--brand-soft)]"
        >
          {FULL_MONTH_NAMES[viewMonth]} {viewYear}
        </button>

        <button
          type="button"
          onClick={nextMonth}
          disabled={!canNextMonth()}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[color:var(--brand)] transition hover:bg-[color:var(--brand-soft)] disabled:opacity-30"
          aria-label="Next month"
        >
          <CaretRight size={14} weight="bold" />
        </button>
      </div>

      {/* Month picker dropdown */}
      {showMonthPicker && (
        <div className="mb-2 grid grid-cols-3 gap-1 rounded-lg border border-[color:var(--brand-soft)] bg-[color:var(--surface)] p-2">
          {availableMonths.map((m) => {
            const isCurrent =
              m.month === viewMonth && m.year === viewYear;
            return (
              <button
                key={`${m.year}-${m.month}`}
                type="button"
                onClick={() => {
                  setViewMonth(m.month);
                  setViewYear(m.year);
                  setShowMonthPicker(false);
                }}
                className={`rounded-lg px-1 py-1.5 text-[10px] font-semibold transition ${
                  isCurrent
                    ? "bg-[color:var(--brand)] text-white"
                    : "text-[color:var(--text-main)] hover:bg-[color:var(--brand-soft)]"
                }`}
              >
                {MONTH_NAMES[m.month]} {m.year !== today.getFullYear() ? m.year : ""}
              </button>
            );
          })}
        </div>
      )}

      {/* Day-of-week labels */}
      <div className="mb-1 grid grid-cols-6 gap-1 text-center">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span
            key={d}
            className="text-[10px] font-semibold text-[color:var(--text-soft)]"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-6 gap-1">
        {daysInMonth.map((date) => {
          if (!date) return null;
          const dow = date.getDay(); // Mon=1 ... Sat=6
          const col = dow === 0 ? 6 : dow; // shouldn't happen (Sundays skipped) but just in case
          const selectable = isDateSelectable(date);
          const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={!selectable}
              onClick={() => onSelect(formatDateForApi(date))}
              style={{ gridColumn: col }}
              className={`flex h-8 items-center justify-center rounded-lg text-center text-sm transition ${
                selectable
                  ? "font-bold text-[color:var(--text-main)] hover:border-[color:var(--brand-light)] hover:bg-[color:var(--brand-soft)] active:scale-95"
                  : "text-[color:var(--text-soft)]/30 cursor-not-allowed"
              } ${isToday ? "ring-1 ring-[color:var(--brand-light)]" : ""}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-2 text-center">
        <span className="text-[10px] text-[color:var(--text-soft)]">
          Mon – Sat &bull; 8:00–17:30
        </span>
      </div>
    </div>
  );
}

// ─── Time picker grouped by appointment period ──────────────────────────────

const TIME_PERIODS = [
  { label: "Morning", start: "08:00", end: "11:30" },
  { label: "Midday", start: "12:00", end: "13:30" },
  { label: "Afternoon", start: "14:00", end: "17:00" },
];

function timeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function TimePicker({
  date,
  onSelect,
}: {
  date: string | null;
  onSelect: (time: string) => void;
}) {
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/slots?date=${encodeURIComponent(date)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<SlotOption[]>;
      })
      .then((data) => setSlots(data))
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("[chatbot] Slot fetch error:", err);
        setError("Unable to load times. Please type your preferred time.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [date]);

  if (!date) {
    return (
      <div className="mx-3 mb-3 rounded-xl border border-[color:var(--brand-soft)] bg-white p-3 text-xs text-[color:var(--text-soft)]">
        Please choose a date first so we can show available times.
      </div>
    );
  }

  return (
    <div className="mx-3 mb-3 rounded-xl border border-[color:var(--brand-soft)] bg-white p-3">
      <div className="mb-3 flex items-center gap-1.5 text-[color:var(--brand)]">
        <CalendarDots size={14} weight="fill" />
        <span className="text-xs font-bold uppercase tracking-widest">
          Pick a time
        </span>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-[color:var(--text-soft)]">
          <SpinnerGap size={14} className="animate-spin" />
          Loading available times...
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {TIME_PERIODS.map((period) => {
            const start = timeToMinutes(period.start);
            const end = timeToMinutes(period.end);
            const periodSlots = slots.filter((slot) => {
              const minutes = timeToMinutes(slot.time);
              return minutes >= start && minutes <= end;
            });

            return (
              <div key={period.label}>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-soft)]">
                  {period.label}
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {periodSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => onSelect(slot.time)}
                      className={`h-8 rounded-lg text-xs font-bold transition ${
                        slot.available
                          ? "border border-[color:var(--brand-light)] bg-white text-[color:var(--brand)] hover:bg-[color:var(--brand-soft)] active:scale-95"
                          : "cursor-not-allowed border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--text-soft)]/45"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Persistent suggestion bar with scroll chevrons ─────────────────────────

const SUGGESTIONS = [
  { label: "Our services", text: "What dental services do you offer?" },
  { label: "Meet our doctors", text: "Tell me about your doctors" },
  { label: "Implant prices", text: "How much do dental implants cost?" },
  { label: "Book appointment", text: "I'd like to book an appointment" },
  {
    label: "Teeth whitening",
    text: "Do you offer teeth whitening? How much does it cost?",
  },
  {
    label: "Braces options",
    text: "What braces and aligner options do you have?",
  },
  {
    label: "Visiting from abroad",
    text: "I'm travelling from abroad — how does it work?",
  },
  {
    label: "Opening hours",
    text: "What are your opening hours and location?",
  },
];

function SuggestionBar({
  onSelect,
  disabled,
}: {
  onSelect: (text: string) => void;
  disabled: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 160, behavior: "smooth" });
  };

  return (
    <div className="relative shrink-0 border-t border-[color:var(--border-strong)] bg-[color:var(--surface)]">
      {/* Left chevron */}
      {showLeft && (
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll suggestions left"
          className="absolute left-0 top-0 z-10 flex h-full w-7 items-center justify-center bg-gradient-to-r from-[color:var(--surface)] via-[color:var(--surface)] to-transparent"
        >
          <CaretLeft
            size={14}
            weight="bold"
            className="text-[color:var(--brand)]"
          />
        </button>
      )}

      {/* Scrollable chips */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto px-3 py-2 scrollbar-none"
      >
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(s.text)}
            className="shrink-0 rounded-full border border-[color:var(--brand-light)] bg-white px-3 py-1.5 text-[11px] font-semibold text-[color:var(--brand)] transition hover:bg-[color:var(--brand-soft)] active:scale-95 disabled:opacity-40"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Right chevron */}
      {showRight && (
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll suggestions right"
          className="absolute right-0 top-0 z-10 flex h-full w-7 items-center justify-center bg-gradient-to-l from-[color:var(--surface)] via-[color:var(--surface)] to-transparent"
        >
          <CaretRight
            size={14}
            weight="bold"
            className="text-[color:var(--brand)]"
          />
        </button>
      )}
    </div>
  );
}

// ─── Main chatbot ────────────────────────────────────────────────────────────

const STORAGE_KEY = "rc-chatbot-session";
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

const GREETING: Message = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi, I'm Roomy — Roomchang's virtual assistant! 😊 I can help you with treatment information, pricing, or booking an appointment. How can I help you today?",
};

const ROOMY_AVATAR = "/chatbot/roomy-aibot.png";

/** Save messages to localStorage with a timestamp */
function persistMessages(msgs: Message[]) {
  try {
    const payload = JSON.stringify({ ts: Date.now(), messages: msgs });
    localStorage.setItem(STORAGE_KEY, payload);
  } catch { /* quota exceeded — degrade silently */ }
}

/** Load messages from localStorage if the session is still fresh */
function loadPersistedMessages(): Message[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { ts, messages } = JSON.parse(raw) as { ts: number; messages: Message[] };
    if (Date.now() - ts > SESSION_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return messages;
  } catch {
    return null;
  }
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    // Will be re-hydrated in useEffect to avoid SSR mismatch
    return [GREETING];
  });
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<BookingData | null>(
    null,
  );
  // Real booking submission state — the confirm card POSTs to /api/book and we
  // surface success/failure loudly rather than faking a confirmation.
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  // Gate the conversation behind a "Start Chat" tap so no API call fires on a
  // casual open. Becomes true once a real conversation exists (a user message).
  const [started, setStarted] = useState(false);
  // Briefly show a "Roomy is typing" beat before the greeting reveals on Start.
  const [greetingTyping, setGreetingTyping] = useState(false);

  // Voice conversation (OpenAI Whisper STT + OpenAI TTS). English only for now.
  const { state: voiceState, setState: setVoiceState, listenOnce, cancel: cancelVoice, release: releaseVoice } = useVoiceRecorder();

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSpokenIdRef = useRef<string | null>(null);
  const voiceModeRef = useRef(false);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

  // ─── Session persistence ──────────────────────────────────────────────────

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    const saved = loadPersistedMessages();
    if (saved && saved.length > 0) {
      // Refresh the stored greeting with the current copy so a returning
      // session doesn't keep showing an outdated welcome message.
      const refreshed = saved.map((m) =>
        m.id === "greeting" ? { ...m, content: GREETING.content } : m,
      );
      setMessages(refreshed);
      // An ongoing conversation (any user message) skips the Start gate.
      if (refreshed.some((m) => m.role === "user")) setStarted(true);
    }
    setHydrated(true);
  }, []);

  // Persist messages on every change (after hydration)
  useEffect(() => {
    if (hydrated) {
      persistMessages(messages);
    }
  }, [messages, hydrated]);

  // Sync across tabs via storage event
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const { messages: synced } = JSON.parse(e.newValue) as { ts: number; messages: Message[] };
        if (synced && synced.length > 0) {
          setMessages(synced);
        }
      } catch { /* ignore parse errors */ }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, showDatePicker, showTimePicker, scrollToBottom]);

  // On open: jump to the latest message (don't auto-focus the input — that
  // pops the mobile keyboard and shoves the conversation up).
  useEffect(() => {
    if (!open) return;
    // wait for the panel's open animation to settle, then pin to the bottom
    const t1 = setTimeout(scrollToBottom, 60);
    const t2 = setTimeout(scrollToBottom, 260);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open, scrollToBottom]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // ─── Speech bubble prompt ────────────────────────────────────────────────

  // Show speech bubble after a short delay on first visit
  useEffect(() => {
    if (open) return;
    try {
      if (sessionStorage.getItem("rc-bubble-seen")) return;
    } catch { /* SSR / privacy mode */ }
    const timer = setTimeout(() => {
      if (!open) setShowBubble(true);
    }, 4000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (!showBubble) return;
    const timer = setTimeout(() => setShowBubble(false), 10_000);
    return () => clearTimeout(timer);
  }, [showBubble]);

  // Hide bubble when chat opens
  useEffect(() => {
    if (open && showBubble) {
      setShowBubble(false);
      try { sessionStorage.setItem("rc-bubble-seen", "1"); } catch {}
    }
  }, [open, showBubble]);

  // ─── Send message ─────────────────────────────────────────────────────────

  // Deliberate entry point: reveal the greeting after a short "typing" beat so
  // Roomy feels like it's writing the welcome rather than snapping in instantly.
  function handleStart() {
    setStarted(true);
    setGreetingTyping(true);
    window.setTimeout(() => setGreetingTyping(false), 900);
  }

  function handleSuggestionClick(text: string) {
    if (isStreaming) return;
    sendMessage(text);
  }

  function handleDateSelect(dateStr: string) {
    setSelectedDate(dateStr);
    setShowDatePicker(false);
    sendMessage(dateStr);
  }

  function handleTimeSelect(timeStr: string) {
    setShowTimePicker(false);
    sendMessage(timeStr);
  }

  // Clickable list items in assistant messages trigger follow-up questions
  function handleListItemClick(text: string) {
    if (isStreaming) return;
    sendMessage(text);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage(text);
  }

  // ─── Voice conversation (Whisper STT + OpenAI TTS) ─────────────────────────

  const stopTtsAudio = useCallback(() => {
    const a = ttsAudioRef.current;
    if (a) {
      a.pause();
      a.src = "";
      ttsAudioRef.current = null;
    }
  }, []);

  const exitVoiceMode = useCallback(() => {
    voiceModeRef.current = false;
    setVoiceMode(false);
    cancelVoice();
    releaseVoice();
    stopTtsAudio();
  }, [cancelVoice, releaseVoice, stopTtsAudio]);

  // Listen for one spoken turn → transcribe → send. The reply + read-aloud +
  // next turn are driven by the effect below.
  const runVoiceTurn = useCallback(async () => {
    if (!voiceModeRef.current) return;
    const blob = await listenOnce();
    if (!voiceModeRef.current) return;
    if (!blob) {
      // 10s of silence (or cancelled) → leave voice mode
      exitVoiceMode();
      return;
    }
    setVoiceState("thinking");
    try {
      const fd = new FormData();
      fd.append("audio", blob, "speech.webm");
      const res = await fetch("/api/transcribe", { method: "POST", body: fd });
      const data = await res.json();
      if (!voiceModeRef.current) return;
      const text = (data?.text ?? "").trim();
      if (!text) {
        runVoiceTurn(); // nothing heard — listen again
        return;
      }
      sendMessage(text);
    } catch {
      if (voiceModeRef.current) runVoiceTurn();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listenOnce, exitVoiceMode, setVoiceState]);

  function toggleVoiceMode() {
    if (voiceModeRef.current) {
      exitVoiceMode();
      return;
    }
    if (isStreaming) return;
    voiceModeRef.current = true;
    setVoiceMode(true);

    // If the last message is an assistant line that hasn't been read yet (e.g.
    // the greeting on first entry), let the speak-effect read it and start
    // listening only once playback ends — otherwise the mic would record Roomy's
    // own voice and the two loops would collide. If there's nothing to read,
    // start listening right away.
    const last = messages[messages.length - 1];
    const willSpeakFirst =
      !!last &&
      last.role === "assistant" &&
      last.id !== lastSpokenIdRef.current &&
      !!stripMarkdownForSpeech(stripBookingBlock(last.content)).trim();
    if (!willSpeakFirst) runVoiceTurn();
  }

  // When a reply finishes streaming in voice mode: speak it (OpenAI TTS), then
  // listen for the next turn once playback ends.
  useEffect(() => {
    if (!voiceMode || isStreaming) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant" || last.id === lastSpokenIdRef.current) return;
    lastSpokenIdRef.current = last.id;

    const text = stripMarkdownForSpeech(stripBookingBlock(last.content));
    if (!text) {
      if (voiceModeRef.current) runVoiceTurn();
      return;
    }

    let cancelled = false;
    setVoiceState("speaking");
    (async () => {
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!res.ok) throw new Error("tts failed");
        const buf = await res.arrayBuffer();
        if (cancelled || !voiceModeRef.current) return;
        const url = URL.createObjectURL(new Blob([buf], { type: "audio/mpeg" }));
        const audio = new Audio(url);
        ttsAudioRef.current = audio;
        const next = () => {
          URL.revokeObjectURL(url);
          if (voiceModeRef.current) runVoiceTurn();
        };
        audio.onended = next;
        audio.onerror = next;
        await audio.play();
      } catch {
        if (voiceModeRef.current) runVoiceTurn(); // skip speaking, keep the conversation going
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [messages, isStreaming, voiceMode, runVoiceTurn, setVoiceState]);

  // Clean up the mic/audio if the panel closes
  useEffect(() => {
    if (!open && voiceModeRef.current) exitVoiceMode();
  }, [open, exitVoiceMode]);

  // On mobile the panel is a near-full-screen sheet — lock the page behind it so
  // scrolling stays inside the chat instead of moving the page.
  useEffect(() => {
    if (!open || typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 639px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Voice needs mic recording — supported on iOS Safari, Android, and desktop over HTTPS
  useEffect(() => {
    setVoiceSupported(
      typeof navigator !== "undefined" &&
        !!navigator.mediaDevices?.getUserMedia &&
        typeof window !== "undefined" &&
        typeof window.MediaRecorder !== "undefined",
    );
  }, []);

  async function sendMessage(text: string) {
    if (!text || isStreaming) return;
    if (!started) setStarted(true);

    const isoDate = extractIsoDate(text);
    if (isoDate) {
      setSelectedDate(isoDate);
    }

    const userMsg: Message = { id: uid(), role: "user", content: text };
    const assistantMsg: Message = {
      id: uid(),
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsStreaming(true);

    try {
      const history = [...messages.filter((m) => m.id !== "greeting"), userMsg]
        .filter((m) => m.content.trim())
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = "";
      // Reveal the date/time picker the instant its marker streams in, rather
      // than waiting for the whole reply to finish — removes the calendar lag.
      let dateShown = false;
      let timeShown = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              fullContent += parsed.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsg.id
                    ? { ...m, content: stripBookingBlock(fullContent) }
                    : m,
                ),
              );

              if (!dateShown && hasDatePickerMarker(fullContent)) {
                dateShown = true;
                setShowDatePicker(true);
              }
              if (!timeShown && hasTimePickerMarker(fullContent)) {
                timeShown = true;
                const d = extractIsoDate(fullContent);
                if (d) setSelectedDate(d);
                setShowTimePicker(true);
              }
            }
          } catch {
            // skip malformed SSE line
          }
        }
      }

      // Check for booking data
      const booking = extractBooking(fullContent);
      if (booking) {
        setPendingBooking(booking);
      }
    } catch (err) {
      console.error("[chatbot] Error:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? {
                ...m,
                content:
                  "Sorry, I'm having trouble connecting right now. Please try again or contact us directly at +855 69 811 338.",
              }
            : m,
        ),
      );
    } finally {
      setIsStreaming(false);
    }
  }

  // ─── Submit booking ────────────────────────────────────────────────────────

  // Patient sends their booking summary to the clinic's Telegram/WhatsApp; a
  // staff member then confirms the appointment. WhatsApp pre-fills the message;
  // Telegram can't pre-fill a username chat, so we copy it for pasting.
  /** Submit the booking for real: reserve the slot + email staff via /api/book.
   *  Succeeds → confirmation message with a reference. Fails → show the actual
   *  error and keep the card so the patient can edit/retry or message a human.
   *  (Fail loud, never fake.) */
  async function handleBookingConfirm() {
    if (!pendingBooking || bookingSubmitting) return;
    setBookingSubmitting(true);
    setBookingError(null);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pendingBooking.name,
          email: pendingBooking.email,
          phone: pendingBooking.phone,
          telegram: pendingBooking.telegram,
          treatment: pendingBooking.treatment,
          date: pendingBooking.date,
          time: pendingBooking.time,
          branch: pendingBooking.branch,
          doctor: pendingBooking.doctor,
          notes: pendingBooking.notes ?? "",
        }),
      });

      let payload: { ok?: boolean; bookingId?: unknown; error?: string } = {};
      try {
        payload = await res.json();
      } catch {
        /* non-JSON response handled by the !res.ok branch below */
      }

      if (!res.ok || !payload.ok) {
        // 409 = slot taken, 400 = validation, 5xx = server. Show the real reason.
        const reason =
          res.status === 409
            ? "That time slot was just taken. Please pick another time."
            : payload.error ||
              "We couldn't complete your booking just now.";
        setBookingError(reason);
        return;
      }

      const ref = payload.bookingId ? ` (ref #${String(payload.bookingId)})` : "";
      setPendingBooking(null);
      setBookingError(null);
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: `✅ Your appointment request is in${ref}! Our team will review it and confirm shortly${pendingBooking.email ? ", and a confirmation email is on its way" : ""}. You can also message us anytime using the buttons at the top. 😊`,
        },
      ]);
    } catch {
      // Network/unreachable — fail loud and point to the human channels.
      setBookingError(
        "We couldn't reach our booking system. Please check your connection and try again, or message us directly using the buttons at the top.",
      );
    } finally {
      setBookingSubmitting(false);
    }
  }

  /** Optional alternative to confirming in-chat: send the summary to a human via
   *  WhatsApp/Telegram. Does NOT reserve a slot — staff handle it manually. */
  function handleBookingSend(channel: "whatsapp" | "telegram") {
    if (!pendingBooking) return;
    const summary = buildBookingSummary(pendingBooking);

    if (channel === "whatsapp") {
      const url = `https://api.whatsapp.com/send/?phone=${CLINIC_WHATSAPP_PHONE}&text=${encodeURIComponent(summary)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      try {
        navigator.clipboard?.writeText(summary);
      } catch {
        /* clipboard blocked — patient can still type their request */
      }
      window.open(CLINIC_TELEGRAM_URL, "_blank", "noopener,noreferrer");
    }

    setPendingBooking(null);
    setBookingError(null);
    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        role: "assistant",
        content:
          channel === "whatsapp"
            ? "Opening WhatsApp with your details — just tap send and our team will confirm your appointment. 💬"
            : "I've copied your booking summary — paste it into our Telegram chat and tap send, and our team will confirm your appointment. 💬",
      },
    ]);
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 top-[30vh] z-[60] flex flex-col overflow-hidden rounded-t-3xl border-t border-x border-[color:var(--border-strong)] bg-white shadow-[0_-10px_40px_rgba(36,20,31,0.18)] sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:w-[400px] sm:rounded-3xl sm:border sm:shadow-[0_20px_60px_rgba(36,20,31,0.18)] animate-[fadeSlideUp_0.2s_ease-out]">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between bg-[color:var(--brand)] px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                <Image src={ROOMY_AVATAR} alt="Roomy" width={40} height={40} className="h-full w-full object-cover" />
              </span>
              <div>
                <p className="font-display text-lg text-white">Roomy</p>
                <p className="text-[11px] text-white/70">
                  {voiceMode
                    ? voiceState === "recording"
                      ? "Listening…"
                      : voiceState === "thinking"
                        ? "Thinking…"
                        : voiceState === "speaking"
                          ? "Speaking…"
                          : "Listening…"
                    : "Virtual Assistant"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {voiceMode && (
                <span className="mr-1 flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white">
                  <Microphone size={13} weight="fill" className="animate-pulse" />
                  Voice
                </span>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/20 hover:text-white"
              >
                <X size={18} weight="bold" />
              </button>
            </div>
          </div>

          {/* Talk to a human — always reachable, at any point in the chat */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[color:var(--border-strong)] bg-[color:var(--surface)] px-4 py-2">
            <span className="text-xs font-medium text-[color:var(--text-soft)]">
              Talk to a human
            </span>
            <div className="flex items-center gap-2">
              {HUMAN_CHANNELS.map((channel) => (
                <a
                  key={channel.id}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Message Roomchang on ${channel.label}`}
                  title={`Message Roomchang on ${channel.label}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.22)] ${channel.bg}`}
                >
                  {channel.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Messages — or the welcome / Start gate before the chat begins */}
          <div
            ref={scrollRef}
            className={`flex-1 overflow-y-auto overscroll-contain px-4 py-4 [touch-action:pan-y] ${
              started ? "space-y-3" : "flex flex-col items-center justify-center text-center"
            }`}
            role="log"
            aria-live="polite"
          >
            {!started ? (
              <div className="flex max-w-[18rem] flex-col items-center gap-4">
                <Image
                  src={ROOMY_AVATAR}
                  alt="Roomy"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full bg-white object-cover shadow-[0_8px_28px_rgba(204,55,113,0.25)]"
                  priority
                />
                <p className="font-display text-2xl text-[color:var(--text-main)]">Hi, I&apos;m Roomy 👋</p>
                <p className="text-sm leading-relaxed text-[color:var(--text-soft)]">
                  Roomchang&apos;s virtual assistant. Ask me about treatments, pricing, or booking a visit —
                  tap below to start.
                </p>
              </div>
            ) : (
              messages.map((msg) =>
              msg.role === "assistant" ? (
                <div key={msg.id} className="flex gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
                    <Image src={ROOMY_AVATAR} alt="Roomy" width={28} height={28} className="h-full w-full object-cover" />
                  </span>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-[color:var(--surface)] px-4 py-2.5 text-sm leading-relaxed text-[color:var(--text-main)]">
                    {msg.content && !(msg.id === "greeting" && greetingTyping) ? (
                      renderMarkdown(msg.content, handleListItemClick)
                    ) : (
                      <TypingDots />
                    )}
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-[color:var(--brand)] px-4 py-2.5 text-sm leading-relaxed text-white">
                    {msg.content}
                  </div>
                </div>
              ),
              )
            )}
          </div>

          {/* Date picker — appears the moment the AI asks for a preferred date */}
          {showDatePicker && (
            <DatePicker onSelect={handleDateSelect} />
          )}

          {/* Time picker — appears the moment the AI asks for a preferred time */}
          {showTimePicker && (
            <TimePicker date={selectedDate} onSelect={handleTimeSelect} />
          )}

          {/* Booking confirmation — Confirm books it for real via /api/book;
              WhatsApp/Telegram remain an optional way to message a human. */}
          {pendingBooking && (
            <BookingCard
              data={pendingBooking}
              submitting={bookingSubmitting}
              error={bookingError}
              onConfirm={handleBookingConfirm}
              onSend={handleBookingSend}
              onEdit={() => {
                if (bookingSubmitting) return;
                setPendingBooking(null);
                setBookingError(null);
                setMessages((prev) => [
                  ...prev,
                  {
                    id: uid(),
                    role: "assistant",
                    content: "No problem! What would you like to change?",
                  },
                ]);
              }}
            />
          )}

          {/* Suggestion bar — only once the chat has started */}
          {started && (
            <SuggestionBar
              onSelect={handleSuggestionClick}
              disabled={isStreaming}
            />
          )}

          {/* Start gate — before the chat begins, a single deliberate entry point
              (no OpenAI call fires until the user starts) */}
          {!started ? (
            <div className="shrink-0 border-t border-[color:var(--border-strong)] px-4 py-3">
              <button
                type="button"
                onClick={handleStart}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(204,55,113,0.3)] transition hover:bg-[color:var(--brand-deep)]"
              >
                <ChatCircleDots size={18} weight="fill" /> Start Chat
              </button>
            </div>
          ) : voiceMode ? (
            <div className="flex shrink-0 items-center gap-3 border-t border-[color:var(--border-strong)] px-4 py-3">
              <div className="flex flex-1 items-center gap-3 rounded-xl bg-[color:var(--brand-soft)] px-4 py-2.5">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--brand)] opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-[color:var(--brand)]" />
                </span>
                <span className="text-sm font-medium text-[color:var(--brand-deep)]">
                  {voiceState === "thinking"
                    ? "Thinking…"
                    : voiceState === "speaking"
                      ? "Speaking…"
                      : "Listening…"}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleVoiceMode}
                aria-label="Stop voice conversation"
                className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[color:var(--brand)] px-4 text-sm font-bold text-white transition hover:bg-[color:var(--brand-deep)]"
              >
                <X size={16} weight="bold" /> Stop
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSend}
              autoComplete="off"
              data-form-type="other"
              className="flex shrink-0 items-center gap-2 border-t border-[color:var(--border-strong)] px-4 py-3"
            >
              <input
                ref={inputRef}
                type="text"
                name="chatbot-msg"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isStreaming}
                autoComplete="off"
                autoCorrect="on"
                autoCapitalize="sentences"
                spellCheck
                enterKeyHint="send"
                inputMode="text"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore
                className="min-w-0 flex-1 rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] px-4 py-2.5 text-base text-[color:var(--text-main)] placeholder:text-[color:var(--text-soft)]/50 outline-none transition focus:border-[color:var(--brand-light)] focus:ring-2 focus:ring-[color:var(--brand-soft)] disabled:opacity-50 sm:text-sm"
              />
              {voiceSupported && !input.trim() && (
                <button
                  type="button"
                  onClick={toggleVoiceMode}
                  disabled={isStreaming}
                  aria-label="Start voice conversation"
                  title="Talk to us"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface)] text-[color:var(--brand-deep)] transition hover:border-[color:var(--brand-light)] disabled:opacity-40"
                >
                  <Microphone size={18} />
                </button>
              )}
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand)] text-white transition hover:bg-[color:var(--brand-deep)] disabled:opacity-40"
              >
                {isStreaming ? (
                  <SpinnerGap size={18} className="animate-spin" />
                ) : (
                  <PaperPlaneTilt size={18} weight="fill" />
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Speech bubble prompt */}
      {showBubble && !open && (
        <div className="fixed bottom-[5rem] right-4 z-[61] animate-fadeSlideUp sm:bottom-[6rem] sm:right-6">
          <div className="relative max-w-[200px] rounded-2xl bg-white px-4 py-3 shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-[color:var(--border-strong)]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
                try { sessionStorage.setItem("rc-bubble-seen", "1"); } catch {}
              }}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-600 shadow-sm"
              aria-label="Dismiss"
            >
              <X size={10} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => {
                setShowBubble(false);
                try { sessionStorage.setItem("rc-bubble-seen", "1"); } catch {}
                setOpen(true);
              }}
              className="text-left"
            >
              <p className="text-sm font-medium text-[color:var(--text-main)]">
                Need help with dental care? 😊
              </p>
              <p className="mt-0.5 text-xs text-[color:var(--brand)]">
                Chat with us →
              </p>
            </button>
            {/* Arrow pointing down to chat button */}
            <div className="absolute -bottom-[7px] right-5 h-0 w-0 border-l-[7px] border-r-[7px] border-t-[7px] border-l-transparent border-r-transparent border-t-white" />
          </div>
        </div>
      )}

      {/* Chat bubble */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with Roomy"}
        className={`fixed bottom-4 right-4 z-[60] h-12 w-12 items-center justify-center overflow-hidden rounded-full shadow-[0_8px_28px_rgba(204,55,113,0.45)] transition hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 ${
          open ? "hidden bg-[color:var(--brand-deep)] sm:flex" : "flex bg-white"
        }`}
      >
        {open ? (
          <X size={22} weight="bold" className="text-white" />
        ) : (
          <Image
            src={ROOMY_AVATAR}
            alt="Chat with Roomy"
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        )}
      </button>
    </>
  );
}
