import Link from "next/link";
import { ClubPartnerLogos } from "@/components/layout/club-partner-logos";
import { SiteBrandLockup } from "@/components/layout/site-brand-lockup";
import { SITE_BRAND_LOCKUP_PLAIN } from "@/lib/site-brand";

const learn = [
  { href: "/learn/burden", label: "Global burden" },
  { href: "/learn/age", label: "Age & risk" },
  { href: "/learn/types", label: "Cancer types" },
  { href: "/learn/myths", label: "Myths vs facts" },
  { href: "/learn/treatments", label: "Treatments" },
  { href: "/learn/medicines", label: "Medicines" },
  { href: "/learn/nutrition", label: "Nutrition" },
  { href: "/learn/science", label: "Science hub" },
];

const reportSubject = encodeURIComponent(`${SITE_BRAND_LOCKUP_PLAIN} — content report`);

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--muted)]/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <div className="max-w-md space-y-3">
          <p className="text-[var(--foreground)]">
            <SiteBrandLockup variant="footer" />
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">
            A modern learning space for cancer literacy, evidence-based context,
            and respectful community stories—backed by transparent sources.
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            Community posts are user-generated. Editors may review posts before they
            appear publicly.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 min-[420px]:grid-cols-2 sm:grid-cols-3">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Learn
            </p>
            <ul className="space-y-2 text-sm">
              {learn.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[var(--foreground)]/80 hover:text-[var(--primary)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Community
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/community"
                  className="text-[var(--foreground)]/80 hover:text-[var(--primary)]"
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/community/new"
                  className="text-[var(--foreground)]/80 hover:text-[var(--primary)]"
                >
                  Create post
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              More
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-[var(--foreground)]/80 hover:text-[var(--primary)]"
                  href={`mailto:hello@example.com?subject=${reportSubject}`}
                >
                  Report content
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <ClubPartnerLogos />
      </div>
      <div className="border-t border-[var(--border)] py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-xs text-[var(--muted-foreground)]">
        <SiteBrandLockup variant="micro" />
        {" · "}
        <span>© {new Date().getFullYear()}</span>
        {" · "}
        <span>Built with Next.js</span>
      </div>
    </footer>
  );
}
