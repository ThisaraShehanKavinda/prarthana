import type { LearnTopicIconId } from "@/components/learn/learn-topic-card";
import { Layers2, Quote } from "lucide-react";
import { LearnShell } from "@/components/learn/learn-shell";
import { cancerTypes } from "@/lib/cancer-types";
import { LearnTopicCard } from "@/components/learn/learn-topic-card";
import { LearnHoverPanel } from "@/components/learn/learn-hover-panel";
import { FadeIn } from "@/components/motion/fade-in";
import { typesTaxonomy } from "@/content/learn-types-hub";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

function iconForTypeSlug(slug: string): LearnTopicIconId {
  const allowed: LearnTopicIconId[] = [
    "carcinoma",
    "sarcoma",
    "leukemia",
    "lymphoma",
    "cns",
    "childhood",
  ];
  return (allowed.includes(slug as LearnTopicIconId)
    ? slug
    : "carcinoma") as LearnTopicIconId;
}

export default function TypesIndexPage() {
  return (
    <LearnShell
      title="Categories of cancer"
      kicker="Histology, lineage, and how teams talk"
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/learn", label: "Learn" },
        { href: "/learn/types", label: "Types" },
      ]}
    >
      <FadeIn>
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/25 px-4 py-5 text-[var(--muted-foreground)] shadow-sm sm:px-5 sm:py-6">
          <p className="text-lg leading-relaxed">
            Oncologists classify cancers by{" "}
            <strong className="text-[var(--foreground)]">cell of origin</strong> and{" "}
            <strong className="text-[var(--foreground)]">lineage</strong>—because
            adenocarcinoma of the lung, squamous carcinoma of the lung, and small-cell
            carcinoma are treated differently even when imaging looks “like a lung
            mass.” Pathology, immunohistochemistry, and sometimes sequencing turn a
            biopsy into a map for staging workup and therapy.
          </p>
          <blockquote className="flex gap-3 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/[0.06] px-4 py-3 text-[var(--foreground)]/95">
            <Quote className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" aria-hidden />
            <p className="text-sm font-medium leading-relaxed sm:text-base">
              “Metastatic” describes spread, not the cell type—liver lesions from colon
              cancer are still colorectal adenocarcinoma under the microscope.
            </p>
          </blockquote>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <LearnHoverPanel className="p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
            <Layers2 className="h-5 w-5 text-[var(--primary)]" aria-hidden />
            Taxonomy primer — tap to unpack
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            Before you open a category card, these notes explain why the same organ
            can host different cancer families—and why metastatic workup still asks
            “where did this start?”
          </p>
          <Accordion type="single" collapsible className="mt-4 w-full">
            {typesTaxonomy.map((item) => (
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

      <FadeIn delay={0.08}>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Choose a category — each opens a deeper page
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
          Cards lift on hover; inside each module you will find interactive sections
          plus the core explainer for that family of cancers.
        </p>
      </FadeIn>

      <div className="grid gap-5 sm:grid-cols-2">
        {cancerTypes.map((c, i) => (
          <FadeIn key={c.slug} delay={0.04 * i + 0.1}>
            <LearnTopicCard
              href={`/learn/types/${c.slug}`}
              title={c.title}
              description={c.short}
              icon={iconForTypeSlug(c.slug)}
              accentIndex={i}
            />
          </FadeIn>
        ))}
      </div>
    </LearnShell>
  );
}
