import Link from "next/link";
import { Globe2, Quote } from "lucide-react";
import { LearnShell } from "@/components/learn/learn-shell";
import { LearnHoverPanel } from "@/components/learn/learn-hover-panel";
import { BurdenPie } from "@/components/charts/burden-chart";
import { getSiteStats } from "@/lib/stats";
import { FadeIn } from "@/components/motion/fade-in";
import { burdenDeepDive, burdenTrustedLinks } from "@/content/learn-burden";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function BurdenPage() {
  const stats = getSiteStats();
  const pieData = [
    { name: "Cancer deaths (illustr.)", value: stats.globalBurden.shareOfAllDeathsPercent },
    {
      name: "Other causes (illustr.)",
      value: 100 - stats.globalBurden.shareOfAllDeathsPercent,
    },
  ];

  return (
    <LearnShell
      title="Global cancer burden"
      kicker="Population health & data literacy"
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/learn", label: "Learn" },
        { href: "/learn/burden", label: "Burden" },
      ]}
    >
      <FadeIn>
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/25 px-4 py-5 text-[var(--muted-foreground)] shadow-sm sm:px-5 sm:py-6">
          <p className="text-lg leading-relaxed">
            Cancer is a major global health problem. To understand it clearly, health
            reports track{" "}
            <strong className="text-[var(--foreground)]">incidence</strong> (new cases)
            , <strong className="text-[var(--foreground)]">mortality</strong> (deaths),
            and other burden measures. These numbers help countries plan prevention,
            screening, vaccination, and treatment services.
          </p>
          <blockquote className="flex gap-3 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/[0.06] px-4 py-3 text-[var(--foreground)]/95">
            <Quote className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" aria-hidden />
            <p className="text-sm font-medium leading-relaxed sm:text-base">
              A scary headline without year, region, and age adjustment tells you more
              about the publisher than about your personal risk.
            </p>
          </blockquote>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <LearnHoverPanel className="p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
            <Globe2 className="h-5 w-5 text-[var(--primary)]" aria-hidden />
            Go deeper: how demographers think about burden
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            Open each topic for simple explanations of incidence, mortality, and survival.
            Use this page to learn concepts, not to predict personal risk.
          </p>
          <Accordion type="single" collapsible className="mt-4 w-full">
            {burdenDeepDive.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-left text-[var(--foreground)] hover:no-underline">
                  <span className="font-semibold">{item.title}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-[var(--muted-foreground)]">
                    {item.body.map((p, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </LearnHoverPanel>
      </FadeIn>

      <FadeIn delay={0.08}>
        <LearnHoverPanel className="p-5 sm:p-6">
          <p className="text-sm text-[var(--muted-foreground)]">
            Last content refresh: <strong className="text-[var(--foreground)]">{stats.lastUpdated}</strong>.{" "}
            {stats.sourcesNote}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {burdenTrustedLinks.map((l) => (
              <li key={l.href} className="leading-relaxed text-[var(--muted-foreground)]">
                <a
                  className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/40 underline-offset-2 hover:decoration-[var(--primary)]"
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.label}
                </a>
                <span> — {l.hint}</span>
              </li>
            ))}
          </ul>
        </LearnHoverPanel>
      </FadeIn>

      <Separator className="bg-[var(--border)]" />

      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <FadeIn delay={0.1}>
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            Headline numbers (illustrative)
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            This pie chart is simplified for learning. For formal use, check your
            national cancer registry data. Hover segments to see values.
          </p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-[var(--border)] py-2">
              <dt>New cases / year (rounded)</dt>
              <dd className="font-semibold text-[var(--foreground)]">
                ~{stats.globalBurden.newCasesPerYearMillions} million
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[var(--border)] py-2">
              <dt>Deaths / year (rounded)</dt>
              <dd className="font-semibold text-[var(--foreground)]">
                ~{stats.globalBurden.deathsPerYearMillions} million
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt>Leading cause rank (contextual)</dt>
              <dd className="font-semibold text-[var(--foreground)]">
                ~#{stats.globalBurden.leadingCauseRank}
              </dd>
            </div>
          </dl>
        </FadeIn>
        <FadeIn delay={0.12}>
          <LearnHoverPanel className="p-4">
            <BurdenPie data={pieData} />
          </LearnHoverPanel>
        </FadeIn>
      </div>

      <FadeIn delay={0.14}>
        <p className="text-sm text-[var(--muted-foreground)]">
          Continue to{" "}
          <Link
            className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/40 underline-offset-2 hover:decoration-[var(--primary)]"
            href="/learn/age"
          >
            age patterns
          </Link>{" "}
          or{" "}
          <Link
            className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/40 underline-offset-2 hover:decoration-[var(--primary)]"
            href="/learn/types"
          >
            cancer categories
          </Link>
          .
        </p>
      </FadeIn>
    </LearnShell>
  );
}
