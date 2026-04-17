import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  fetchAllArticles,
  fetchOpenReports,
  isSheetsConfigured,
} from "@/lib/sheets";
import { isEditor } from "@/lib/editors";
import { ReportsModerationTable } from "@/components/community/reports-moderation-table";

export const metadata = { title: "Reports inbox" };

export default async function ModReportsPage() {
  const session = await auth();
  if (!session?.user?.email || !isEditor(session.user.email)) {
    notFound();
  }
  const items = isSheetsConfigured() ? await fetchOpenReports(200) : [];
  const articles = isSheetsConfigured() ? await fetchAllArticles() : [];
  const slugByArticleId = new Map(articles.map((a) => [a.id, a.slug]));

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:max-w-xl sm:px-6 lg:max-w-2xl xl:max-w-5xl lg:px-8">
      <p className="text-sm text-[var(--muted-foreground)]">
        <Link href="/community" className="text-[var(--primary)] hover:underline">
          ← Community
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Content reports</h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        Open reports from the community. Mark as reviewed after you take action.
      </p>
      <div className="mt-8">
        <ReportsModerationTable
          initial={items}
          articleSlugById={Object.fromEntries(slugByArticleId)}
        />
      </div>
    </div>
  );
}
