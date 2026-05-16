import { supabaseServer } from "@/lib/supabase-server";
import { HomeStats } from "./home-stats";
import { getHomepageStats, HOMEPAGE_STAT_KEYS, type HomeStatRow } from "./home-stats-data";

export async function HomeStatsServer() {
  const { data, error } = await supabaseServer
    .from("site_stats")
    .select("key, numeric_value, suffix, label")
    .in("key", [...HOMEPAGE_STAT_KEYS])
    .order("sort_order");

  if (error) {
    console.error("[HomeStatsServer] fetch failed:", error.message);
  }

  const stats = getHomepageStats(data as HomeStatRow[] | null);

  return <HomeStats stats={stats} />;
}
