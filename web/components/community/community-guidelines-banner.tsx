import Link from "next/link";

export function CommunityGuidelinesBanner() {
  return (
    <div className="mb-4 rounded-2xl border border-[var(--primary)]/25 bg-[var(--primary)]/8 px-4 py-3 text-sm text-[var(--foreground)]">
      <p className="font-medium">Community guidelines</p>
      <p className="mt-1 text-[var(--muted-foreground)]">
        Be respectful, protect privacy, and stay on topic. Moderators may hide content that
        breaks these rules.
      </p>
      <Link
        href="/community/guidelines"
        className="mt-2 inline-block text-sm font-semibold text-[var(--primary)] hover:underline"
      >
        Read full guidelines
      </Link>
    </div>
  );
}
