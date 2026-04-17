"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { MentionCandidate } from "@/lib/mention-candidates";
import { filterMentionCandidates } from "@/lib/mention-candidates";
import { AuthorAvatar } from "@/components/community/author-avatar";

type ActiveMention = {
  atIndex: number;
  /** Cursor position (end of partial @query). */
  caret: number;
  query: string;
};

function findActiveMention(value: string, caret: number): ActiveMention | null {
  const before = value.slice(0, caret);
  const at = before.lastIndexOf("@");
  if (at < 0) return null;
  const charBefore = at > 0 ? before[at - 1] : "";
  if (charBefore && !/\s/.test(charBefore)) return null;
  const afterAt = before.slice(at + 1);
  if (/[\s\n\r]/.test(afterAt)) return null;
  if (!/^[\w.-]*$/.test(afterAt)) return null;
  return { atIndex: at, caret, query: afterAt };
}

export function CommentTextareaWithMentions({
  id,
  value,
  onChange,
  mentionCandidates,
  disabled,
  className,
  wrapperClassName,
  ...rest
}: Omit<React.ComponentProps<typeof Textarea>, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  mentionCandidates: MentionCandidate[];
  /** Layout on the outer wrapper (e.g. `flex-1 min-w-0` beside a button). */
  wrapperClassName?: string;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [active, setActive] = useState<ActiveMention | null>(null);
  const [filtered, setFiltered] = useState<MentionCandidate[]>([]);
  const [highlight, setHighlight] = useState(0);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const close = useCallback(() => {
    setActive(null);
    setFiltered([]);
    setHighlight(0);
  }, []);

  const syncMenu = useCallback(() => {
    const el = taRef.current;
    if (!el || !active) return;
    if (!mentionCandidates.length || !filtered.length) {
      setMenuStyle({ display: "none" });
      return;
    }
    const r = el.getBoundingClientRect();
    const lineHeight = 22;
    const approxLines = Math.min(5, Math.max(1, filtered.length));
    setMenuStyle({
      position: "fixed",
      left: r.left,
      top: Math.min(r.bottom + 4, window.innerHeight - approxLines * lineHeight - 16),
      width: r.width,
      zIndex: 80,
      maxHeight: "11rem",
    });
  }, [active, filtered, mentionCandidates.length]);

  useLayoutEffect(() => {
    syncMenu();
  }, [syncMenu, value, filtered.length]);

  useEffect(() => {
    if (!active) return;
    const onScroll = () => syncMenu();
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [active, syncMenu]);

  function applyMention(c: MentionCandidate) {
    if (!active || !taRef.current) return;
    const { atIndex, caret } = active;
    const next =
      value.slice(0, atIndex) + `@${c.insertToken} ` + value.slice(caret);
    onChange(next);
    close();
    requestAnimationFrame(() => {
      const el = taRef.current;
      if (!el) return;
      const pos = atIndex + c.insertToken.length + 2;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  }

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    const caret = e.target.selectionStart ?? v.length;
    onChange(v);
    const m = findActiveMention(v, caret);
    if (!m || mentionCandidates.length === 0) {
      close();
      return;
    }
    setActive(m);
    const list = filterMentionCandidates(mentionCandidates, m.query);
    setFiltered(list);
    setHighlight(0);
    if (list.length === 0) {
      setMenuStyle({ display: "none" });
    }
  };

  const onSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    const m = findActiveMention(el.value, el.selectionStart ?? 0);
    if (!m || mentionCandidates.length === 0) {
      close();
      return;
    }
    setActive(m);
    setFiltered(filterMentionCandidates(mentionCandidates, m.query));
    setHighlight(0);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!active || filtered.length === 0) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % filtered.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + filtered.length) % filtered.length);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      applyMention(filtered[highlight]!);
    }
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      applyMention(filtered[highlight]!);
    }
  };

  return (
    <div className={cn("relative", wrapperClassName)}>
      <Textarea
        ref={taRef}
        id={id}
        value={value}
        disabled={disabled}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        onClick={onSelect}
        onSelect={onSelect}
        className={cn("w-full max-w-full", className)}
        {...rest}
      />
      {active && filtered.length > 0 ? (
        <div
          role="listbox"
          aria-label="Mention suggestions"
          className="overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--popover)] py-1 text-sm shadow-lg"
          style={menuStyle}
        >
          {filtered.map((c, i) => (
            <button
              key={c.email}
              type="button"
              role="option"
              aria-selected={i === highlight}
              className={cn(
                "flex w-full items-center gap-2.5 px-2.5 py-2 text-left hover:bg-[var(--muted)]",
                i === highlight && "bg-[var(--muted)]"
              )}
              onMouseDown={(ev) => {
                ev.preventDefault();
                applyMention(c);
              }}
              onMouseEnter={() => setHighlight(i)}
            >
              <AuthorAvatar
                imageUrl={c.imageUrl}
                name={c.label}
                email={c.email}
                size="sm"
                className="shrink-0"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-[var(--foreground)]">
                  {c.label}
                </span>
                <span className="mt-0.5 block truncate text-xs text-[var(--muted-foreground)]">
                  @{c.insertToken} · {c.email}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
