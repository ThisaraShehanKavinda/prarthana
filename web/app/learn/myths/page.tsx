import Link from "next/link";
import { BookOpen, Quote, ShieldQuestion } from "lucide-react";
import { LearnShell } from "@/components/learn/learn-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn } from "@/components/motion/fade-in";
import { LearnHoverPanel } from "@/components/learn/learn-hover-panel";
import { learnMythsExpanded } from "@/content/learn-myths-expanded";
import { Separator } from "@/components/ui/separator";

export default function MythsPage() {
  return (
    <LearnShell
      title="Myths vs facts"
      kicker="Evidence first — curiosity welcome"
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/learn", label: "Learn" },
        { href: "/learn/myths", label: "Myths" },
      ]}
    >
      <FadeIn>
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/25 px-4 py-5 text-[var(--muted-foreground)] shadow-sm sm:px-5 sm:py-6">
          <p className="text-lg leading-relaxed">
            Misinformation spreads fastest when people are scared, sleep-deprived, or
            navigating paywalls to real oncology visits. This page collects{" "}
            <strong className="text-[var(--foreground)]">common viral claims</strong>{" "}
            and pairs each with a concise, evidence-aligned rebuttal plus a link to a
            government agency, cancer institute, or major journal review—not random
            blogs.
          </p>
          <blockquote className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[var(--foreground)]/95">
            <Quote className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
            <p className="text-sm font-medium leading-relaxed sm:text-base">
              If a cure were proven in secret, every ethical oncologist on earth would
              celebrate—it is not hidden in a detox tea disclaimer.
            </p>
          </blockquote>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <LearnHoverPanel className="p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
            <ShieldQuestion className="h-5 w-5 text-[var(--primary)]" aria-hidden />
            Tap a myth to reveal the fact pattern
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            Accordions keep the page scannable: open the myths that match what you
            heard in a chat group, then follow the outbound link for depth.
          </p>
        </LearnHoverPanel>
      </FadeIn>

      <FadeIn delay={0.06}>
        <Accordion type="single" collapsible className="w-full">
          {learnMythsExpanded.map((m, i) => {
            const MythIcon = m.icon;
            return (
              <AccordionItem key={`myth-${i}`} value={`item-${i}`}>
                <AccordionTrigger className="group text-left text-[var(--foreground)] hover:no-underline">
                  <span className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/15 transition-transform duration-200 group-data-[state=open]:scale-105">
                      <MythIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="min-w-0 text-base font-semibold leading-snug">
                      {m.myth}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3 leading-relaxed text-[var(--foreground)]/90">{m.fact}</p>
                  <a
                    href={m.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-[var(--primary)] underline decoration-[var(--primary)]/40 underline-offset-2 transition-colors hover:decoration-[var(--primary)]"
                  >
                    Read more from a trusted source →
                  </a>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </FadeIn>

      <Separator className="bg-[var(--border)]" />

      <FadeIn delay={0.1}>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 px-4 py-5 sm:px-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
            <BookOpen className="h-5 w-5 text-[var(--primary)]" aria-hidden />
            Related on this site
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
            Nutrition scare-stories often overlap with cancer myths. For a full module
            on eating through treatment (including sugar in context), visit{" "}
            <Link
              href="/learn/nutrition"
              className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/40 underline-offset-2 hover:decoration-[var(--primary)]"
            >
              Nutrition spotlight
            </Link>
            .
          </p>
        </div>
      </FadeIn>
    </LearnShell>
  );
}
