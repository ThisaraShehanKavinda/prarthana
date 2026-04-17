import Link from "next/link";
import { BookMarked, Pill } from "lucide-react";
import { LearnShell } from "@/components/learn/learn-shell";
import { LearnHoverPanel } from "@/components/learn/learn-hover-panel";
import { FadeIn } from "@/components/motion/fade-in";
import { medicineClassesRich, medicineConcepts } from "@/content/learn-medicines";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function MedicinesPage() {
  return (
    <LearnShell
      title="Medicines for cancer (educational)"
      kicker="Mechanistic classes — not dosing advice"
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/learn", label: "Learn" },
        { href: "/learn/medicines", label: "Medicines" },
      ]}
    >
      <FadeIn>
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/25 px-4 py-5 text-[var(--muted-foreground)] shadow-sm sm:px-5 sm:py-6">
          <p className="text-lg leading-relaxed">
            This page explains cancer medicine groups in simple terms, so consent forms
            and pharmacy advice are easier to understand. It is educational and does not
            provide personal dosing advice.
          </p>
          <p className="text-sm leading-relaxed sm:text-base">
            Always cross-check lay summaries with the medication guide your team
            provides—drug names and availability differ by country.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <LearnHoverPanel className="p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
            <Pill className="h-5 w-5 text-[var(--primary)]" aria-hidden />
            Pharmacology concepts — interactive
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            These topics explain why the same medicine can affect people differently
            and why drug-interaction checks are important.
          </p>
          <Accordion type="single" collapsible className="mt-4 w-full">
            {medicineConcepts.map((item) => (
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

      <Separator className="bg-[var(--border)]" />

      <FadeIn delay={0.07}>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Major drug classes</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
          Icons mark each family; read mechanism first, then bullets, then the caution
          strip at the bottom of each card.
        </p>
      </FadeIn>

      <div className="space-y-5">
        {medicineClassesRich.map((c, i) => {
          const ClassIcon = c.icon;
          return (
            <FadeIn key={c.title} delay={0.04 * i + 0.09}>
              <LearnHoverPanel className="overflow-hidden p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/12 text-[var(--primary)] ring-1 ring-[var(--primary)]/20">
                    <ClassIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">{c.title}</h3>
                    <p className="text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
                      <span className="font-medium text-[var(--foreground)]/90">Mechanism: </span>
                      {c.mechanism}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] sm:text-sm">{c.examplesNote}</p>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--muted-foreground)] marker:text-[var(--primary)]/70 sm:text-base">
                      {c.bullets.map((p, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {p}
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-sm text-[var(--foreground)]/95">
                      <strong className="text-amber-950 dark:text-amber-100">Caution: </strong>
                      {c.cautions.join(" ")}
                    </div>
                  </div>
                </div>
              </LearnHoverPanel>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.12}>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 px-4 py-5 sm:px-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
            <BookMarked className="h-5 w-5 text-[var(--primary)]" aria-hidden />
            Patient-facing references
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
            Start with the{" "}
            <a
              className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/40 underline-offset-2 hover:decoration-[var(--primary)]"
              href="https://www.cancer.gov/about-cancer/treatment/types"
              target="_blank"
              rel="noreferrer"
            >
              NCI overview of cancer treatment types
            </a>
            , then explore{" "}
            <Link
              href="/learn/treatments"
              className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/40 underline-offset-2 hover:decoration-[var(--primary)]"
            >
              How treatments work
            </Link>{" "}
            on this site for modality-level context.
          </p>
        </div>
      </FadeIn>
    </LearnShell>
  );
}
