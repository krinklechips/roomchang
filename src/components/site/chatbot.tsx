"use client";

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
} from "@phosphor-icons/react";

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

    // Regular paragraph — render inline formatting
    return (
      <p key={bi} className={bi > 0 ? "mt-2" : ""}>
        {renderInline(trimmed.replace(/\n/g, " "))}
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

function BookingCard({
  data,
  onConfirm,
  onCancel,
  submitting,
}: {
  data: BookingData;
  onConfirm: () => void;
  onCancel: () => void;
  submitting: boolean;
}) {
  return (
    <div className="mx-3 mb-3 rounded-xl border border-[color:var(--brand-soft)] bg-[color:var(--brand-soft)] p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--brand)]">
        Confirm Booking
      </p>
      <div className="mt-2 space-y-1 text-sm text-[color:var(--text-main)]">
        {data.name && (
          <p>
            <span className="font-semibold">Name:</span> {data.name}
          </p>
        )}
        {(data.email || data.phone) && (
          <p>
            <span className="font-semibold">Contact:</span>{" "}
            {data.email || data.phone}
          </p>
        )}
        {data.treatment && (
          <p>
            <span className="font-semibold">Treatment:</span> {data.treatment}
          </p>
        )}
        {data.date && (
          <p>
            <span className="font-semibold">Date:</span> {data.date}
          </p>
        )}
        {data.time && (
          <p>
            <span className="font-semibold">Time:</span> {data.time}
          </p>
        )}
        {data.telegram && (
          <p>
            <span className="font-semibold">Telegram:</span> {data.telegram}
          </p>
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onConfirm}
          disabled={submitting}
          className="btn-primary btn-primary-sm flex-1 justify-center text-xs disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Confirm Booking"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-full border border-[color:var(--border-strong)] bg-white px-4 py-2 text-xs font-bold text-[color:var(--text-soft)] transition hover:bg-[color:var(--surface-strong)]"
        >
          Edit
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
  // Find first Monday on or before the 1st of the month
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
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
    "Hi! I'm Roomchang's virtual assistant. I can help you with treatment information, pricing, or booking an appointment. How can I help you today?",
};

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
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<
    "success" | "error" | null
  >(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── Session persistence ──────────────────────────────────────────────────

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    const saved = loadPersistedMessages();
    if (saved && saved.length > 0) {
      setMessages(saved);
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

  // Focus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

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

  async function sendMessage(text: string) {
    if (!text || isStreaming) return;

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

      // Check for date picker trigger
      if (hasDatePickerMarker(fullContent)) {
        setShowDatePicker(true);
      }

      if (hasTimePickerMarker(fullContent)) {
        const assistantDate = extractIsoDate(fullContent);
        if (assistantDate) {
          setSelectedDate(assistantDate);
        }
        setShowTimePicker(true);
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

  async function handleBookingConfirm() {
    if (!pendingBooking) return;
    setBookingSubmitting(true);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pendingBooking.name,
          email: pendingBooking.email || "",
          phone: pendingBooking.phone || "",
          telegram: pendingBooking.telegram || "",
          treatment: pendingBooking.treatment || "",
          date: pendingBooking.date || "",
          time: pendingBooking.time || "",
          branch: pendingBooking.branch || "",
          doctor: pendingBooking.doctor || "",
          notes: `[AI Chatbot Booking] ${pendingBooking.notes || pendingBooking.message || ""}`,
        }),
      });

      if (!res.ok) throw new Error();
      setBookingResult("success");
      setPendingBooking(null);

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content:
            "Your appointment request has been submitted! Our team will confirm your booking via email or phone within 1-2 business days. Thank you for choosing Roomchang!",
        },
      ]);
    } catch {
      setBookingResult("error");
    } finally {
      setBookingSubmitting(false);
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 top-[30vh] z-[60] flex flex-col overflow-hidden rounded-t-3xl border-t border-x border-[color:var(--border-strong)] bg-white shadow-[0_-10px_40px_rgba(36,20,31,0.18)] sm:inset-auto sm:bottom-24 sm:right-[5.5rem] sm:h-[560px] sm:w-[400px] sm:rounded-3xl sm:border sm:shadow-[0_20px_60px_rgba(36,20,31,0.18)] animate-[fadeSlideUp_0.2s_ease-out]">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between bg-[color:var(--brand)] px-5 py-4">
            <div>
              <p className="font-display text-lg text-white">Roomchang</p>
              <p className="text-[11px] text-white/70">Virtual Assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/20 hover:text-white"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            role="log"
            aria-live="polite"
          >
            {messages.map((msg) =>
              msg.role === "assistant" ? (
                <div key={msg.id} className="flex gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand)]">
                    <ChatCircleDots size={14} weight="fill" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-[color:var(--surface)] px-4 py-2.5 text-sm leading-relaxed text-[color:var(--text-main)]">
                    {msg.content ? (
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
            )}
          </div>

          {/* Date picker — appears when AI asks for preferred date */}
          {showDatePicker && !isStreaming && (
            <DatePicker onSelect={handleDateSelect} />
          )}

          {/* Time picker — appears when AI asks for preferred time */}
          {showTimePicker && !isStreaming && (
            <TimePicker date={selectedDate} onSelect={handleTimeSelect} />
          )}

          {/* Booking confirmation */}
          {pendingBooking && (
            <BookingCard
              data={pendingBooking}
              onConfirm={handleBookingConfirm}
              onCancel={() => {
                setPendingBooking(null);
                setMessages((prev) => [
                  ...prev,
                  {
                    id: uid(),
                    role: "assistant",
                    content: "No problem! What would you like to change?",
                  },
                ]);
              }}
              submitting={bookingSubmitting}
            />
          )}

          {bookingResult === "error" && (
            <p className="mx-4 mb-2 text-xs text-red-600">
              Booking failed — please try again or call +855 69 811 338.
            </p>
          )}

          {/* Suggestion bar with scroll chevrons */}
          <SuggestionBar
            onSelect={handleSuggestionClick}
            disabled={isStreaming}
          />

          {/* Input */}
          <form
            onSubmit={handleSend}
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
              autoComplete="one-time-code"
              data-form-type="other"
              data-lpignore="true"
              data-1p-ignore
              className="flex-1 rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] px-4 py-2.5 text-sm text-[color:var(--text-main)] placeholder:text-[color:var(--text-soft)]/50 outline-none transition focus:border-[color:var(--brand-light)] focus:ring-2 focus:ring-[color:var(--brand-soft)] disabled:opacity-50"
            />
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
        </div>
      )}

      {/* Speech bubble prompt */}
      {showBubble && !open && (
        <div className="fixed bottom-[5rem] right-[3.5rem] z-[61] animate-fadeSlideUp sm:bottom-[6rem] sm:right-[4.75rem]">
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
        aria-label={open ? "Close chat" : "Chat with us"}
        className={`fixed bottom-4 right-[4.5rem] z-[60] flex h-12 w-12 items-center justify-center rounded-full shadow-[0_8px_28px_rgba(204,55,113,0.45)] transition hover:scale-105 active:scale-95 sm:bottom-6 sm:right-[5.75rem] sm:h-14 sm:w-14 ${
          open
            ? "bg-[color:var(--brand-deep)]"
            : "bg-[color:var(--brand)]"
        }`}
      >
        {open ? (
          <X size={22} weight="bold" className="text-white" />
        ) : (
          <ChatCircleDots size={24} weight="fill" className="text-white" />
        )}
      </button>
    </>
  );
}
