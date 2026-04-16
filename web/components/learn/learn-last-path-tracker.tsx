"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { LearnLastPayload } from "@/lib/client-storage";
import { STORAGE_LEARN_LAST } from "@/lib/client-storage";

/**
 * Persists the latest Learn page for the “continue learning” strip on Community.
 */
export function LearnLastPathTracker({ label }: { label: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith("/learn")) return;
    const payload: LearnLastPayload = {
      href: pathname,
      label: label.trim() || "Learn",
      at: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_LEARN_LAST, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, [pathname, label]);

  return null;
}
