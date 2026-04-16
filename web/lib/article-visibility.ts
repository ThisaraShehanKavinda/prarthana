import type { Session } from "next-auth";
import type { Article } from "@/lib/types";
import {
  authorOwnsArticle,
  isArticlePubliclyVisible,
} from "@/lib/article-feed";

/** Feed: public-visible posts, or the author’s pending / draft / scheduled posts. */
export function articlesVisibleTo(
  articles: Article[],
  session: Session | null
): Article[] {
  const em = session?.user?.email?.toLowerCase();
  return articles
    .filter((a) => {
      if (isArticlePubliclyVisible(a)) return true;
      if (!em) return false;
      return (
        authorOwnsArticle(a, em) &&
        (a.status === "pending" ||
          a.status === "draft" ||
          a.status === "scheduled")
      );
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

/** Single post page: author always; others only when not draft/pending and publicly visible or published. */
export function canViewArticle(
  article: Article,
  session: Session | null
): boolean {
  if (authorOwnsArticle(article, session?.user?.email)) return true;
  if (article.status === "draft" || article.status === "pending") return false;
  return isArticlePubliclyVisible(article);
}
