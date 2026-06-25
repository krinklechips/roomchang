import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { routing } from "@/i18n/routing";

// The admin pricing editor reads from and writes to the same Supabase tables
// the public /pricing page renders from (`pricing_categories` + `pricing_items`),
// so edits go live. We deliberately do NOT use getPricingCategories() here: that
// helper overlays active-locale translations, whereas the editor must edit the
// canonical (English) base rows.

type ItemPayload = {
  id?: string;
  ada?: string;
  name?: string;
  price?: string;
  aus?: string;
  note?: string;
};
type CategoryPayload = { id: string; items?: ItemPayload[] };
type PricingPayload = { categories?: CategoryPayload[] };

/** Trim and collapse empty strings to null for nullable columns. */
function nullable(value: string | undefined): string | null {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function GET() {
  const db = supabaseAdmin;
  const [{ data: categories, error: catErr }, { data: items, error: itemErr }] =
    await Promise.all([
      db.from("pricing_categories").select("*").order("order"),
      db.from("pricing_items").select("*").order("order"),
    ]);

  if (catErr || itemErr) {
    return NextResponse.json(
      { error: `Failed to read pricing data: ${catErr?.message ?? itemErr?.message}` },
      { status: 500 },
    );
  }

  const result = (categories ?? []).map((cat) => ({
    id: cat.id,
    title: cat.title,
    icon: cat.icon,
    items: (items ?? [])
      .filter((it) => it.categoryId === cat.id)
      .map((it) => ({
        id: it.id,
        ada: it.ada ?? "",
        name: it.name ?? "",
        price: it.price ?? "",
        aus: it.aus ?? "",
        note: it.note ?? "",
      })),
  }));

  return NextResponse.json({ categories: result });
}

export async function POST(request: Request) {
  let body: PricingPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!Array.isArray(body.categories) || body.categories.length === 0) {
    return NextResponse.json({ error: "Required: categories[]" }, { status: 400 });
  }

  const db = supabaseAdmin;

  // Validate category ids against the DB — this endpoint edits items only, it
  // never creates/renames/deletes categories.
  const { data: dbCategories, error: catErr } = await db
    .from("pricing_categories")
    .select("id");
  if (catErr) {
    return NextResponse.json(
      { error: `Failed to load categories: ${catErr.message}` },
      { status: 500 },
    );
  }
  const validCategoryIds = new Set((dbCategories ?? []).map((c) => c.id));

  // Build the desired item rows. `order` is the row's index within its category
  // so the editor's reordering persists. New rows (no id) get a fresh UUID; the
  // PK has no DB-level default, so we must supply it.
  const rows: {
    id: string;
    name: string;
    price: string;
    ada: string | null;
    aus: string | null;
    note: string | null;
    order: number;
    categoryId: string;
  }[] = [];
  const submittedCategoryIds: string[] = [];

  for (const cat of body.categories) {
    if (!validCategoryIds.has(cat.id)) continue;
    submittedCategoryIds.push(cat.id);

    (cat.items ?? []).forEach((item) => {
      const name = (item.name ?? "").trim();
      const price = (item.price ?? "").trim();
      const ada = nullable(item.ada);
      const aus = nullable(item.aus);
      const note = nullable(item.note);
      // Skip blank rows (an accidental "Add Row" with nothing filled in).
      if (!name && !price && !ada && !aus && !note) return;

      rows.push({
        id: item.id && item.id.length > 0 ? item.id : randomUUID(),
        name,
        price,
        ada,
        aus,
        note,
        order: rows.filter((r) => r.categoryId === cat.id).length,
        categoryId: cat.id,
      });
    });
  }

  if (submittedCategoryIds.length === 0) {
    return NextResponse.json(
      { error: "No known categories in payload." },
      { status: 400 },
    );
  }

  // Upsert first (insert new + update existing) so a later failure never loses
  // data, then delete the rows the editor removed.
  if (rows.length > 0) {
    const { error: upsertErr } = await db
      .from("pricing_items")
      .upsert(rows, { onConflict: "id" });
    if (upsertErr) {
      return NextResponse.json(
        { error: `Failed to save pricing items: ${upsertErr.message}` },
        { status: 500 },
      );
    }
  }

  // Reconcile deletes — scoped to the categories actually submitted, so a
  // partial payload can never wipe items in untouched categories.
  const keepIds = new Set(rows.map((r) => r.id));
  const { data: existing, error: existErr } = await db
    .from("pricing_items")
    .select("id")
    .in("categoryId", submittedCategoryIds);
  if (existErr) {
    return NextResponse.json(
      { error: `Failed to reconcile pricing items: ${existErr.message}` },
      { status: 500 },
    );
  }
  const toDelete = (existing ?? []).map((r) => r.id).filter((id) => !keepIds.has(id));
  if (toDelete.length > 0) {
    const { error: delErr } = await db
      .from("pricing_items")
      .delete()
      .in("id", toDelete);
    if (delErr) {
      return NextResponse.json(
        { error: `Failed to remove deleted items: ${delErr.message}` },
        { status: 500 },
      );
    }
  }

  // Bust the public pricing page's cache (revalidate = 60) so edits appear now.
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}/pricing`);
  }

  return NextResponse.json({
    ok: true,
    lastUpdated: new Date().toISOString().slice(0, 10),
  });
}
