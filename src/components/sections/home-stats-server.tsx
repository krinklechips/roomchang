import { supabaseServer } from "@/lib/supabase-server";
import { HomeStats } from "./home-stats";

const FALLBACK = [
  { numeric_value: 30, suffix: " yrs", label: "Years of Experience" },
  { numeric_value: 37, suffix: "+", label: "Specialist Dentists" },
  { numeric_value: 5, suffix: "", label: "Phnom Penh Branches" },
  { numeric_value: 100000, suffix: "+", label: "Patients Treated" },
];

export async function HomeStatsServer() {
  const { data, error } = await supabaseServer
    .from("site_stats")
    .select("numeric_value, suffix, label")
    .not("numeric_value", "is", null)
    .order("sort_order");

  if (error) {
    console.error("[HomeStatsServer] fetch failed:", error.message);
  }

  const stats = data?.length
    ? (data as { numeric_value: number; suffix: string; label: string }[])
    : FALLBACK;

  return <HomeStats stats={stats} />;
}
