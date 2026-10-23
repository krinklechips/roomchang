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

const STAT_KEY_LABEL_KEYS: Record<string, string> = {
  years_experience: "yearsOfExperience",
  specialist_dentists: "specialistDentists",
  branches_count: "phnomPenhBranches",
  patients_treated: "patientsTreated",
};

export async function HomeStatsServer() {
  const t = await getTranslations("homeStats");
  const payload = isPayloadSource();

  const { data, error } = payload
    ? { data: await getPayloadSiteStats(HOMEPAGE_STAT_KEYS), error: null }
    : await supabaseServer
        .from("site_stats")
        .select("key, numeric_value, suffix, label")
        .in("key", [...HOMEPAGE_STAT_KEYS])
        .order("sort_order");

  if (error) {
    console.error("[HomeStatsServer] fetch failed:", error.message);
  }

  const fallbackLabels = Object.fromEntries(HOMEPAGE_STAT_KEYS.map((key) => [key, t(STAT_KEY_LABEL_KEYS[key])]));
  const stats = getHomepageStats(data as HomeStatRow[] | null, fallbackLabels, payload);

  // Translate known stat labels (fallback labels and DB labels with matching keys)
  const translatedStats = stats.map((stat) => {
    const tKey = STAT_LABEL_KEYS[stat.label];
    return !payload && tKey ? { ...stat, label: t(tKey) } : stat;
  });

  return translatedStats.length ? <HomeStats stats={translatedStats} /> : null;
}
