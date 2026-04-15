export type ArticleStatus = "published" | "pending";

export interface Article {
  id: string;
  createdAt: string;
  updatedAt: string;
  authorEmail: string;
  authorName: string;
  title: string;
  slug: string;
  excerpt: string;
  bodyMarkdown: string;
  status: ArticleStatus;
  heroImageUrl: string;
}

export interface Comment {
  id: string;
  createdAt: string;
  articleId: string;
  authorEmail: string;
  authorName: string;
  body: string;
}
