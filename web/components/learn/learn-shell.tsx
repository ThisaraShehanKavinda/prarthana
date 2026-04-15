import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function LearnShell({
  title,
  kicker,
  children,
  crumbs,
}: {
  title: string;
  kicker?: string;
  children: React.ReactNode;
  crumbs?: { href: string; label: string }[];
}) {
  return (
    <div className="relative mx-auto max-w-3xl px-3 py-8 sm:px-6 sm:py-12 lg:max-w-4xl lg:px-8">
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-gradient-to-b from-[var(--primary)]/[0.07] to-transparent blur-2xl"
        aria-hidden
      />
      {crumbs && crumbs.length > 0 && (
        <nav
          className="relative mb-8 flex flex-wrap items-center gap-1.5 text-sm text-[var(--muted-foreground)]"
          aria-label="Breadcrumb"
        >
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]/60"
                  aria-hidden
                />
              )}
              <Link
                href={c.href}
                className={
                  i === 0
                    ? "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors hover:bg-[var(--muted)]/50 hover:text-[var(--primary)] active:scale-[0.98]"
                    : "rounded-full px-2.5 py-1 transition-colors hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)] active:scale-[0.98]"
                }
                {...(i === crumbs.length - 1 ? { "aria-current": "page" } : {})}
              >
                {i === 0 ? (
                  <>
                    <Home className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>{c.label}</span>
                  </>
                ) : (
                  c.label
                )}
              </Link>
            </span>
          ))}
        </nav>
      )}
      {kicker && (
        <p className="relative mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
          {kicker}
        </p>
      )}
      <h1 className="relative mb-6 text-4xl font-bold tracking-tight text-[var(--foreground)]">
        {title}
        <span
          className="mt-4 block h-1 w-20 rounded-full bg-gradient-to-r from-[var(--primary)] via-[var(--primary)]/70 to-transparent"
          aria-hidden
        />
      </h1>
      <div className="relative space-y-8 text-[var(--foreground)]/90">{children}</div>
    </div>
  );
}
