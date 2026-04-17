import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import {
  fetchAllArticles,
  fetchAllComments,
  fetchAllLikes,
  isSheetsConfigured,
} from "@/lib/sheets";
import { commentsVisibleToReader } from "@/lib/comment-filters";
import { canViewArticle } from "@/lib/article-visibility";
import { isArticlePubliclyVisible } from "@/lib/article-feed";
import { isEditor } from "@/lib/editors";
import { topicLabelForId } from "@/lib/community-topic-tags";
import { articleStatusDisplayLabel } from "@/lib/article-status-label";
import { Badge } from "@/components/ui/badge";
import { ArticleCommentsSection } from "@/components/community/article-comments-section";
import { ShareBar } from "@/components/community/share-bar";
import { LikeToggle } from "@/components/community/like-toggle";
import { ExpandableMarkdown } from "@/components/community/expandable-markdown";
import { Separator } from "@/components/ui/separator";
import { PostOverflowMenu } from "@/components/community/post-overflow-menu";
import { AuthorAvatar } from "@/components/community/author-avatar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isSheetsConfigured()) {
    return { title: "Article" };
  }
  const articles = await fetchAllArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Article" };
  if (!(article.status === "published" || isArticlePubliclyVisible(article))) {
    return {
      title: "Community article",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  if (!isSheetsConfigured()) notFound();

  const articles = await fetchAllArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article || !canViewArticle(article, session)) notFound();

  const [allComments, allLikes] = await Promise.all([
    fetchAllComments(),
    fetchAllLikes(),
  ]);
  const rawForArticle = allComments.filter((c) => c.articleId === article.id);
  const comments = commentsVisibleToReader(
    rawForArticle,
    article.authorEmail,
    session?.user?.email
  );
  const likesForPost = allLikes.filter((l) => l.articleId === article.id);
  const likeCount = likesForPost.length;
  const likedByMe = Boolean(
    session?.user?.email &&
      likesForPost.some(
        (l) =>
          l.authorEmail.toLowerCase() === session.user.email!.toLowerCase()
      )
  );

  const shareBaseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  const shareUrl = `${shareBaseUrl}/community/${article.slug}`;
  const viewerEmail = session?.user?.email;
  const canModComments = Boolean(
    viewerEmail &&
      (isEditor(viewerEmail) ||
        viewerEmail.toLowerCase() === article.authorEmail.toLowerCase())
  );
  const editorUser = isEditor(viewerEmail);
  const live = isArticlePubliclyVisible(article) || article.status === "published";
  const statusLabel =
    article.status === "scheduled" && !live
      ? "Scheduled"
      : article.status === "draft"
        ? "Draft"
        : articleStatusDisplayLabel(article.status);

  return (
    <article className="min-h-screen bg-[var(--muted)]/30 pb-16 pt-4 sm:pt-6">
      <div className="mx-auto w-full max-w-lg px-3 sm:max-w-2xl sm:px-4 lg:max-w-3xl xl:max-w-4xl lg:px-6">
        <p className="text-sm text-[var(--muted-foreground)]">
          <Link href="/community" className="font-medium text-[var(--primary)] hover:underline">
            ← Feed
          </Link>
        </p>

        <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <div className="flex gap-3 p-4">
            <AuthorAvatar
              imageUrl={article.authorImageUrl}
              name={article.authorName}
              email={article.authorEmail}
              size="lg"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between min-[480px]:gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">
                      {article.authorName || article.authorEmail}
                    </span>
                    <Badge
                      variant={live ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {statusLabel}
                    </Badge>
                    {article.tags?.length ? (
                      <span className="flex flex-wrap gap-1">
                        {article.tags.map((tid) => (
                          <Badge
                            key={tid}
                            variant="outline"
                            className="text-[10px] font-normal"
                          >
                            {topicLabelForId(tid)}
                          </Badge>
                        ))}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {new Date(article.createdAt).toLocaleString()}
                  </p>
                  <h1 className="mt-2 text-lg font-bold leading-snug min-[400px]:text-xl sm:text-2xl">
                    {article.title}
                  </h1>
                </div>
                <div className="flex shrink-0 justify-end min-[480px]:justify-start">
                  <PostOverflowMenu
                    articleId={article.id}
                    slug={article.slug}
                    title={article.title}
                    authorEmail={article.authorEmail}
                    currentUserEmail={session?.user?.email}
                    shareUrl={shareUrl}
                    showViewPost={false}
                    deleteRedirectTo="/community"
                  />
                </div>
              </div>
            </div>
          </div>

          {article.heroImageUrl ? (
            <div className="relative aspect-[16/10] w-full bg-[var(--muted)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.heroImageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          {article.excerpt ? (
            <p className="border-t border-[var(--border)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
              {article.excerpt}
            </p>
          ) : null}

          <div className="border-t border-[var(--border)] px-4 py-4">
            <ExpandableMarkdown source={article.bodyMarkdown} collapseChars={900} />
          </div>

          <Separator />

          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 px-2 py-2">
            <LikeToggle
              articleId={article.id}
              initialCount={likeCount}
              initialLiked={likedByMe}
            />
            <div className="shrink-0">
              <ShareBar url={shareUrl} title={article.title} />
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Comments</h2>
          {!session?.user ? (
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Sign in to delete your own comments. If this is your post, sign in to hide or unhide comments (⋯ on each bubble).
            </p>
          ) : null}
          {comments.length === 0 && (
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              No comments yet.
            </p>
          )}
          <ArticleCommentsSection
            articleId={article.id}
            articleAuthorEmail={article.authorEmail}
            articleAuthorName={article.authorName}
            articleAuthorImageUrl={article.authorImageUrl}
            comments={comments}
            currentUserEmail={session?.user?.email}
            canModerateComments={canModComments}
            isEditorUser={editorUser}
          />
        </section>
      </div>
    </article>
  );
}
