"use client";

import { useState } from "react";
import { PaperPlaneTilt, CheckCircle, WarningCircle } from "@phosphor-icons/react";

export function ChecklistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) return; // bot trap
    setStatus("sending");
    try {
      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-8 rounded-2xl border border-[color:var(--brand-soft)] bg-[color:var(--brand-soft)] p-6 text-center">
        <CheckCircle size={28} weight="duotone" className="mx-auto text-[color:var(--brand)]" />
        <p className="mt-2 font-semibold text-[color:var(--brand-deep)]">
          Checklist sent!
        </p>
        <p className="mt-1 text-sm text-[color:var(--text-soft)]">
          Check your inbox — we&apos;ve sent you a step-by-step guide to getting started.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border border-[color:var(--border-strong)] bg-white p-6 shadow-[0_8px_30px_rgba(57,28,45,0.04)]"
    >
      <p className="font-semibold text-[color:var(--text-main)]">
        Get this checklist in your inbox
      </p>
      <p className="mt-1 text-sm text-[color:var(--text-soft)]">
        We&apos;ll send you a step-by-step guide you can follow along with.
      </p>

      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="_gotcha"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] opacity-0"
        aria-hidden="true"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1 rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] px-4 py-2.5 text-sm text-[color:var(--text-main)] placeholder:text-[color:var(--text-soft)]/50 outline-none transition focus:border-[color:var(--brand-light)] focus:ring-2 focus:ring-[color:var(--brand-soft)]"
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] px-4 py-2.5 text-sm text-[color:var(--text-main)] placeholder:text-[color:var(--text-soft)]/50 outline-none transition focus:border-[color:var(--brand-light)] focus:ring-2 focus:ring-[color:var(--brand-soft)]"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary btn-primary-sm inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60"
        >
          <PaperPlaneTilt size={15} weight="bold" />
          {status === "sending" ? "Sending…" : "Send Checklist"}
        </button>
      </div>

      {status === "error" && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-red-600">
          <WarningCircle size={16} weight="fill" />
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
