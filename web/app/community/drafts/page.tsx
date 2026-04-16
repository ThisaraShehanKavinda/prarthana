import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchAllArticles, isSheetsConfigured } from "@/lib/sheets";
import { authorOwnsArticle } from "@/lib/article-feed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "My drafts" };

export default async function MyDraftsPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent("/community/drafts")}`
    );
  }
  if (!isSheetsConfigured()) redirect("/community");

  const articles = await fetchAllArticles();
  const mine = articles
    .filter(
      (a) =>
        authorOwnsArticle(a, session.user.email) &&
        (a.status === "draft" ||
          a.status === "scheduled" ||
          a.status === "pending")
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <p className="text-sm text-[var(--muted-foreground)]">
        <Link href="/community" className="text-[var(--primary)] hover:underline">
          ← Community
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">My drafts &amp; pending</h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        Scheduled posts appear here until they go live.
      </p>
      <div className="mt-8 space-y-3">
        {mine.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">Nothing here yet.</p>
        ) : (
          mine.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium text-[var(--foreground)]">{a.title}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Updated {new Date(a.updatedAt).toLocaleString()}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {a.status}
                  </Badge>
                  {a.status === "scheduled" && a.scheduledPublishAt ? (
                    <Badge variant="outline" className="text-[10px]">
                      {new Date(a.scheduledPublishAt).toLocaleString()}
                    </Badge>
                  ) : null}
                </div>
              </div>
              <Button asChild size="sm" className="shrink-0 rounded-full">
                <Link href={`/community/${a.slug}/edit`}>Edit</Link>
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
