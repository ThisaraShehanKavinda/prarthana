"use client";

import { useEffect, useState } from "react";
import { authorInitials } from "@/lib/author-initials";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "h-8 w-8 text-[0.65rem]",
  md: "h-11 w-11 text-sm",
  lg: "h-12 w-12 text-base",
} as const;

export function AuthorAvatar({
  imageUrl,
  name,
  email,
  size = "sm",
  className,
}: {
  imageUrl?: string | null;
  name?: string | null;
  email: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const raw = imageUrl?.trim();
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(raw) && !failed;
  const initials = authorInitials(name, email);

  useEffect(() => {
    setFailed(false);
  }, [raw]);

  const ring =
    "shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--muted)]/50";

  if (showPhoto) {
    return (
      <span className={cn(ring, sizes[size], className)} title={name || email}>
        {/* eslint-disable-next-line @next/next/no-img-element -- OAuth / stored URLs vary by host */}
        <img
          src={raw}
          alt=""
          referrerPolicy="no-referrer"
          width={48}
          height={48}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        ring,
        "flex items-center justify-center bg-[var(--primary)]/15 font-semibold text-[var(--primary)]",
        sizes[size],
        className
      )}
      title={name || email}
      aria-hidden
    >
      {initials}
    </span>
  );
}
