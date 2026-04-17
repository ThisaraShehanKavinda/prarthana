"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Comment } from "@/lib/types";
import { buildMentionCandidates } from "@/lib/mention-candidates";
import { CommentBubbles } from "@/components/community/comment-bubbles";
import { CommentForm } from "@/components/community/comment-form";
import { Button } from "@/components/ui/button";

export function ArticleCommentsSection({
  articleId,
  articleAuthorEmail,
  articleAuthorName,
  articleAuthorImageUrl,
  comments,
  currentUserEmail,
  canModerateComments,
  isEditorUser,
}: {
  articleId: string;
  articleAuthorEmail: string;
  articleAuthorName: string;
  /** Post author profile URL for @mention suggestions. */
  articleAuthorImageUrl?: string;
  comments: Comment[];
  currentUserEmail?: string | null;
  canModerateComments: boolean;
  isEditorUser: boolean;
}) {
  const router = useRouter();
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  const mentionCandidates = useMemo(
    () =>
      buildMentionCandidates(
        {
          authorEmail: articleAuthorEmail,
          authorName: articleAuthorName,
          authorImageUrl: articleAuthorImageUrl,
        },
        comments,
        currentUserEmail
      ),
    [
      articleAuthorEmail,
      articleAuthorName,
      articleAuthorImageUrl,
      comments,
      currentUserEmail,
    ]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash?.startsWith("#c-")) {
      const el = document.getElementById(hash.slice(1));
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <>
      <div className="mt-4">
        <CommentBubbles
          articleAuthorEmail={articleAuthorEmail}
          articleId={articleId}
          comments={comments}
          currentUserEmail={currentUserEmail}
          canModerateComments={canModerateComments}
          isEditorUser={isEditorUser}
          onReply={(c) => setReplyTo(c)}
        />
      </div>
      <div className="mt-6">
        {replyTo ? (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 px-3 py-2 text-sm">
            <span className="text-[var(--muted-foreground)]">
              Replying to{" "}
              <span className="font-medium text-[var(--foreground)]">
                {replyTo.authorName || replyTo.authorEmail}
              </span>
            </span>
            <Button type="button" variant="ghost" size="sm" onClick={() => setReplyTo(null)}>
              Cancel
            </Button>
          </div>
        ) : null}
        <CommentForm
          articleId={articleId}
          parentCommentId={replyTo?.id}
          mentionCandidates={mentionCandidates}
          onPosted={() => {
            setReplyTo(null);
            router.refresh();
          }}
        />
      </div>
    </>
  );
}
