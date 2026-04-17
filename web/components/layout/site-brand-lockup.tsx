import { SITE_BRAND_LOCKUP_PLAIN } from "@/lib/site-brand";

const header = {
  root: "inline-flex min-w-0 max-w-none flex-col items-start gap-0 leading-tight md:max-w-[28rem] md:flex-row md:flex-wrap md:items-baseline md:gap-x-1.5 md:gap-y-0",
  primary:
    "font-sinhala-display text-[0.9rem] font-semibold tracking-tight text-[var(--primary)] sm:text-[0.95rem] md:text-lg",
  secondary:
    "max-w-full font-sinhala-display text-[0.72rem] font-medium leading-snug tracking-tight text-[var(--muted-foreground)] sm:text-[0.76rem] md:text-lg md:font-semibold md:text-[var(--primary)]",
  dash: "hidden shrink-0 font-sinhala-display text-lg font-semibold text-[var(--primary)] md:inline",
} as const;

const footer = {
  root: "inline-flex",
  text:
    "font-sinhala-display text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl",
} as const;

const body = {
  root: "inline-flex",
  text: "font-sinhala-display font-semibold text-[var(--foreground)]",
} as const;

const micro = {
  root: "inline-flex",
  text: "font-sinhala-display text-xs font-medium leading-snug text-[var(--foreground)]/90",
} as const;

function splitLockup(plain: string): { primary: string; secondary: string | null } {
  const sep = " - ";
  const i = plain.indexOf(sep);
  if (i === -1) return { primary: plain, secondary: null };
  return {
    primary: plain.slice(0, i),
    secondary: plain.slice(i + sep.length).trim() || null,
  };
}

export function SiteBrandLockup({ variant }: { variant: "header" | "footer" | "body" | "micro" }) {
  if (variant === "header") {
    const { primary, secondary } = splitLockup(SITE_BRAND_LOCKUP_PLAIN);
    return (
      <span className={header.root} title={SITE_BRAND_LOCKUP_PLAIN}>
        <span className={header.primary}>{primary}</span>
        {secondary ? (
          <>
            <span className={header.dash} aria-hidden>
              —
            </span>
            <span className={header.secondary}>{secondary}</span>
          </>
        ) : null}
      </span>
    );
  }

  if (variant === "footer") {
    return (
      <span className={footer.root} title={SITE_BRAND_LOCKUP_PLAIN}>
        <span className={footer.text}>{SITE_BRAND_LOCKUP_PLAIN}</span>
      </span>
    );
  }

  if (variant === "body") {
    return (
      <span className={body.root} title={SITE_BRAND_LOCKUP_PLAIN}>
        <span className={body.text}>{SITE_BRAND_LOCKUP_PLAIN}</span>
      </span>
    );
  }

  return (
    <span className={micro.root} title={SITE_BRAND_LOCKUP_PLAIN}>
      <span className={micro.text}>{SITE_BRAND_LOCKUP_PLAIN}</span>
    </span>
  );
}
