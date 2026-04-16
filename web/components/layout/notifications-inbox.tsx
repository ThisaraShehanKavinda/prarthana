"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppNotification } from "@/lib/types";
import { cn } from "@/lib/utils";

async function markRead(id: string) {
  await fetch(`/api/notifications/${id}`, { method: "PATCH" });
}

export function NotificationsInbox() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const r = await fetch("/api/notifications", { cache: "no-store" });
      if (!r.ok) return;
      const j = (await r.json()) as {
        items?: AppNotification[];
        unreadCount?: number;
      };
      setItems(j.items ?? []);
      setUnread(typeof j.unreadCount === "number" ? j.unreadCount : 0);
    } catch {
      /* ignore */
    }
  }, [session?.user?.email]);

  useEffect(() => {
    void load();
  }, [load]);

  if (status === "loading" || !session?.user) return null;

  return (
    <DropdownMenu onOpenChange={(o) => o && void load()}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 shrink-0"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 ? (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(100vw-2rem,22rem)] max-h-80 overflow-y-auto">
        <div className="px-2 py-1.5 text-xs font-semibold text-[var(--muted-foreground)]">
          Notifications
        </div>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <p className="px-2 py-3 text-sm text-[var(--muted-foreground)]">You&apos;re all caught up.</p>
        ) : (
          items.map((n) => (
            <DropdownMenuItem key={n.id} asChild className="p-0 focus:bg-transparent">
              <Link
                href={n.linkHref || "/community"}
                className={cn(
                  "block w-full cursor-pointer px-2 py-2 text-left text-sm hover:bg-[var(--muted)]",
                  !n.readAt?.trim() && "bg-[var(--primary)]/5 font-medium"
                )}
                onClick={() => {
                  if (!n.readAt?.trim()) void markRead(n.id);
                }}
              >
                <span className="block text-[var(--foreground)]">{n.title}</span>
                <span className="mt-0.5 line-clamp-2 text-xs text-[var(--muted-foreground)]">
                  {n.body}
                </span>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
