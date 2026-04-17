"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CornerDownRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Comment } from "@/lib/types";
import { confirmDestructive, notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { ReportContentDialog } from "@/components/community/report-content-dialog";
import { AuthorAvatar } from "@/components/community/author-avatar";

function emEq(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}

function timeShort(iso: string) {
  const t = new Date(iso).getTime();
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(iso).toLocaleDateString();
}

function buildReplyMap(comments: Comment[]) {
  const children = new Map<string, Comment[]>();
  const roots: Comment[] = [];
  const sorted = [...comments].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  for (const c of sorted) {
    const p = c.parentCommentId?.trim();
    if (!p) {
      roots.push(c);
      continue;
    }
    const list = children.get(p) ?? [];
    list.push(c);
    children.set(p, list);
  }
  return { roots, children };
}

export function CommentBubbles({
  articleAuthorEmail,
  articleId,
  comments,
  currentUserEmail,
  canModerateComments,
  isEditorUser,
  onReply,
}: {
  articleAuthorEmail: string;
  articleId: string;
  comments: Comment[];
  currentUserEmail?: string | null;
  canModerateComments: boolean;
  isEditorUser?: boolean;
  onReply?: (comment: Comment) => void;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reportTarget, setReportTarget] = useState<Comment | null>(null);

  const { roots, children } = buildReplyMap(comments);

  function deleteComment(id: string) {
    confirmDestructive({
      title: "Delete this comment?",
      description: "This cannot be undone.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        setBusyId(id);
        try {
          const r = await fetch(`/api/comments/${id}`, { method: "DELETE" });
          if (!r.ok) {
            const j = (await r.json()) as { error?: string };
            notify.error(j.error ?? "Could not delete comment");
            return;
          }
          notify.success("Comment deleted");
          router.refresh();
        } catch {
          notify.error("Network error", "Check your connection and try again.");
        } finally {
          setBusyId(null);
        }
      },
    });
  }

  async function setVisibility(id: string, visibility: "public" | "hidden") {
    setBusyId(id);
    try {
      const r = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility }),
      });
      if (!r.ok) {
        const j = (await r.json()) as { error?: string };
        notify.error(j.error ?? "Could not update comment");
        return;
      }
      notify.success(
        visibility === "hidden" ? "Comment hidden from others" : "Comment is visible again"
      );
      router.refresh();
    } catch {
      notify.error("Network error", "Check your connection and try again.");
    } finally {
      setBusyId(null);
    }
  }

  function renderNode(c: Comment, depth: number) {
    const mine = currentUserEmail && emEq(currentUserEmail, c.authorEmail);
    const isHidden = c.visibility === "hidden";
    const canDelete =
      mine ||
      (currentUserEmail && emEq(currentUserEmail, articleAuthorEmail)) ||
      Boolean(isEditorUser);
    const canModerate = canModerateComments;
    const showMenu = canDelete || canModerate || Boolean(currentUserEmail);
    const busy = busyId === c.id;
    const replies = children.get(c.id) ?? [];

    return (
      <li
        key={c.id}
        id={`c-${c.id}`}
        style={
          isHidden
            ? { animationDelay: `${Math.min(depth * 4, 10) * 45}ms` }
            : undefined
        }
        className={cn(
          "list-none",
          depth > 0 && "mt-2 border-l-2 border-[var(--border)] pl-3 sm:pl-4"
        )}
      >
        <div
          className={cn(
            "flex w-full list-none items-start gap-2",
            mine ? "justify-end" : "justify-start",
            isHidden && "prarthana-comment-hidden-in"
          )}
        >
          {!mine ? (
            <AuthorAvatar
              imageUrl={c.authorImageUrl}
              name={c.authorName}
              email={c.authorEmail}
              size="sm"
              className="mt-0.5"
            />
          ) : null}
          <div
            className={cn(
              "relative max-w-[min(100%,20rem)] rounded-3xl px-3.5 py-2.5 sm:max-w-md",
              !isHidden && "shadow-md ring-1 ring-black/5 dark:ring-white/10",
              !isHidden &&
                mine &&
                "rounded-br-lg bg-[var(--primary)] text-[var(--primary-foreground)]",
              !isHidden &&
                !mine &&
                "rounded-bl-lg border border-[var(--border)] bg-[var(--card)]",
              isHidden &&
                mine &&
                "rounded-br-lg bg-zinc-200/95 text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-100",
              isHidden &&
                !mine &&
                "rounded-bl-lg bg-gradient-to-br from-zinc-100 to-zinc-200/85 text-zinc-800 dark:from-zinc-900/40 dark:to-zinc-800/45 dark:text-zinc-100"
            )}
          >
            <div className="flex items-start gap-1.5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      !isHidden && mine && "opacity-95",
                      !isHidden && !mine && "text-[var(--foreground)]",
                      isHidden && mine && "text-zinc-900 dark:text-zinc-100",
                      isHidden && !mine && "text-zinc-800 dark:text-zinc-100"
                    )}
                  >
                    {c.authorName || c.authorEmail}
                  </span>
                  <span
                    className={cn(
                      "text-[10px]",
                      !isHidden && mine && "opacity-80",
                      !isHidden && !mine && "text-[var(--muted-foreground)]",
                      isHidden && mine && "text-zinc-600 dark:text-zinc-400",
                      isHidden && !mine && "text-zinc-600 dark:text-zinc-400"
                    )}
                  >
                    {timeShort(c.createdAt)}
                  </span>
                </div>
                {isHidden && (
                  <p
                    className={cn(
                      "mt-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      "text-zinc-600 dark:text-zinc-400"
                    )}
                  >
                    Hidden from others
                  </p>
                )}
              </div>
              {showMenu ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 shrink-0 border shadow-none",
                        mine &&
                          !isHidden &&
                          "border-white/30 bg-white/10 text-[var(--primary-foreground)] hover:bg-white/20",
                        mine &&
                          isHidden &&
                          "border-0 bg-zinc-300/80 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700/55 dark:text-zinc-100 dark:hover:bg-zinc-700/75",
                        !mine &&
                          "border-[var(--border)] bg-[var(--muted)]/40 text-[var(--foreground)] hover:bg-[var(--muted)]",
                        !mine &&
                          isHidden &&
                          "border-0 bg-zinc-200/80 text-zinc-800 hover:bg-zinc-300/90 dark:bg-zinc-700/45 dark:text-zinc-100 dark:hover:bg-zinc-700/65"
                      )}
                      disabled={busy}
                      aria-label="Comment options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={6}
                    className="z-[100] min-w-[11rem]"
                  >
                    {onReply && currentUserEmail && depth < 8 ? (
                      <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onSelect={(e) => {
                          e.preventDefault();
                          onReply(c);
                        }}
                      >
                        <CornerDownRight className="h-4 w-4 shrink-0" />
                        Reply
                      </DropdownMenuItem>
                    ) : null}
                    {currentUserEmail &&
                    !mine &&
                    !emEq(currentUserEmail, articleAuthorEmail) ? (
                      <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onSelect={(e) => {
                          e.preventDefault();
                          setReportTarget(c);
                        }}
                      >
                        Report
                      </DropdownMenuItem>
                    ) : null}
                    {canDelete ? (
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 dark:text-red-400"
                        onSelect={(e) => {
                          e.preventDefault();
                          void deleteComment(c.id);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    ) : null}
                    {canModerate && c.visibility !== "hidden" ? (
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          void setVisibility(c.id, "hidden");
                        }}
                      >
                        Hide comment
                      </DropdownMenuItem>
                    ) : null}
                    {canModerate && c.visibility === "hidden" ? (
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          void setVisibility(c.id, "public");
                        }}
                      >
                        Unhide comment
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
            <p
              className={cn(
                "mt-1.5 whitespace-pre-wrap text-sm leading-relaxed",
                !isHidden && mine && "opacity-95",
                !isHidden && !mine && "text-[var(--foreground)]/95",
                isHidden && mine && "text-zinc-800/95 dark:text-zinc-100/95",
                isHidden && !mine && "text-zinc-800/95 dark:text-zinc-100/95"
              )}
            >
              {c.body}
            </p>
          </div>
          {mine ? (
            <AuthorAvatar
              imageUrl={c.authorImageUrl}
              name={c.authorName}
              email={c.authorEmail}
              size="sm"
              className="mt-0.5"
            />
          ) : null}
        </div>
        {replies.length > 0 && depth < 8 ? (
          <ul className="mt-2 space-y-0 p-0">
            {replies.map((r) => renderNode(r, depth + 1))}
          </ul>
        ) : null}
      </li>
    );
  }

  return (
    <>
      <ul className="list-none space-y-3 p-0">
        {roots.map((c) => renderNode(c, 0))}
      </ul>
      {reportTarget ? (
        <ReportContentDialog
          open
          onOpenChange={(o) => {
            if (!o) setReportTarget(null);
          }}
          targetType="comment"
          targetId={reportTarget.id}
          articleId={articleId}
        />
      ) : null}
    </>
  );
}
