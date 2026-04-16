"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { LearnLastPayload } from "@/lib/client-storage";
import { STORAGE_LEARN_LAST } from "@/lib/client-storage";

export function ContinueLearningBanner() {
  const [last, setLast] = useState<LearnLastPayload | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_LEARN_LAST);
      if (!raw) return;
      const j = JSON.parse(raw) as Partial<LearnLastPayload>;
      if (
        typeof j.href === "string" &&
        j.href.startsWith("/learn") &&
        typeof j.label === "string"
      ) {
        setLast({
          href: j.href,
          label: j.label,
          at: typeof j.at === "string" ? j.at : new Date().toISOString(),
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  if (!last) return null;

  return (
    <aside className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/12 text-[var(--primary)]">
          <BookOpen className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            Continue learning
          </p>
          <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">{last.label}</p>
          <Link
            href={last.href}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline"
          >
            Resume
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </aside>
  );
}
