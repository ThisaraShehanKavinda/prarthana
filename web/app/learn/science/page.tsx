import Link from "next/link";
import { Dna, Layers, Microscope, Quote, Target } from "lucide-react";
import { LearnShell } from "@/components/learn/learn-shell";
import { LearnHoverPanel } from "@/components/learn/learn-hover-panel";
import { FadeIn } from "@/components/motion/fade-in";
import { scienceDeepDive, scienceModulesRich } from "@/content/learn-science";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function SciencePage() {
  return (
    <LearnShell
      title="Science inside cancer"
      kicker="From DNA repair to clinical biomarkers"
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/learn", label: "Learn" },
        { href: "/learn/science", label: "Science" },
      ]}
    >
      <FadeIn>
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/25 px-4 py-5 text-[var(--muted-foreground)] shadow-sm sm:px-5 sm:py-6">
          <p className="text-lg leading-relaxed">
            This section explains key cancer science in plain language: DNA changes,
            staging, biomarkers, and how treatments connect to biology.
          </p>
          <blockquote className="flex gap-3 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/[0.06] px-4 py-3 text-[var(--foreground)]/95">
            <Quote className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" aria-hidden />
            <p className="text-sm font-medium leading-relaxed sm:text-base">
              Simplification is not the enemy—false certainty is. Where concepts branch,
              we point you to primary literature instead of pretending one paragraph
              closes the debate.
            </p>
          </blockquote>
        </div>
      </FadeIn>

      <div className="grid gap-5 md:grid-cols-2">
        {scienceModulesRich.map((m, i) => {
          const ModuleIcon =
            m.id === "dna"
              ? Dna
              : m.id === "hallmarks"
                ? Layers
                : m.id === "staging"
                  ? Microscope
                  : Target;
          return (
          <FadeIn key={m.id} delay={0.04 * i + 0.05}>
            <LearnHoverPanel className="h-full overflow-hidden p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/12 text-[var(--primary)] ring-1 ring-[var(--primary)]/20">
                  <ModuleIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold leading-snug text-[var(--foreground)]">
                    {m.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
                    {m.lead}
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-[var(--muted-foreground)] marker:text-[var(--primary)]/70 sm:text-base">
                    {m.bullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </LearnHoverPanel>
          </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.12}>
        <LearnHoverPanel className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Deeper mechanisms — tap to read
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            These topics add context behind trial headlines and new treatment news.
          </p>
          <Accordion type="single" collapsible className="mt-4 w-full">
            {scienceDeepDive.map((item) => (
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

      <FadeIn delay={0.14}>
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
          Landmark review:{" "}
          <a
            className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/40 underline-offset-2 hover:decoration-[var(--primary)]"
            href="https://www.nature.com/articles/nature08416"
            target="_blank"
            rel="noreferrer"
          >
            Hanahan & Weinberg — Hallmarks of Cancer
          </a>
          . For treatment mapping, continue to{" "}
          <Link
            href="/learn/treatments"
            className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/40 underline-offset-2 hover:decoration-[var(--primary)]"
          >
            Treatments
          </Link>{" "}
          and{" "}
          <Link
            href="/learn/medicines"
            className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/40 underline-offset-2 hover:decoration-[var(--primary)]"
          >
            Medicines
          </Link>
          .
        </p>
      </FadeIn>
    </LearnShell>
  );
}
