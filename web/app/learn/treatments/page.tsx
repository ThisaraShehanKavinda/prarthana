import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/motion/fade-in";
import { LearnShell } from "@/components/learn/learn-shell";
import { LearnHoverPanel } from "@/components/learn/learn-hover-panel";
import { TreatmentMixBar } from "@/components/charts/treatment-mix-chart";
import { getSiteStats } from "@/lib/stats";
import { treatmentCrossCutting, treatmentModalitiesRich } from "@/content/learn-treatments";
import { Stethoscope, UsersRound } from "lucide-react";

export default function TreatmentsPage() {
  const stats = getSiteStats();

  return (
    <LearnShell
      title="How treatments work"
      kicker="Mechanisms, delivery, and multidisciplinary intent"
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/learn", label: "Learn" },
        { href: "/learn/treatments", label: "Treatments" },
      ]}
    >
      <FadeIn>
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/25 px-4 py-5 text-[var(--muted-foreground)] shadow-sm sm:px-5 sm:py-6">
          <p className="text-lg leading-relaxed">
            Modern oncology mixes{" "}
            <strong className="text-[var(--foreground)]">local therapies</strong>{" "}
            (surgery, radiation) with{" "}
            <strong className="text-[var(--foreground)]">systemic therapies</strong>{" "}
            (chemotherapy, targeted drugs, immunotherapy, endocrine therapy, cellular
            products). The sequence—neoadjuvant, definitive, adjuvant, maintenance, or
            palliative—depends on tumor biology, stage, biomarkers, organ function, and
            patient goals. Nothing here replaces your multidisciplinary note.
          </p>
          <p className="text-sm leading-relaxed sm:text-base">
            The chart below is an{" "}
            <strong className="text-[var(--foreground)]">illustrative</strong> mix of
            how teams think about care pathways for education—not your personal plan.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <LearnHoverPanel className="overflow-hidden p-4">
          <TreatmentMixBar data={stats.treatmentMixIllustrative} />
        </LearnHoverPanel>
      </FadeIn>

      <FadeIn delay={0.07}>
        <LearnHoverPanel className="p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
            <UsersRound className="h-5 w-5 text-[var(--primary)]" aria-hidden />
            Cross-cutting oncology concepts — tap to explore
          </h2>
          <Accordion type="single" collapsible className="mt-4 w-full">
            {treatmentCrossCutting.map((item) => (
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

      <FadeIn delay={0.09}>
        <h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--foreground)]">
          <Stethoscope className="h-6 w-6 text-[var(--primary)]" aria-hidden />
          Modalities in depth
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
          Each card summarizes mechanism, typical technical angles, and lived-experience
          notes patients often discuss with nurses or navigators.
        </p>
      </FadeIn>

      <div className="space-y-5">
        {treatmentModalitiesRich.map((m, i) => {
          const ModIcon = m.icon;
          return (
            <FadeIn key={m.name} delay={0.04 * i + 0.1}>
              <LearnHoverPanel className="overflow-hidden bg-[var(--muted)]/35 p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/12 text-[var(--primary)] ring-1 ring-[var(--primary)]/20">
                    <ModIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">{m.name}</h3>
                    <p className="leading-relaxed text-[var(--muted-foreground)]">{m.summary}</p>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--muted-foreground)] marker:text-[var(--primary)]/70 sm:text-base">
                      {m.bullets.map((b, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Accordion type="single" collapsible className="border-t border-[var(--border)] pt-3">
                      <AccordionItem value={`${m.name}-living`} className="border-none">
                        <AccordionTrigger className="py-2 text-left text-sm font-semibold text-[var(--foreground)] hover:no-underline">
                          Living with this modality — practical notes
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--muted-foreground)] marker:text-[var(--primary)]/70">
                            {m.patientNotes.map((n, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {n}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </LearnHoverPanel>
            </FadeIn>
          );
        })}
      </div>
    </LearnShell>
  );
}
