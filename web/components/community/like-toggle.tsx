"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { notify } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heart } from "lucide-react";
import { AuthorAvatar } from "@/components/community/author-avatar";

type Liker = {
  authorEmail: string;
  authorName: string;
  authorImageUrl?: string;
  createdAt: string;
};

export function LikeToggle({
  articleId,
  initialCount,
  initialLiked,
  compact,
}: {
  articleId: string;
  initialCount: number;
  initialLiked: boolean;
  compact?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const { data: session, status } = useSession();
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  /** Increments only on a successful “like” action so the heart animates without flashing on SSR. */
  const [heartBurst, setHeartBurst] = useState(0);
  const [likers, setLikers] = useState<Liker[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncFromServer = useCallback(async () => {
    try {
      const r = await fetch(`/api/articles/${articleId}/likes`);
      if (!r.ok) return;
      const j = (await r.json()) as {
        count?: number;
        likers?: Liker[];
        likedByMe?: boolean;
      };
      if (typeof j.count === "number") setCount(j.count);
      if (Array.isArray(j.likers)) setLikers(j.likers);
      if (typeof j.likedByMe === "boolean") setLiked(j.likedByMe);
    } catch {
      /* ignore */
    }
  }, [articleId]);

  useEffect(() => {
    setCount(initialCount);
    setLiked(initialLiked);
  }, [articleId, initialCount, initialLiked]);

  useEffect(() => {
    if (busy) return;
    void syncFromServer();
  }, [busy, syncFromServer]);

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openLikersPopover() {
    cancelClose();
    if (count > 0) {
      void syncFromServer();
      setPopoverOpen(true);
    }
  }

  function scheduleClosePopover() {
    cancelClose();
    closeTimer.current = setTimeout(() => setPopoverOpen(false), 180);
  }

  async function toggleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (status === "loading" || busy) return;
    if (!session?.user) {
      void signIn("google");
      return;
    }
    const prev = { count, liked };
    setBusy(true);

    const nextLiked = !liked;
    const nextCount = Math.max(0, nextLiked ? count + 1 : count - 1);
    setLiked(nextLiked);
    setCount(nextCount);
    if (nextLiked && !prev.liked && !reduceMotion) {
      setHeartBurst((n) => n + 1);
    }

    try {
      const r = await fetch(`/api/articles/${articleId}/likes`, {
        method: "POST",
      });
      const j = (await r.json()) as {
        error?: string;
        liked?: boolean;
        count?: number;
        likers?: Liker[];
      };
      if (!r.ok) {
        setLiked(prev.liked);
        setCount(prev.count);
        notify.error(typeof j.error === "string" ? j.error : "Couldn’t update like");
        return;
      }
      if (typeof j.count === "number") setCount(j.count);
      if (typeof j.liked === "boolean") setLiked(j.liked);
      if (Array.isArray(j.likers)) setLikers(j.likers);
    } catch {
      setLiked(prev.liked);
      setCount(prev.count);
      notify.error("Couldn’t update like");
    } finally {
      setBusy(false);
    }
  }

  const showList = count > 0;
  const listLabel =
    likers.length === 0
      ? "Loading…"
      : likers.length === 1
        ? "1 person likes this"
        : `${likers.length} people like this`;

  return (
    <div className="flex min-w-0 items-center gap-0.5 sm:gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={`h-9 shrink-0 gap-1.5 sm:gap-2 ${liked ? "text-rose-500 hover:text-rose-600" : "text-[var(--muted-foreground)]"}`}
        onClick={toggleLike}
        disabled={busy || status === "loading"}
        aria-pressed={liked}
        aria-label={liked ? "Unlike" : "Like"}
      >
        <motion.span
          className="inline-flex will-change-transform"
          whileTap={reduceMotion ? undefined : { scale: 0.86 }}
          transition={{ type: "spring", stiffness: 520, damping: 22 }}
        >
          <motion.span
            key={heartBurst}
            className="inline-flex"
            initial={
              heartBurst > 0 && !reduceMotion
                ? { scale: 0.78, rotate: -11 }
                : false
            }
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 470, damping: 17 }}
          >
            <Heart className={`h-5 w-5 shrink-0 ${liked ? "fill-current" : ""}`} />
          </motion.span>
        </motion.span>
        {!compact && (
          <span className="hidden text-xs font-medium sm:inline">
            {liked ? "Liked" : "Like"}
          </span>
        )}
      </Button>

      {showList ? (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`min-w-0 truncate rounded-md px-1.5 py-1 text-left text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)] ${compact ? "max-w-[5.5rem]" : "max-w-[10rem] sm:max-w-[14rem]"}`}
              onMouseEnter={openLikersPopover}
              onMouseLeave={scheduleClosePopover}
              onFocus={openLikersPopover}
              onBlur={scheduleClosePopover}
              aria-label={listLabel}
            >
              <span className="tabular-nums">{count}</span>
              {!compact && <span className="hidden sm:inline"> likes</span>}
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            className="max-h-56 overflow-y-auto p-2"
            onMouseEnter={openLikersPopover}
            onMouseLeave={scheduleClosePopover}
          >
            <p className="mb-1.5 border-b border-[var(--border)] pb-1 text-xs font-semibold text-[var(--foreground)]">
              {listLabel}
            </p>
            <ul className="space-y-2 text-sm">
              {likers.map((p) => (
                <li
                  key={p.authorEmail}
                  className="flex min-w-0 items-center gap-2 text-[var(--foreground)]"
                >
                  <AuthorAvatar
                    imageUrl={p.authorImageUrl}
                    name={p.authorName}
                    email={p.authorEmail}
                    size="sm"
                  />
                  <span className="min-w-0 flex-1 truncate">{p.authorName}</span>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      ) : (
        <span
          className={`px-1.5 text-xs tabular-nums text-[var(--muted-foreground)] ${compact ? "" : "sm:pr-2"}`}
          aria-hidden
        >
          0
          {!compact && <span className="hidden sm:inline"> likes</span>}
        </span>
      )}
    </div>
  );
}
