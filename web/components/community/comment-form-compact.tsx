"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { AppNotice } from "@/components/ui/app-notice";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notify";
import { CommentTextareaWithMentions } from "@/components/community/comment-textarea-with-mentions";
import type { MentionCandidate } from "@/lib/mention-candidates";

export function CommentFormCompact({
  articleId,
  mentionCandidates = [],
}: {
  articleId: string;
  mentionCandidates?: MentionCandidate[];
}) {
  const { data: session, status } = useSession();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (status === "loading") return null;
  if (!session?.user) {
    return (
      <button
        type="button"
        className="text-left text-xs text-[var(--primary)] underline sm:text-sm"
        onClick={() => signIn("google")}
      >
        Sign in to comment
      </button>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    const t = body.trim();
    if (t.length < 2) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, body: t }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        const msg = data.error ?? "Failed";
        setError(msg);
        notify.error("Could not post comment", msg);
        setLoading(false);
        return;
      }
      setBody("");
      notify.success("Comment posted");
      window.location.reload();
    } catch {
      setError("Network error");
      notify.error("Network error", "Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-end"
        onClick={(e) => e.stopPropagation()}
      >
        <CommentTextareaWithMentions
          id={`compact-comment-${articleId}`}
          value={body}
          onChange={setBody}
          mentionCandidates={mentionCandidates}
          maxLength={2000}
          rows={2}
          disabled={loading}
          placeholder="Write a comment… Type @ for names"
          wrapperClassName="min-w-0 w-full flex-1 sm:max-w-none"
          className="min-h-[2.75rem] resize-none rounded-2xl border-[var(--border)] bg-[var(--muted)]/40 text-sm sm:min-h-[2.5rem]"
        />
        <Button
          type="submit"
          size="sm"
          className="h-10 w-full shrink-0 self-end rounded-full sm:ml-auto sm:h-9 sm:w-auto sm:rounded-lg"
          disabled={loading || body.trim().length < 2}
        >
          {loading ? "…" : "Post"}
        </Button>
      </form>
      {error ? (
        <div className="mt-2">
          <AppNotice variant="error" compact>
            {error}
          </AppNotice>
        </div>
      ) : null}
    </>
  );
}
