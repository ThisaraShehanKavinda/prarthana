"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const STORAGE_KEY = "prarthana_liked_posts_v1";

function readLiked(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function writeLiked(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export function LikeToggle({
  articleId,
  compact,
}: {
  articleId: string;
  compact?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLiked(readLiked().has(articleId));
  }, [articleId]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = new Set(readLiked());
    if (next.has(articleId)) next.delete(articleId);
    else next.add(articleId);
    writeLiked(next);
    setLiked(next.has(articleId));
  }

  if (!mounted) {
    return (
      <Button type="button" variant="ghost" size="sm" className="h-9" disabled>
        <Heart className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={`h-9 gap-2 ${liked ? "text-rose-500 hover:text-rose-600" : "text-[var(--muted-foreground)]"}`}
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
      {!compact && (
        <span className="hidden text-xs font-medium sm:inline">
          {liked ? "Liked" : "Like"}
        </span>
      )}
    </Button>
  );
}
