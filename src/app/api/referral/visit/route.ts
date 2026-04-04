import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { agent_code, page } = await request.json();

    if (!agent_code) {
      return NextResponse.json({ error: "Missing agent_code" }, { status: 400 });
    }

    // Verify the agent exists and is active
    const { data: agent } = await supabase
      .from("referral_agents")
      .select("code")
      .eq("code", agent_code)
      .eq("active", true)
      .single();

    if (!agent) {
      // Unknown or inactive code — ignore silently
      return NextResponse.json({ ok: true });
    }

    await supabase.from("referral_visits").insert({ agent_code, page });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
