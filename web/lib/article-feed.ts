import type { Article, ArticleStatus } from "@/lib/types";

const STATUSES: ArticleStatus[] = [
  "draft",
  "scheduled",
  "pending",
  "published",
];

export function normalizeArticleStatus(raw: string | undefined): ArticleStatus {
  const s = (raw ?? "").toLowerCase().trim();
  if (STATUSES.includes(s as ArticleStatus)) return s as ArticleStatus;
  return "published";
}

/** Public feed: published, or scheduled whose time has passed. */
export function isArticlePubliclyVisible(
  article: Article,
  nowMs: number = Date.now()
): boolean {
  if (article.status === "published") return true;
  if (article.status !== "scheduled") return false;
  const t = article.scheduledPublishAt?.trim();
  if (!t) return false;
  const ms = new Date(t).getTime();
  if (Number.isNaN(ms)) return false;
  return ms <= nowMs;
}

export function authorOwnsArticle(
  article: Article,
  email: string | null | undefined
): boolean {
  if (!email) return false;
  return article.authorEmail.toLowerCase() === email.toLowerCase();
}
