import stats from "@/content/stats.json";

export type SiteStats = typeof stats;

export function getSiteStats(): SiteStats {
  return stats;
}
