"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toISODate(d: Date) {
  return d.toISOString().split("T")[0];
}

function formatDisplay(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function firstWeekdayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday-based
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

type Props = { name: string; required?: boolean };

export function DatePicker({ name, required }: Props) {
  const today = startOfDay(new Date());
  const [selected, setSelected] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const totalDays = daysInMonth(viewYear, viewMonth);
  const firstDay = firstWeekdayOfMonth(viewYear, viewMonth);
  const cells = Math.ceil((firstDay + totalDays) / 7) * 7;

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden value for form submission */}
      <input type="hidden" name={name} value={selected ? toISODate(selected) : ""} required={required} />

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-[--border-strong] bg-white px-4 py-3 text-left text-sm outline-none transition focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20"
      >
        <span className={selected ? "text-[color:var(--text-main)]" : "text-[color:var(--text-soft)]/50"}>
          {selected ? formatDisplay(selected) : "Select a date"}
        </span>
        <svg className="h-4 w-4 text-[color:var(--text-soft)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <rect x="3" y="4" width="14" height="14" rx="2.5" />
          <path d="M7 2v4M13 2v4M3 9h14" />
        </svg>
      </button>

      {/* Calendar popup */}
      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-72 overflow-hidden rounded-2xl border border-[--border-strong] bg-white shadow-[0_20px_60px_rgba(33,23,31,0.16)]">
          {/* Month header */}
          <div className="flex items-center justify-between bg-[color:var(--brand)] px-4 py-3">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <ChevronLeft size={16} strokeWidth={2.5} aria-hidden="true" />
            </button>
            <span className="text-sm font-semibold tracking-wide text-white">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>

          <div className="p-3">
            {/* Day labels */}
            <div className="mb-1 grid grid-cols-7 text-center">
              {DAYS.map(d => (
                <div key={d} className="py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-[color:var(--text-soft)]">
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7">
              {Array.from({ length: cells }).map((_, i) => {
                const dayNum = i - firstDay + 1;
                if (dayNum < 1 || dayNum > totalDays) return <div key={i} />;
                const date = new Date(viewYear, viewMonth, dayNum);
                const past = date < today;
                const isToday = isSameDay(date, today);
                const isSelected = selected !== null && isSameDay(date, selected);

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={past}
                    onClick={() => { setSelected(date); setOpen(false); }}
                    className={[
                      "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition",
                      isSelected
                        ? "bg-[color:var(--brand)] font-semibold text-white"
                        : isToday
                          ? "border border-[color:var(--brand)] font-semibold text-[color:var(--brand)]"
                          : past
                            ? "cursor-not-allowed text-[color:var(--text-soft)]/25"
                            : "text-[color:var(--text-main)] hover:bg-[color:var(--brand-soft)] hover:text-[color:var(--brand-deep)]",
                    ].join(" ")}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Today shortcut */}
          <div className="border-t border-[--border-strong] px-4 py-2.5 text-center">
            <button
              type="button"
              onClick={() => { setSelected(today); setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); setOpen(false); }}
              className="text-xs font-semibold text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
