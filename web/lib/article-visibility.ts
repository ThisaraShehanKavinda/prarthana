import type { Session } from "next-auth";
import type { Article } from "@/lib/types";

export function articlesVisibleTo(
  articles: Article[],
  session: Session | null
): Article[] {
  const em = session?.user?.email?.toLowerCase();
  return articles
    .filter(
      (a) =>
        a.status === "published" ||
        (em && a.authorEmail.toLowerCase() === em && a.status === "pending")
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function canViewArticle(
  article: Article,
  session: Session | null
): boolean {
  if (article.status === "published") return true;
  const em = session?.user?.email?.toLowerCase();
  return Boolean(
    em && article.authorEmail.toLowerCase() === em && article.status === "pending"
  );
}
