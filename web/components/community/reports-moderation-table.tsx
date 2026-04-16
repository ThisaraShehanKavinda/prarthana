"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ContentReport } from "@/lib/types";
import { notify } from "@/lib/notify";

export function ReportsModerationTable({
  initial,
  articleSlugById,
}: {
  initial: ContentReport[];
  articleSlugById: Record<string, string>;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function markReviewed(id: string) {
    setBusy(id);
    try {
      const r = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "reviewed" }),
      });
      if (!r.ok) {
        const j = (await r.json()) as { error?: string };
        notify.error(j.error ?? "Could not update");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== id));
      notify.success("Marked reviewed");
      router.refresh();
    } catch {
      notify.error("Network error");
    } finally {
      setBusy(null);
    }
  }

  if (items.length === 0) {
    return <p className="text-sm text-[var(--muted-foreground)]">No open reports.</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((rep) => (
        <li
          key={rep.id}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold capitalize text-[var(--foreground)]">
              {rep.targetType}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              {new Date(rep.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            From {rep.reporterEmail} · {rep.reasonCode}
          </p>
          {rep.note ? (
            <p className="mt-2 text-[var(--foreground)]">{rep.note}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <Link
                href={`/community/${articleSlugById[rep.articleId] ?? rep.articleId}`}
              >
                Open article
              </Link>
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-full"
              disabled={busy === rep.id}
              onClick={() => void markReviewed(rep.id)}
            >
              {busy === rep.id ? "…" : "Mark reviewed"}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
