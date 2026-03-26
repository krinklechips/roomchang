"use client";

import { useEffect, useState, useCallback } from "react";

type PriceItem = { ada: string; name: string; price: string; aus: string };
type Category = { id: string; title: string; icon: string; items: PriceItem[] };
type PricingData = { categories: Category[]; comparisons: unknown[]; lastUpdated: string };

function newItem(): PriceItem {
  return { ada: "", name: "", price: "", aus: "" };
}

export default function AdminPricingPage() {
  const [data, setData] = useState<PricingData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/pricing");
    if (res.ok) setData(await res.json());
    else setError("Could not load pricing data.");
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!data) return;
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) {
      const json = await res.json();
      setData((d) => d ? { ...d, lastUpdated: json.lastUpdated } : d);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError("Save failed. In production, connect to a database.");
    }
  }

  function updateItem(catIdx: number, rowIdx: number, field: keyof PriceItem, value: string) {
    setData((d) => {
      if (!d) return d;
      const cats = d.categories.map((c, ci) => {
        if (ci !== catIdx) return c;
        return {
          ...c,
          items: c.items.map((item, ri) =>
            ri !== rowIdx ? item : { ...item, [field]: value }
          ),
        };
      });
      return { ...d, categories: cats };
    });
  }

  function addRow(catIdx: number) {
    setData((d) => {
      if (!d) return d;
      const cats = d.categories.map((c, ci) =>
        ci !== catIdx ? c : { ...c, items: [...c.items, newItem()] }
      );
      return { ...d, categories: cats };
    });
  }

  function deleteRow(catIdx: number, rowIdx: number) {
    setData((d) => {
      if (!d) return d;
      const cats = d.categories.map((c, ci) =>
        ci !== catIdx ? c : { ...c, items: c.items.filter((_, ri) => ri !== rowIdx) }
      );
      return { ...d, categories: cats };
    });
  }

  function moveRow(catIdx: number, rowIdx: number, dir: -1 | 1) {
    setData((d) => {
      if (!d) return d;
      const cats = d.categories.map((c, ci) => {
        if (ci !== catIdx) return c;
        const items = [...c.items];
        const target = rowIdx + dir;
        if (target < 0 || target >= items.length) return c;
        [items[rowIdx], items[target]] = [items[target], items[rowIdx]];
        return { ...c, items };
      });
      return { ...d, categories: cats };
    });
  }

  if (!data) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-500">{error || "Loading…"}</p>
    </div>
  );

  const cat = data.categories[activeTab];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900">Roomchang</span>
          <span className="text-gray-400">/</span>
          <span className="text-sm font-semibold text-gray-600">Pricing Editor</span>
        </div>
        <div className="flex items-center gap-3">
          {data.lastUpdated && (
            <span className="text-xs text-gray-400">Last saved: {data.lastUpdated}</span>
          )}
          {error && <span className="text-xs text-red-500">{error}</span>}
          {saved && <span className="text-xs text-green-600 font-semibold">✓ Saved</span>}
          <a href="/pricing" target="_blank" className="text-xs text-blue-600 hover:underline">
            View live page ↗
          </a>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-[#cc3771] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b5315f] disabled:opacity-60 transition-colors"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Tab bar */}
        <div className="mb-6 flex flex-wrap gap-2">
          {data.categories.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveTab(i)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                i === activeTab
                  ? "bg-[#cc3771] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#cc3771] hover:text-[#cc3771]"
              }`}
            >
              {c.icon} {c.title}
            </button>
          ))}
        </div>

        {/* Table panel */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div>
              <h2 className="font-semibold text-gray-900">{cat.icon} {cat.title}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{cat.items.length} row{cat.items.length !== 1 ? "s" : ""}</p>
            </div>
            <button
              onClick={() => addRow(activeTab)}
              className="flex items-center gap-2 rounded-lg border border-dashed border-[#cc3771] px-4 py-2 text-sm font-semibold text-[#cc3771] hover:bg-pink-50 transition-colors"
            >
              + Add Row
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="w-8 px-3 py-3 text-center">#</th>
                  <th className="px-4 py-3 text-left w-20">ADA Code</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left w-44">Roomchang Price (USD)</th>
                  <th className="px-4 py-3 text-left w-44">Avg. Price in Australia</th>
                  <th className="px-4 py-3 text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cat.items.map((item, ri) => (
                  <tr key={ri} className="group hover:bg-pink-50/40 transition-colors">
                    <td className="px-3 py-2 text-center text-xs text-gray-400 font-mono">{ri + 1}</td>
                    <td className="px-4 py-2">
                      <input
                        value={item.ada}
                        onChange={(e) => updateItem(activeTab, ri, "ada", e.target.value)}
                        className="w-16 rounded border border-transparent bg-transparent px-1 py-0.5 font-mono text-xs text-gray-600 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-200"
                        placeholder="—"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        value={item.name}
                        onChange={(e) => updateItem(activeTab, ri, "name", e.target.value)}
                        className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-gray-800 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-200"
                        placeholder="Treatment name…"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        value={item.price}
                        onChange={(e) => updateItem(activeTab, ri, "price", e.target.value)}
                        className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 font-semibold text-[#7e2f66] focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-200"
                        placeholder="e.g. 600.00"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        value={item.aus}
                        onChange={(e) => updateItem(activeTab, ri, "aus", e.target.value)}
                        className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-gray-500 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-200"
                        placeholder="e.g. 1,500.00"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => moveRow(activeTab, ri, -1)}
                          disabled={ri === 0}
                          title="Move up"
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveRow(activeTab, ri, 1)}
                          disabled={ri === cat.items.length - 1}
                          title="Move down"
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => deleteRow(activeTab, ri)}
                          title="Delete row"
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {cat.items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                      No items yet — click &ldquo;Add Row&rdquo; to add pricing.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 flex items-center justify-between">
            <button
              onClick={() => addRow(activeTab)}
              className="text-xs font-semibold text-[#cc3771] hover:underline"
            >
              + Add Row
            </button>
            <p className="text-xs text-gray-400">
              Click any cell to edit · Hover rows for actions · Save when done
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3">
          <p className="text-xs text-amber-700">
            <strong>Note:</strong> &quot;Save Changes&quot; writes directly to the data file in development. In production on Vercel, connect this to the Prisma database to persist changes permanently.
          </p>
        </div>
      </div>
    </div>
  );
}
