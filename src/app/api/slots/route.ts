import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type SlotRow = {
  time: string;
  is_available: boolean | null;
  status: string | null;
};

const DEFAULT_SLOT_TIMES = buildDefaultSlotTimes();

function buildDefaultSlotTimes(): string[] {
  const slots: string[] = [];
  for (let hour = 8; hour <= 17; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 17 && minute === 30) continue;
      slots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }
  }
  return slots;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && value === date.toISOString().slice(0, 10);
}

function isSunday(value: string): boolean {
  return new Date(`${value}T00:00:00.000Z`).getUTCDay() === 0;
}

function normalizeTime(value: string): string {
  return value.slice(0, 5);
}

export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date")?.trim() ?? "";

    if (!isValidDate(date)) {
      return NextResponse.json({ error: "Valid date is required" }, { status: 400 });
    }

    if (isSunday(date)) {
      return NextResponse.json([]);
    }

    let { data, error } = await supabaseAdmin
      .from("booking_slots")
      .select("time,is_available,status")
      .eq("date", date)
      .order("time", { ascending: true });

    if (error) {
      console.error("[slots] Supabase select error:", error);
      return NextResponse.json({ error: "Failed to load slots" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      const defaultRows = DEFAULT_SLOT_TIMES.map((time) => ({
        date,
        time,
        duration_minutes: 60,
        is_available: true,
        status: "available",
      }));

      const { error: insertError } = await supabaseAdmin
        .from("booking_slots")
        .upsert(defaultRows, { onConflict: "date,time", ignoreDuplicates: true });

      if (insertError) {
        console.error("[slots] Supabase slot generation error:", insertError);
        return NextResponse.json({ error: "Failed to generate slots" }, { status: 500 });
      }

      const refetch = await supabaseAdmin
        .from("booking_slots")
        .select("time,is_available,status")
        .eq("date", date)
        .order("time", { ascending: true });

      if (refetch.error) {
        console.error("[slots] Supabase refetch error:", refetch.error);
        return NextResponse.json({ error: "Failed to load slots" }, { status: 500 });
      }

      data = refetch.data;
    }

    const slotMap = new Map(
      ((data ?? []) as SlotRow[]).map((slot) => [
        normalizeTime(slot.time),
        slot.is_available === true && slot.status === "available",
      ]),
    );

    const slots = DEFAULT_SLOT_TIMES.map((time) => ({
      time,
      available: slotMap.get(time) ?? true,
    }));

    return NextResponse.json(slots);
  } catch (err) {
    console.error("[slots] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
