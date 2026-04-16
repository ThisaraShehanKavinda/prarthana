"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flag, Link2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notify";
import { SITE_BRAND_LOCKUP_PLAIN } from "@/lib/site-brand";

const REPORT_EMAIL = "hello@example.com";

export function PostOverflowMenu({
  articleId,
  slug,
  title,
  authorEmail,
  currentUserEmail,
  shareUrl,
  deleteRedirectTo,
  showViewPost = true,
}: {
  articleId: string;
  slug: string;
  title: string;
  authorEmail: string;
  currentUserEmail: string | null | undefined;
  shareUrl: string;
  deleteRedirectTo?: string | null;
  /** Hide “View post” on the article detail screen */
  showViewPost?: boolean;
}) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isOwner =
    Boolean(currentUserEmail) &&
    authorEmail.toLowerCase() === currentUserEmail!.toLowerCase();

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      notify.success("Link copied", "You can paste it anywhere.");
    } catch {
      notify.error("Could not copy", "Your browser may block clipboard access.");
    }
  }

  function reportPost() {
    const subject = encodeURIComponent(
      `${SITE_BRAND_LOCKUP_PLAIN} — report post: ${title.slice(0, 50)}`
    );
    const body = encodeURIComponent(
      `I want to report this post:\n${shareUrl}\n\nReason:\n`
    );
    window.location.href = `mailto:${REPORT_EMAIL}?subject=${subject}&body=${body}`;
  }

  async function confirmDelete() {
    setDeleteError(null);
    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${articleId}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        const msg = data.error ?? "Could not delete";
        setDeleteError(msg);
        notify.error("Could not delete post", msg);
        setDeleting(false);
        return;
      }
      setDeleteOpen(false);
      notify.success("Post deleted");
      if (deleteRedirectTo) {
        router.push(deleteRedirectTo);
      } else {
        router.refresh();
      }
    } catch {
      setDeleteError("Network error");
      notify.error("Network error", "Check your connection and try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 shrink-0 rounded-full text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            )}
            aria-label="Post options"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className="min-w-[11rem] max-w-[min(100vw-1.25rem,20rem)]"
        >
          <DropdownMenuItem className="cursor-pointer gap-2" onSelect={() => void copyLink()}>
            <Link2 className="h-4 w-4 shrink-0" />
            Copy link
          </DropdownMenuItem>
          {showViewPost ? (
            <DropdownMenuItem asChild>
              <Link href={`/community/${slug}`} className="flex cursor-pointer items-center gap-2">
                Open post
              </Link>
            </DropdownMenuItem>
          ) : null}
          {isOwner ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/community/${slug}/edit`}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Pencil className="h-4 w-4 shrink-0" />
                  Edit post
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-red-600 focus:bg-red-500/10 focus:text-red-700 dark:text-red-400 dark:focus:text-red-300"
                onSelect={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4 shrink-0" />
                Delete post
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2" onSelect={() => reportPost()}>
                <Flag className="h-4 w-4 shrink-0" />
                Report post
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this post?</DialogTitle>
            <p className="text-left text-sm text-[var(--muted-foreground)]">
              This removes the post and its comments. You can’t undo this.
            </p>
          </DialogHeader>
          {deleteError ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {deleteError}
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 text-white hover:bg-red-600/90"
              disabled={deleting}
              onClick={() => void confirmDelete()}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
