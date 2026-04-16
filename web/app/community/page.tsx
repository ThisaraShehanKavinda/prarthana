import Link from "next/link";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import {
  fetchAllArticles,
  fetchAllComments,
  fetchAllLikes,
  isSheetsConfigured,
} from "@/lib/sheets";
import { articlesVisibleTo } from "@/lib/article-visibility";
import { commentsVisibleToReader } from "@/lib/comment-filters";
import { Button } from "@/components/ui/button";
import { FeedPost } from "@/components/community/feed-post";
import { ContinueLearningBanner } from "@/components/community/continue-learning-banner";
import { CommunityGuidelinesBanner } from "@/components/community/community-guidelines-banner";
import { COMMUNITY_TOPIC_TAGS } from "@/lib/community-topic-tags";
import { isEditor } from "@/lib/editors";
import type { Comment } from "@/lib/types";

export const metadata = {
  title: "Community",
  description:
    "Share updates, comment, and connect with others in a respectful space.",
};

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const sp = await searchParams;
  const tagFilter = (sp.tag ?? "").trim().toLowerCase();
  const session = await auth();
  const configured = isSheetsConfigured();
  const articles = configured ? await fetchAllArticles() : [];
  const visible = articlesVisibleTo(articles, session).filter(
    (a) => !tagFilter || (a.tags ?? []).includes(tagFilter)
  );
  const allComments = configured ? await fetchAllComments() : [];
  const allLikes = configured ? await fetchAllLikes() : [];

  const byArticle = new Map<string, Comment[]>();
  for (const c of allComments) {
    const list = byArticle.get(c.articleId) ?? [];
    list.push(c);
    byArticle.set(c.articleId, list);
  }
  for (const [, list] of byArticle) {
    list.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  const shareBaseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  return (
    <div className="min-h-screen bg-[var(--muted)]/40 pb-20 pt-6 sm:pt-10">
      <div className="mx-auto max-w-lg px-3 sm:px-4">
        <header className="mb-4 flex flex-col gap-3 px-0 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between min-[420px]:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)] min-[420px]:text-2xl">
              Community
            </h1>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)] sm:text-sm">
              Read and join the conversation
            </p>
          </div>
          <div className="flex w-full min-w-0 flex-col gap-2 min-[420px]:w-auto min-[420px]:flex-row min-[420px]:justify-end">
            {session?.user ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-10 w-full shrink-0 rounded-full px-4 min-[420px]:h-9 min-[420px]:w-auto"
              >
                <Link href="/community/drafts">My drafts</Link>
              </Button>
            ) : null}
            {session?.user?.email && isEditor(session.user.email) ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-10 w-full shrink-0 rounded-full px-4 min-[420px]:h-9 min-[420px]:w-auto"
              >
                <Link href="/community/mod/reports">Reports inbox</Link>
              </Button>
            ) : null}
            <Button
              asChild
              size="sm"
              className="h-10 w-full shrink-0 rounded-full px-5 shadow-sm min-[420px]:h-9 min-[420px]:w-auto"
            >
              <Link href="/community/new">Create post</Link>
            </Button>
          </div>
        </header>

        <CommunityGuidelinesBanner />
        <ContinueLearningBanner />

        <div className="mb-4 flex flex-wrap gap-2">
          <Link
            href="/community"
            className={cn(
              "rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium transition-colors",
              !tagFilter
                ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            )}
          >
            All topics
          </Link>
          {COMMUNITY_TOPIC_TAGS.map((t) => (
            <Link
              key={t.id}
              href={tagFilter === t.id ? "/community" : `/community?tag=${encodeURIComponent(t.id)}`}
              className={cn(
                "rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium transition-colors",
                tagFilter === t.id
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              )}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {!configured && (
          <p className="mb-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-100">
            {process.env.NODE_ENV === "development" ? (
              <>
                Community storage is not configured. Set{" "}
                <code className="rounded bg-black/5 px-1 text-xs dark:bg-white/10">
                  GOOGLE_SERVICE_ACCOUNT_JSON
                </code>{" "}
                and{" "}
                <code className="rounded bg-black/5 px-1 text-xs dark:bg-white/10">
                  SHEETS_SPREADSHEET_ID
                </code>{" "}
                (see <code className="rounded bg-black/5 px-1 text-xs dark:bg-white/10">.env.example</code>
                ).
              </>
            ) : (
              <>
                Community is temporarily unavailable. Please try again later.
              </>
            )}
          </p>
        )}

        <div className="space-y-4">
          {visible.length === 0 && configured && (
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-10 text-center text-[var(--muted-foreground)]">
              <p className="font-medium text-[var(--foreground)]">No posts yet</p>
              <p className="mt-1 text-sm">Create the first update for your community.</p>
              <Button asChild className="mt-4 rounded-full">
                <Link href="/community/new">Create post</Link>
              </Button>
            </div>
          )}

          {visible.map((article, index) => {
            const raw = byArticle.get(article.id) ?? [];
            const comments = commentsVisibleToReader(
              raw,
              article.authorEmail,
              session?.user?.email
            );
            const likesForPost = allLikes.filter((l) => l.articleId === article.id);
            const likeCount = likesForPost.length;
            const likedByMe = Boolean(
              session?.user?.email &&
                likesForPost.some(
                  (l) =>
                    l.authorEmail.toLowerCase() ===
                    session.user.email!.toLowerCase()
                )
            );
            return (
              <FeedPost
                key={article.id}
                article={article}
                comments={comments}
                likeCount={likeCount}
                likedByMe={likedByMe}
                shareBaseUrl={shareBaseUrl}
                currentUserEmail={session?.user?.email}
                listIndex={index}
                viewerIsEditor={
                  session?.user?.email
                    ? isEditor(session.user.email)
                    : false
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
