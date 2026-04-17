import Link from "next/link";

export const metadata = {
  title: "Community guidelines",
  description: "How we keep this space respectful and useful.",
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:max-w-3xl lg:px-8">
      <p className="text-sm text-[var(--muted-foreground)]">
        <Link href="/community" className="font-medium text-[var(--primary)] hover:underline">
          ← Community
        </Link>
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Community guidelines</h1>
      <div className="prose prose-neutral mt-8 max-w-none space-y-4 text-[var(--foreground)] dark:prose-invert">
        <p>
          This community is for sharing experiences and support around cancer literacy—not
          for diagnosing or replacing medical advice. Always follow your care team’s guidance.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-[var(--muted-foreground)]">
          <li>Treat others with empathy; disagree without harassment.</li>
          <li>Do not post private information about others without consent.</li>
          <li>Avoid spam, scams, and repeated off-topic promotion.</li>
          <li>Tag posts accurately so readers can find what they need.</li>
          <li>
            Use <strong className="text-[var(--foreground)]">Report</strong> on posts or
            comments that may violate these rules. Editors review reports and may hide content.
          </li>
        </ul>
        <p className="text-sm text-[var(--muted-foreground)]">
          Slow mode may limit how often you can comment when enabled by administrators.
        </p>
      </div>
    </div>
  );
}
