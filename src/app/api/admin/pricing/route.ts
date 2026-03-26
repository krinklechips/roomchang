import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "src/data/pricing.json");

export async function GET() {
  try {
    const data = readFileSync(DATA_PATH, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: "Failed to read pricing data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = { ...body, lastUpdated: new Date().toISOString().slice(0, 10) };
    writeFileSync(DATA_PATH, JSON.stringify(updated, null, 2), "utf-8");
    return NextResponse.json({ ok: true, lastUpdated: updated.lastUpdated });
  } catch {
    return NextResponse.json({ error: "Failed to save pricing data" }, { status: 500 });
  }
}
