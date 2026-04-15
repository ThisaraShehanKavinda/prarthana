"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CommentFormCompact({ articleId }: { articleId: string }) {
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
        setError(data.error ?? "Failed");
        setLoading(false);
        return;
      }
      setBody("");
      window.location.reload();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Input
          placeholder="Write a comment…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={2000}
          className="min-h-10 min-w-0 w-full flex-1 rounded-full border-[var(--border)] bg-[var(--muted)]/40 text-sm"
        />
        <Button
          type="submit"
          size="sm"
          className="h-10 w-full shrink-0 rounded-full sm:h-9 sm:w-auto sm:rounded-lg"
          disabled={loading || body.trim().length < 2}
        >
          {loading ? "…" : "Post"}
        </Button>
      </form>
      {error ? (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
