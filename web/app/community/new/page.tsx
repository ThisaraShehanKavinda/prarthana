import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NewArticleForm } from "@/components/community/new-article-form";

export const metadata = {
  title: "Create post",
};

export default async function NewArticlePage() {
  const session = await auth();
  if (!session?.user) {
    redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent("/community/new")}`
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-sm text-[var(--muted-foreground)]">
        <Link href="/community" className="text-[var(--primary)] underline">
          ← Back to community
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">New post</h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        Write like a social post—add a photo, headline, and story. Some accounts
        publish right away; others may need a quick review before the post goes
        live.
      </p>
      <div className="mt-8">
        <NewArticleForm />
      </div>
    </div>
  );
}
