import { getTranslations } from "next-intl/server";
import { supabaseServer } from "@/lib/supabase-server";
import { HomeStats } from "./home-stats";
import { getHomepageStats, HOMEPAGE_STAT_KEYS, type HomeStatRow } from "./home-stats-data";
import { getPayloadSiteStats, isPayloadSource } from "@/lib/payload-source";

/** Map known English fallback labels to translation keys */
const STAT_LABEL_KEYS: Record<string, string> = {
  "Years of Experience": "yearsOfExperience",
  "Specialist Dentists": "specialistDentists",
  "Phnom Penh Branches": "phnomPenhBranches",
  "Patients Treated": "patientsTreated",
};

export async function HomeStatsServer() {
  const t = await getTranslations("homeStats");

  const { data, error } = isPayloadSource()
    ? { data: await getPayloadSiteStats(HOMEPAGE_STAT_KEYS), error: null }
    : await supabaseServer
        .from("site_stats")
        .select("key, numeric_value, suffix, label")
        .in("key", [...HOMEPAGE_STAT_KEYS])
        .order("sort_order");

  if (error) {
    console.error("[HomeStatsServer] fetch failed:", error.message);
  }

  const stats = getHomepageStats(data as HomeStatRow[] | null);

  // Translate known stat labels (fallback labels and DB labels with matching keys)
  const translatedStats = stats.map((stat) => {
    const tKey = STAT_LABEL_KEYS[stat.label];
    return tKey ? { ...stat, label: t(tKey) } : stat;
  });

  return <HomeStats stats={translatedStats} />;
}
