"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { notify } from "@/lib/notify";

export function CommentForm({ articleId }: { articleId: string }) {
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
        body: JSON.stringify({ articleId, body }),
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
      window.location.reload();
    } catch {
      setError("Network error");
      notify.error("Network error", "Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Label htmlFor="comment">Add a comment</Label>
      <Textarea
        id="comment"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        minLength={2}
        maxLength={2000}
        rows={4}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
        {loading ? "Posting…" : "Post comment"}
      </Button>
    </form>
  );
}
