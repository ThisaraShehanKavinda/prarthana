"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Article, Comment } from "@/lib/types";
import { ExpandableMarkdown } from "@/components/community/expandable-markdown";
import { ShareBar } from "@/components/community/share-bar";
import { LikeToggle } from "@/components/community/like-toggle";
import { CommentFormCompact } from "@/components/community/comment-form-compact";
import { CommentBubbles } from "@/components/community/comment-bubbles";
import { PostOverflowMenu } from "@/components/community/post-overflow-menu";
import { useCommunityVisitBaseline } from "@/components/community/community-visit-provider";
import { cn } from "@/lib/utils";

function initials(name: string | null | undefined, email: string) {
  const n = (name || email || "?").trim();
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
  return n.slice(0, 2).toUpperCase();
}

function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(iso).toLocaleDateString();
}

export function FeedPost({
  article,
  comments,
  likeCount,
  likedByMe,
  shareBaseUrl,
  currentUserEmail,
  listIndex,
}: {
  article: Article;
  comments: Comment[];
  likeCount: number;
  likedByMe: boolean;
  shareBaseUrl: string;
  currentUserEmail?: string | null;
  /** Staggered entrance on the main feed; omit on other surfaces. */
  listIndex?: number;
}) {
  const reduce = useReducedMotion();
  const visit = useCommunityVisitBaseline();
  const isNewSinceLastVisit = Boolean(
    visit?.ready &&
      visit.baselineIso &&
      new Date(article.createdAt).getTime() > new Date(visit.baselineIso).getTime()
  );
  const [heroLoaded, setHeroLoaded] = useState(!article.heroImageUrl);
  const url = `${shareBaseUrl.replace(/\/$/, "")}/community/${article.slug}`;
  const author = article.authorName || article.authorEmail;
  const topComments = comments.slice(-3);
  const stagger =
    listIndex !== undefined && !reduce
      ? { delay: Math.min(listIndex, 14) * 0.04 }
      : undefined;

  return (
    <motion.article
      initial={
        listIndex !== undefined && !reduce
          ? { opacity: 0, y: 18 }
          : false
      }
      animate={{ opacity: 1, y: 0 }}
      transition={
        stagger
          ? { duration: 0.4, ease: [0.22, 1, 0.36, 1], ...stagger }
          : { duration: 0.2 }
      }
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm",
        "transition-[border-color,box-shadow] duration-300 hover:border-[var(--primary)]/20 hover:shadow-md hover:shadow-[var(--foreground)]/[0.04]"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex gap-3 p-4 pb-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/15 text-sm font-bold text-[var(--primary)]"
          aria-hidden
        >
          {initials(article.authorName, article.authorEmail)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1.5 sm:gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-semibold text-[var(--foreground)]">{author}</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  · {timeAgo(article.createdAt)}
                </span>
                {article.status === "pending" && (
                  <Badge variant="secondary" className="text-[10px]">
                    Pending
                  </Badge>
                )}
                {isNewSinceLastVisit && (
                  <Badge className="border-0 bg-[var(--primary)]/15 text-[10px] font-semibold text-[var(--primary)]">
                    New
                  </Badge>
                )}
              </div>
              <h2 className="mt-1 text-lg font-bold leading-snug tracking-tight text-[var(--foreground)]">
                <Link
                  href={`/community/${article.slug}`}
                  className="hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {article.title}
                </Link>
              </h2>
            </div>
            <PostOverflowMenu
              articleId={article.id}
              slug={article.slug}
              title={article.title}
              authorEmail={article.authorEmail}
              currentUserEmail={currentUserEmail}
              shareUrl={url}
            />
          </div>
        </div>
      </div>

      {article.heroImageUrl ? (
        <Link href={`/community/${article.slug}`} className="block">
          <div className="relative aspect-[16/10] w-full bg-[var(--muted)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.heroImageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              onLoad={() => setHeroLoaded(true)}
              onError={() => setHeroLoaded(true)}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-500 ease-out",
                heroLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        </Link>
      ) : null}

      <div className="space-y-2 px-4 pb-3 pt-2">
        {article.excerpt ? (
          <p className="text-[15px] text-[var(--muted-foreground)]">{article.excerpt}</p>
        ) : null}
        <div className="text-[15px]">
          <ExpandableMarkdown source={article.bodyMarkdown} collapseChars={280} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 px-2 py-1.5 text-xs text-[var(--muted-foreground)]">
        <span className="min-w-0">
          {comments.length === 0
            ? "Be the first to comment"
            : `${comments.length} comment${comments.length === 1 ? "" : "s"}`}
        </span>
        <Link
          href={`/community/${article.slug}`}
          className="shrink-0 font-medium text-[var(--primary)] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Open post
        </Link>
      </div>

      <Separator />

      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 px-2 py-1.5">
        <LikeToggle
          articleId={article.id}
          initialCount={likeCount}
          initialLiked={likedByMe}
        />
        <div className="shrink-0">
          <ShareBar url={url} title={article.title} />
        </div>
      </div>

      {topComments.length > 0 && (
        <div className="border-t border-[var(--border)] bg-[var(--muted)]/25 px-3 py-3 sm:px-4">
          <p className="mb-2 text-xs font-medium text-[var(--muted-foreground)]">
            Latest comments
          </p>
          <CommentBubbles
            articleAuthorEmail={article.authorEmail}
            comments={topComments}
            currentUserEmail={currentUserEmail}
          />
        </div>
      )}

      <div className="border-t border-[var(--border)] p-2 sm:p-3">
        <CommentFormCompact articleId={article.id} />
      </div>
    </motion.article>
  );
}
