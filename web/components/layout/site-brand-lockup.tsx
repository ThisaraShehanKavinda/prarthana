import { SITE_BRAND_LOCKUP_PLAIN } from "@/lib/site-brand";

const variants = {
  header: {
    root: "inline-flex min-w-0 max-w-[16rem] sm:max-w-[24rem]",
    text:
      "font-sinhala-display text-[0.95rem] font-semibold leading-tight tracking-tight text-[var(--primary)] sm:text-lg",
  },
  footer: {
    root: "inline-flex",
    text:
      "font-sinhala-display text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl",
  },
  body: {
    root: "inline-flex",
    text: "font-sinhala-display font-semibold text-[var(--foreground)]",
  },
  micro: {
    root: "inline-flex",
    text: "font-sinhala-display text-xs font-medium leading-snug text-[var(--foreground)]/90",
  },
} as const;

export function SiteBrandLockup({ variant }: { variant: keyof typeof variants }) {
  const v = variants[variant];
  return (
    <span className={v.root} title={SITE_BRAND_LOCKUP_PLAIN}>
      <span className={v.text}>{SITE_BRAND_LOCKUP_PLAIN}</span>
    </span>
  );
}
