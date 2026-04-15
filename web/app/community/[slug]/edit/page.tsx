import Link from "next/link";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { fetchAllArticles, isSheetsConfigured } from "@/lib/sheets";
import { canViewArticle } from "@/lib/article-visibility";
import { NewArticleForm } from "@/components/community/new-article-form";

export const metadata = {
  title: "Edit post",
};

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.email) {
    redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(`/community/${slug}/edit`)}`
    );
  }
  if (!isSheetsConfigured()) notFound();

  const articles = await fetchAllArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article || !canViewArticle(article, session)) notFound();

  if (article.authorEmail.toLowerCase() !== session.user.email.toLowerCase()) {
    redirect(`/community/${slug}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-sm text-[var(--muted-foreground)]">
        <Link href={`/community/${slug}`} className="text-[var(--primary)] underline">
          ← Back to post
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Edit your post</h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        Update your story, headline, or photo. The post link stays the same.
      </p>
      <div className="mt-8">
        <NewArticleForm
          mode="edit"
          articleId={article.id}
          initial={{
            title: article.title,
            excerpt: article.excerpt,
            bodyMarkdown: article.bodyMarkdown,
            heroImageUrl: article.heroImageUrl,
            slug: article.slug,
          }}
        />
      </div>
    </div>
  );
}
