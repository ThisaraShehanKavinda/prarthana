"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  closeAppMessage,
  getAppMessageSnapshot,
  showAppAlert,
  subscribeAppMessage,
  type AppMessageState,
  type AppMessageVariant,
} from "@/lib/app-message-store";

const variantStyles: Record<
  AppMessageVariant,
  { Icon: typeof AlertCircle; bar: string; badge: string; iconColor: string }
> = {
  success: {
    Icon: CheckCircle2,
    bar: "before:bg-emerald-600 dark:before:bg-emerald-400",
    badge: "border-emerald-600/15 bg-emerald-600/[0.1] dark:border-emerald-400/20 dark:bg-emerald-500/[0.14]",
    iconColor: "text-emerald-700 dark:text-emerald-300",
  },
  error: {
    Icon: AlertCircle,
    bar: "before:bg-rose-500 dark:before:bg-rose-400",
    badge: "border-rose-500/15 bg-rose-500/[0.12] dark:border-rose-400/20 dark:bg-rose-500/[0.18]",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  warning: {
    Icon: AlertTriangle,
    bar: "before:bg-amber-500 dark:before:bg-amber-400",
    badge: "border-amber-500/15 bg-amber-500/[0.12] dark:border-amber-400/20 dark:bg-amber-400/[0.14]",
    iconColor: "text-amber-700 dark:text-amber-300",
  },
  info: {
    Icon: Info,
    bar: "before:bg-[var(--primary)]",
    badge: "border-[var(--primary)]/20 bg-[var(--primary)]/[0.1] dark:bg-[var(--primary)]/[0.16]",
    iconColor: "text-[var(--primary)]",
  },
};

function topBarClass(state: AppMessageState): string {
  if (!state.open) return "";
  if (state.kind === "alert") return variantStyles[state.variant].bar;
  return variantStyles.warning.bar;
}

/** Radix `RemoveScroll` + `scroll-behavior: smooth` can jump the page; keep viewport locked. */
function usePreserveScrollWhileOpen(open: boolean) {
  const yRef = useRef(0);

  useLayoutEffect(() => {
    if (!open) return;
    yRef.current = window.scrollY;
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    const y = yRef.current;
    const restore = () => {
      window.scrollTo({ top: y, left: 0, behavior: "instant" as ScrollBehavior });
    };
    restore();
    const r1 = requestAnimationFrame(restore);
    const r2 = requestAnimationFrame(() => requestAnimationFrame(restore));
    const t0 = setTimeout(restore, 0);
    const t1 = setTimeout(restore, 32);
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
      clearTimeout(t0);
      clearTimeout(t1);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, [open]);
}

export function AppMessagePortal() {
  const state = useSyncExternalStore(subscribeAppMessage, getAppMessageSnapshot, getAppMessageSnapshot);
  const open = state.open;
  const [busy, setBusy] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  usePreserveScrollWhileOpen(open);

  useEffect(() => {
    if (!open) setBusy(false);
  }, [open]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next && !busy) closeAppMessage();
    },
    [busy]
  );

  const handleConfirm = useCallback(async () => {
    if (!state.open || state.kind !== "confirm") return;
    const { onConfirm } = state;
    setBusy(true);
    try {
      await onConfirm();
    } catch (e) {
      console.error(e);
      showAppAlert("error", "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
      const after = getAppMessageSnapshot();
      if (after.open && after.kind === "confirm") {
        closeAppMessage();
      }
    }
  }, [state]);

  const hideDescribedBy =
    open &&
    ((state.kind === "alert" && !state.description) || (state.kind === "confirm" && !state.description));

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange} modal>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <DialogPrimitive.Content
          ref={contentRef}
          {...(hideDescribedBy ? ({ "aria-describedby": undefined } as const) : {})}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            queueMicrotask(() => {
              const el = contentRef.current?.querySelector<HTMLElement>("[data-app-message-primary]");
              el?.focus({ preventScroll: true });
            });
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
          }}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] max-w-md translate-x-[-50%] translate-y-[-50%]",
            "overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--card-foreground)] shadow-[0_24px_64px_-16px_rgba(36,48,68,0.28)] outline-none",
            "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-[1] before:h-[3px] before:rounded-t-2xl",
            topBarClass(state),
            "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "dark:shadow-[0_28px_72px_-20px_rgba(0,0,0,0.75)]"
          )}
          onPointerDownOutside={(e) => {
            if (busy) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (busy) e.preventDefault();
          }}
        >
          {open && state.kind === "alert" ? (
            <AlertPanel state={state} />
          ) : open && state.kind === "confirm" ? (
            <ConfirmPanel state={state} busy={busy} onConfirm={() => void handleConfirm()} />
          ) : null}

          {open && state.kind === "alert" ? (
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                className="absolute right-3 top-3 z-[2] rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                aria-label="Close"
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function AlertPanel({ state }: { state: Extract<AppMessageState, { open: true; kind: "alert" }> }) {
  const v = variantStyles[state.variant];
  const { Icon } = v;

  return (
    <>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
            v.badge
          )}
          aria-hidden
        >
          <Icon className={cn("size-7", v.iconColor)} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
          <DialogPrimitive.Title className="pr-8 text-lg font-semibold leading-snug tracking-tight text-[var(--foreground)] sm:pr-0">
            {state.title}
          </DialogPrimitive.Title>
          {state.description ? (
            <DialogPrimitive.Description className="text-sm leading-relaxed text-[var(--muted-foreground)]">
              {state.description}
            </DialogPrimitive.Description>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-center sm:justify-end">
        <Button
          type="button"
          data-app-message-primary
          className="min-w-[7.5rem] rounded-xl px-6"
          onClick={() => closeAppMessage()}
        >
          OK
        </Button>
      </div>
    </>
  );
}

function ConfirmPanel({
  state,
  busy,
  onConfirm,
}: {
  state: Extract<AppMessageState, { open: true; kind: "confirm" }>;
  busy: boolean;
  onConfirm: () => void;
}) {
  const { Icon } = variantStyles.warning;

  return (
    <>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
            variantStyles.warning.badge
          )}
          aria-hidden
        >
          <Icon className={cn("size-7", variantStyles.warning.iconColor)} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
          <DialogPrimitive.Title className="text-lg font-semibold leading-snug tracking-tight text-[var(--foreground)]">
            {state.title}
          </DialogPrimitive.Title>
          {state.description ? (
            <DialogPrimitive.Description className="text-sm leading-relaxed text-[var(--muted-foreground)]">
              {state.description}
            </DialogPrimitive.Description>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
        <Button
          type="button"
          variant="outline"
          data-app-message-primary
          className="rounded-xl"
          disabled={busy}
          onClick={() => closeAppMessage()}
        >
          {state.cancelLabel}
        </Button>
        <Button
          type="button"
          className={cn(
            "rounded-xl",
            state.destructive && "bg-rose-600 text-white hover:bg-rose-600/90 dark:bg-rose-600 dark:hover:bg-rose-600/90"
          )}
          disabled={busy}
          onClick={onConfirm}
        >
          {busy ? "…" : state.confirmLabel}
        </Button>
      </div>
    </>
  );
}
