import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, country, treatment, branch, doctor, date, message } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Read referral cookie if present
    const agent_code = request.cookies.get("rc_ref")?.value ?? null;

    const { error } = await supabase.from("enquiries").insert({
      id: crypto.randomUUID(),
      name,
      email: email ?? null,
      phone: phone ?? null,
      country: country ?? null,
      treatment: treatment ?? null,
      branch: branch ?? null,
      doctor: doctor ?? null,
      date: date ?? null,
      message: message ?? null,
      agent_code,
      read: false,
    });

    if (error) {
      console.error("Supabase enquiry insert error:", error);
      return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
