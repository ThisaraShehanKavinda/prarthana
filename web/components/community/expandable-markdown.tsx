"use client";

import { useState } from "react";
import { MarkdownBody } from "@/components/markdown-body";
import { plainTextFromMarkdown } from "@/lib/markdown-preview";
import { Button } from "@/components/ui/button";

const COLLAPSE_CHARS = 320;

export function ExpandableMarkdown({
  source,
  collapseChars = COLLAPSE_CHARS,
}: {
  source: string;
  collapseChars?: number;
}) {
  const fullPlain = plainTextFromMarkdown(source, 50000);
  const needsMore = fullPlain.length > collapseChars;
  const preview = plainTextFromMarkdown(source, collapseChars);
  const [open, setOpen] = useState(false);

  if (!needsMore) {
    return (
      <div className="min-w-0">
        <MarkdownBody source={source} />
      </div>
    );
  }

  if (!open) {
    return (
      <div className="min-w-0 space-y-2">
        <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-[var(--foreground)]/90">
          {preview}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto px-0 font-semibold text-[var(--primary)] hover:bg-transparent hover:underline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          Show more
        </Button>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-2">
      <MarkdownBody source={source} />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-auto px-0 font-semibold text-[var(--primary)] hover:bg-transparent hover:underline"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }}
      >
        Show less
      </Button>
    </div>
  );
}
