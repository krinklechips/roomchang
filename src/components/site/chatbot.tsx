"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChatCircleDots,
  PaperPlaneTilt,
  X,
  SpinnerGap,
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
  treatment: string;
  date: string;
  branch: string;
  doctor: string;
  message: string;
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
    .trim();
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

// ─── FAQ quick-reply suggestions ────────────────────────────────────────────

const FAQ_SUGGESTIONS = [
  { label: "Our services", text: "What dental services do you offer?" },
  { label: "Meet our doctors", text: "Tell me about your doctors" },
  { label: "Treatment prices", text: "How much do dental implants cost?" },
  { label: "Book appointment", text: "I'd like to book an appointment" },
];

function SuggestionChips({
  onSelect,
}: {
  onSelect: (text: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pt-1 pb-2">
      {FAQ_SUGGESTIONS.map((faq) => (
        <button
          key={faq.label}
          type="button"
          onClick={() => onSelect(faq.text)}
          className="rounded-full border border-[color:var(--brand-light)] bg-white px-3 py-1.5 text-xs font-semibold text-[color:var(--brand)] transition hover:bg-[color:var(--brand-soft)] active:scale-95"
        >
          {faq.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main chatbot ────────────────────────────────────────────────────────────

const GREETING: Message = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi! I'm Roomchang's virtual assistant. I can help you with treatment information, pricing, or booking an appointment. How can I help you today?",
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<BookingData | null>(
    null,
  );
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<
    "success" | "error" | null
  >(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
  }, [messages, isStreaming, scrollToBottom]);

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

  // ─── Send message ─────────────────────────────────────────────────────────

  function handleSuggestionClick(text: string) {
    if (isStreaming) return;
    setInput(text);
    // Use setTimeout so React batches the state update, then submit
    setTimeout(() => {
      sendMessage(text);
    }, 0);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage(text);
  }

  async function sendMessage(text: string) {
    if (!text || isStreaming) return;

    const userMsg: Message = { id: uid(), role: "user", content: text };
    const assistantMsg: Message = {
      id: uid(),
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsStreaming(true);
    setShowSuggestions(false);

    try {
      // Build history (exclude greeting and empty assistant messages)
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
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pendingBooking.name,
          email: pendingBooking.email || "",
          phone: pendingBooking.phone || "",
          treatment: pendingBooking.treatment || "",
          date: pendingBooking.date || "",
          branch: pendingBooking.branch || "",
          doctor: pendingBooking.doctor || "",
          message: `[AI Chatbot Booking] ${pendingBooking.message || ""}`,
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
        <div className="fixed inset-x-2 bottom-20 top-20 z-[60] flex flex-col overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_20px_60px_rgba(36,20,31,0.18)] sm:inset-auto sm:bottom-24 sm:right-[5.5rem] sm:h-[560px] sm:w-[400px] animate-[fadeSlideUp_0.2s_ease-out]">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between bg-[color:var(--brand)] px-5 py-4">
            <div>
              <p className="font-display text-lg text-white">Roomchang</p>
              <p className="text-[11px] text-white/70">
                Virtual Assistant
              </p>
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
                    {msg.content || <TypingDots />}
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

            {isStreaming &&
              messages[messages.length - 1]?.content === "" && (
                <div className="flex gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand)]">
                    <ChatCircleDots size={14} weight="fill" />
                  </div>
                  <div className="rounded-2xl rounded-tl-md bg-[color:var(--surface)] px-4 py-2.5">
                    <TypingDots />
                  </div>
                </div>
              )}

            {/* FAQ suggestion chips — shown only before first message */}
            {showSuggestions && messages.length === 1 && !isStreaming && (
              <SuggestionChips onSelect={handleSuggestionClick} />
            )}
          </div>

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
                    content:
                      "No problem! What would you like to change?",
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

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex shrink-0 items-center gap-2 border-t border-[color:var(--border-strong)] px-4 py-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isStreaming}
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
