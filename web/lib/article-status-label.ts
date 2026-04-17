import type { ArticleStatus } from "@/lib/types";

/** Human-facing status for badges and headings (storage still uses `pending`). */
export function articleStatusDisplayLabel(status: ArticleStatus): string {
  switch (status) {
    case "pending":
      return "Under review";
    case "draft":
      return "Draft";
    case "scheduled":
      return "Scheduled";
    case "published":
      return "Published";
    default:
      return status;
  }
}
