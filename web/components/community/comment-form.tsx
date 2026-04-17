"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { AppNotice } from "@/components/ui/app-notice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { notify } from "@/lib/notify";
import { CommentTextareaWithMentions } from "@/components/community/comment-textarea-with-mentions";
import type { MentionCandidate } from "@/lib/mention-candidates";

export function CommentForm({
  articleId,
  parentCommentId,
  onPosted,
  mentionCandidates = [],
}: {
  articleId: string;
  parentCommentId?: string | null;
  onPosted?: () => void;
  /** Post author + comment authors for @ autocomplete. */
  mentionCandidates?: MentionCandidate[];
}) {
  const { data: session, status } = useSession();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (status === "loading") {
    return <p className="text-sm text-[var(--muted-foreground)]">Loading session…</p>;
  }
  if (!session?.user) {
    return (
      <p className="text-sm text-[var(--muted-foreground)]">
        Sign in to comment. Only published articles accept public comments.
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          body,
          parentCommentId: parentCommentId?.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        const msg = data.error ?? "Failed to post";
        setError(msg);
        notify.error("Could not post comment", msg);
        setLoading(false);
        return;
      }
      setBody("");
      notify.success("Comment posted");
      if (onPosted) onPosted();
      else window.location.reload();
    } catch {
      setError("Network error");
      notify.error("Network error", "Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full min-w-0 space-y-3">
      <Label htmlFor="comment">
        {parentCommentId ? "Write a reply" : "Add a comment"}
      </Label>
      <CommentTextareaWithMentions
        id="comment"
        value={body}
        onChange={setBody}
        mentionCandidates={mentionCandidates}
        required
        minLength={2}
        maxLength={2000}
        rows={4}
        disabled={loading}
        wrapperClassName="w-full min-w-0"
        placeholder={
          parentCommentId
            ? "Reply… Type @ to mention someone in the thread."
            : "Join the discussion… Type @ for name suggestions."
        }
      />
      {error ? <AppNotice variant="error">{error}</AppNotice> : null}
      <div className="flex justify-end">
        <Button type="submit" className="min-w-[7.5rem]" disabled={loading}>
          {loading ? "Posting…" : parentCommentId ? "Post reply" : "Post comment"}
        </Button>
      </div>
    </form>
  );
}
