import { SITE_BRAND_LOCKUP_PLAIN, SITE_DISPLAY_NAME, SITE_DISPLAY_NAME_EN } from "@/lib/site-brand";

const variants = {
  header: {
    root: "inline-flex min-w-0 max-w-[14rem] flex-wrap items-baseline gap-x-1 sm:max-w-[22rem]",
    sinhala:
      "font-sinhala-display text-[0.95rem] font-semibold leading-tight tracking-tight text-[var(--primary)] sm:text-lg",
    english: "text-[11px] font-semibold tracking-tight text-[var(--foreground)]/75 sm:text-sm",
  },
  footer: {
    root: "inline-flex flex-wrap items-baseline gap-x-1.5",
    sinhala:
      "font-sinhala-display text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl",
    english:
      "text-base font-semibold tracking-tight text-[var(--muted-foreground)] sm:text-lg",
  },
  body: {
    root: "inline-flex flex-wrap items-baseline gap-x-1",
    sinhala: "font-sinhala-display font-semibold text-[var(--foreground)]",
    english: "font-medium text-[var(--foreground)]/80",
  },
  micro: {
    root: "inline-flex flex-wrap items-baseline gap-x-1",
    sinhala:
      "font-sinhala-display text-xs font-medium leading-snug text-[var(--foreground)]/90",
    english: "text-[10px] font-medium text-[var(--foreground)]/75",
  },
} as const;

export function SiteBrandLockup({ variant }: { variant: keyof typeof variants }) {
  const v = variants[variant];
  return (
    <span className={v.root} title={SITE_BRAND_LOCKUP_PLAIN}>
      <span lang="si" className={v.sinhala}>
        {SITE_DISPLAY_NAME}
      </span>
      <span lang="en" className={v.english}>
        ({SITE_DISPLAY_NAME_EN})
      </span>
    </span>
  );
}
