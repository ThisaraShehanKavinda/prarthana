export type ArticleStatus = "draft" | "scheduled" | "pending" | "published";

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
  /** Topic ids from `COMMUNITY_TOPIC_TAGS`, stored comma-separated in Sheets. */
  tags: string[];
  /** ISO datetime when a `scheduled` post becomes visible to everyone. */
  scheduledPublishAt: string;
}

export type CommentVisibility = "public" | "hidden";

export interface Comment {
  id: string;
  createdAt: string;
  articleId: string;
  authorEmail: string;
  authorName: string;
  body: string;
  visibility: CommentVisibility;
  /** Parent comment id for threading; empty = top-level. */
  parentCommentId: string;
}

export interface ArticleLike {
  id: string;
  createdAt: string;
  articleId: string;
  authorEmail: string;
  authorName: string;
}

export type NotificationType =
  | "comment_reply"
  | "mention"
  | "mod_comment_hidden"
  | "mod_post_hidden";

export interface AppNotification {
  id: string;
  createdAt: string;
  recipientEmail: string;
  type: NotificationType;
  title: string;
  body: string;
  linkHref: string;
  readAt: string;
}

export type ReportTargetType = "article" | "comment";

export type ReportStatus = "open" | "reviewed";

export interface ContentReport {
  id: string;
  createdAt: string;
  reporterEmail: string;
  targetType: ReportTargetType;
  targetId: string;
  articleId: string;
  reasonCode: string;
  note: string;
  status: ReportStatus;
}
