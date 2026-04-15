"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link2, MessageCircle, Share2 } from "lucide-react";

export function ShareBar({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const text = `${title}\n${url}`;

  function wa() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setOpen(false);
  }

  function li() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setOpen(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 gap-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden text-xs font-medium sm:inline">Share</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden p-0 sm:max-w-md">
          <DialogHeader className="border-b border-[var(--border)] px-5 py-4 text-left">
            <DialogTitle>Share post</DialogTitle>
            <p className="truncate text-sm font-normal text-[var(--muted-foreground)]">
              {title}
            </p>
          </DialogHeader>
          <div className="flex flex-col py-1">
            <button
              type="button"
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition hover:bg-[var(--muted)]"
              onClick={wa}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="font-medium">WhatsApp</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition hover:bg-[var(--muted)]"
              onClick={li}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2]/15 text-[#0A66C2]">
                <Share2 className="h-5 w-5" />
              </span>
              <span className="font-medium">LinkedIn</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition hover:bg-[var(--muted)]"
              onClick={copy}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--foreground)]">
                <Link2 className="h-5 w-5" />
              </span>
              <span className="font-medium">{copied ? "Link copied!" : "Copy link"}</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
