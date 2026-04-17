"use client";

import * as React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  error: {
    Icon: AlertCircle,
    label: "Error",
    before: "before:bg-rose-500 dark:before:bg-rose-400",
    badge: "border-rose-500/15 bg-rose-500/[0.12] dark:border-rose-400/20 dark:bg-rose-500/[0.18]",
    icon: "text-rose-600 dark:text-rose-400",
    labelText: "text-rose-600 dark:text-rose-400",
    title: "text-[var(--foreground)]",
    body: "text-[var(--muted-foreground)]",
  },
  warning: {
    Icon: AlertTriangle,
    label: "Warning",
    before: "before:bg-amber-500 dark:before:bg-amber-400",
    badge: "border-amber-500/15 bg-amber-500/[0.12] dark:border-amber-400/20 dark:bg-amber-400/[0.14]",
    icon: "text-amber-700 dark:text-amber-300",
    labelText: "text-amber-700 dark:text-amber-300",
    title: "text-[var(--foreground)]",
    body: "text-[var(--muted-foreground)]",
  },
  info: {
    Icon: Info,
    label: "Info",
    before: "before:bg-[var(--primary)]",
    badge: "border-[var(--primary)]/20 bg-[var(--primary)]/[0.1] dark:bg-[var(--primary)]/[0.16]",
    icon: "text-[var(--primary)]",
    labelText: "text-[var(--primary)]",
    title: "text-[var(--foreground)]",
    body: "text-[var(--muted-foreground)]",
  },
  success: {
    Icon: CheckCircle2,
    label: "Success",
    before: "before:bg-emerald-600 dark:before:bg-emerald-400",
    badge: "border-emerald-600/15 bg-emerald-600/[0.1] dark:border-emerald-400/20 dark:bg-emerald-500/[0.14]",
    icon: "text-emerald-700 dark:text-emerald-300",
    labelText: "text-emerald-700 dark:text-emerald-300",
    title: "text-[var(--foreground)]",
    body: "text-[var(--muted-foreground)]",
  },
} as const;

export type AppNoticeVariant = keyof typeof variants;

export function AppNotice({
  variant,
  title,
  children,
  className,
  compact,
  showKindLabel = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant: AppNoticeVariant;
  title?: string;
  children: React.ReactNode;
  compact?: boolean;
  /** Show a small uppercase kind label (Error, Warning, …). Off when you pass a custom title. */
  showKindLabel?: boolean;
}) {
  const v = variants[variant];
  const { Icon } = v;
  const kindVisible = showKindLabel && !title;

  return (
    <div
      role="alert"
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-[0_10px_38px_-12px_rgba(36,48,68,0.14)] dark:shadow-[0_16px_48px_-14px_rgba(0,0,0,0.55)]",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-[1] before:h-[3px] before:rounded-t-2xl",
        v.before,
        compact ? "p-3.5" : "p-4",
        className
      )}
      {...props}
    >
      <div className={cn("flex gap-3.5", compact ? "gap-3" : "gap-4")}>
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
            compact ? "h-9 w-9" : "h-11 w-11",
            v.badge
          )}
          aria-hidden
        >
          <Icon
            className={cn(compact ? "size-4" : "size-[1.125rem]", v.icon)}
            strokeWidth={2.25}
            aria-hidden
          />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
          {kindVisible ? (
            <p
              className={cn(
                "text-[0.65rem] font-bold uppercase leading-none tracking-[0.16em]",
                compact && "text-[0.6rem] tracking-[0.12em]",
                v.labelText
              )}
            >
              {v.label}
            </p>
          ) : null}
          {title ? (
            <p className={cn("text-sm font-semibold leading-snug tracking-tight", v.title)}>{title}</p>
          ) : null}
          <div
            className={cn(
              "leading-relaxed",
              compact ? "text-[13px]" : "text-[0.9375rem]",
              title ? cn("font-normal", v.body) : "font-medium text-[var(--foreground)]"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
