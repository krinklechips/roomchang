"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://roomchang.vercel.app";

interface Agent {
  id: string;
  name: string;
  code: string;
  notes: string | null;
  active: boolean;
  created_at: string;
  visits: number;
  leads: number;
}

function generateCode(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 12) +
    Math.floor(Math.random() * 100).toString().padStart(2, "0");
}

export default function AffiliatesPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "", notes: "" });

  const loadAgents = useCallback(async () => {
    setLoading(true);

    const { data: agentRows } = await supabase
      .from("referral_agents")
      .select("*")
      .order("created_at", { ascending: false });

    if (!agentRows) { setLoading(false); return; }

    // Get visit counts per agent
    const { data: visitCounts } = await supabase
      .from("referral_visits")
      .select("agent_code");

    // Get lead counts per agent
    const { data: leadCounts } = await supabase
      .from("enquiries")
      .select("agent_code")
      .not("agent_code", "is", null);

    const visitMap: Record<string, number> = {};
    const leadMap: Record<string, number> = {};

    visitCounts?.forEach(({ agent_code }) => {
      visitMap[agent_code] = (visitMap[agent_code] ?? 0) + 1;
    });
    leadCounts?.forEach(({ agent_code }) => {
      if (agent_code) leadMap[agent_code] = (leadMap[agent_code] ?? 0) + 1;
    });

    setAgents(
      agentRows.map((a) => ({
        ...a,
        visits: visitMap[a.code] ?? 0,
        leads: leadMap[a.code] ?? 0,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => { loadAgents(); }, [loadAgents]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.code) return;
    setCreating(true);

    const { error } = await supabase.from("referral_agents").insert({
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      notes: form.notes.trim() || null,
    });

    if (error) {
      alert(error.message);
    } else {
      setForm({ name: "", code: "", notes: "" });
      setShowForm(false);
      await loadAgents();
    }
    setCreating(false);
  }

  async function toggleActive(agent: Agent) {
    await supabase
      .from("referral_agents")
      .update({ active: !agent.active })
      .eq("id", agent.id);
    await loadAgents();
  }

  function copyLink(agent: Agent) {
    const link = `${BASE_URL}?ref=${agent.code}`;
    navigator.clipboard.writeText(link);
    setCopiedId(agent.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="min-h-screen bg-[#faf8f9] p-6 md:p-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#cc3771]">
              Roomchang Admin
            </p>
            <h1 className="mt-1 font-serif text-4xl text-[#2c1a28]">
              Affiliates
            </h1>
            <p className="mt-1.5 text-sm text-[#705569]">
              Generate referral links for agents. Every visit and enquiry is tracked automatically.
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="shrink-0 rounded-full bg-[#cc3771] px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#b02d60] transition"
          >
            + New Agent
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="mb-8 rounded-2xl border border-[#e8d5de] bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 font-serif text-xl text-[#2c1a28]">New Referral Agent</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-[#705569]">
                  Agent Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Somchai"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      code: generateCode(name),
                    }));
                  }}
                  className="w-full rounded-xl border border-[#e8d5de] px-4 py-2.5 text-sm text-[#2c1a28] outline-none focus:border-[#cc3771] focus:ring-2 focus:ring-[#cc3771]/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-[#705569]">
                  Referral Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SOMCHAI01"
                  value={form.code}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                  }
                  className="w-full rounded-xl border border-[#e8d5de] px-4 py-2.5 font-mono text-sm text-[#2c1a28] uppercase outline-none focus:border-[#cc3771] focus:ring-2 focus:ring-[#cc3771]/20"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-[#705569]">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Instagram influencer — dental niche"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full rounded-xl border border-[#e8d5de] px-4 py-2.5 text-sm text-[#2c1a28] outline-none focus:border-[#cc3771] focus:ring-2 focus:ring-[#cc3771]/20"
                />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="rounded-full bg-[#cc3771] px-6 py-2 text-sm font-semibold text-white hover:bg-[#b02d60] disabled:opacity-50 transition"
              >
                {creating ? "Creating…" : "Create Agent"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full border border-[#e8d5de] px-6 py-2 text-sm font-semibold text-[#705569] hover:border-[#cc3771] transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Stats summary */}
        {!loading && agents.length > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-4">
            {[
              { label: "Total Agents", value: agents.length },
              { label: "Total Visits", value: agents.reduce((s, a) => s + a.visits, 0) },
              { label: "Total Leads", value: agents.reduce((s, a) => s + a.leads, 0) },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-[#e8d5de] bg-white p-5 text-center shadow-sm">
                <p className="font-serif text-4xl text-[#cc3771]">{value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#705569]">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Agent table */}
        {loading ? (
          <p className="text-sm text-[#705569]">Loading agents…</p>
        ) : agents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e8d5de] p-12 text-center">
            <p className="text-sm text-[#705569]">No agents yet. Create one above to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {agents.map((agent) => {
              const link = `${BASE_URL}?ref=${agent.code}`;
              const convRate =
                agent.visits > 0
                  ? Math.round((agent.leads / agent.visits) * 100)
                  : 0;

              return (
                <div
                  key={agent.id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                    agent.active
                      ? "border-[#e8d5de]"
                      : "border-[#e8d5de] opacity-50"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Identity */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-semibold text-[#2c1a28]">{agent.name}</span>
                        <span className="rounded-full bg-[#f7d6e2] px-2.5 py-0.5 font-mono text-xs font-bold text-[#cc3771]">
                          {agent.code}
                        </span>
                        {!agent.active && (
                          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                            Inactive
                          </span>
                        )}
                      </div>
                      {agent.notes && (
                        <p className="mt-0.5 text-xs text-[#705569]">{agent.notes}</p>
                      )}
                      {/* Link row */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="truncate font-mono text-xs text-[#705569]">{link}</span>
                        <button
                          onClick={() => copyLink(agent)}
                          className="shrink-0 rounded-lg bg-[#f7d6e2] px-3 py-1 text-xs font-semibold text-[#cc3771] hover:bg-[#ef9ab9]/30 transition"
                        >
                          {copiedId === agent.id ? "Copied ✓" : "Copy"}
                        </button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-5 sm:gap-8 shrink-0">
                      <div className="text-center">
                        <p className="font-serif text-2xl text-[#2c1a28]">{agent.visits}</p>
                        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#705569]">Visits</p>
                      </div>
                      <div className="text-center">
                        <p className="font-serif text-2xl text-[#cc3771]">{agent.leads}</p>
                        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#705569]">Leads</p>
                      </div>
                      <div className="text-center">
                        <p className="font-serif text-2xl text-[#2c1a28]">{convRate}%</p>
                        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#705569]">Conv.</p>
                      </div>
                      <button
                        onClick={() => toggleActive(agent)}
                        className="rounded-lg border border-[#e8d5de] px-3 py-1.5 text-xs font-semibold text-[#705569] hover:border-[#cc3771] hover:text-[#cc3771] transition"
                      >
                        {agent.active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
