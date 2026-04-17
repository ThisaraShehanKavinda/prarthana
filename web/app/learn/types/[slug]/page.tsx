import { notFound } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cancerTypes } from "@/lib/cancer-types";
import { LearnShell } from "@/components/learn/learn-shell";
import { LearnHoverPanel } from "@/components/learn/learn-hover-panel";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { getTypeExtra } from "@/content/learn-type-extras";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export function generateStaticParams() {
  return cancerTypes.map((c) => ({ slug: c.slug }));
}

export default async function TypeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = cancerTypes.find((x) => x.slug === slug);
  if (!c) notFound();

  const extra = getTypeExtra(slug);

  return (
    <LearnShell
      title={c.title}
      kicker="Deep dive"
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/learn", label: "Learn" },
        { href: "/learn/types", label: "Types" },
        { href: `/learn/types/${c.slug}`, label: c.title },
      ]}
    >
      <FadeIn>
        <p className="text-lg leading-relaxed text-[var(--muted-foreground)]">{c.short}</p>
        {extra && (
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            {extra.introHook}
          </p>
        )}
      </FadeIn>

      <FadeIn delay={0.04}>
        <div className="flex flex-wrap gap-2">
          <Badge variant="accent">Mechanism</Badge>
          <Badge variant="secondary">Risk factors</Badge>
          {c.screening && <Badge>Screening</Badge>}
        </div>
      </FadeIn>

      {extra && (
        <FadeIn delay={0.06}>
          <LearnHoverPanel className="p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
              <Sparkles className="h-5 w-5 text-[var(--primary)]" aria-hidden />
              Explore further — tap a topic
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
              These short notes explain common questions for this cancer family in plain language.
            </p>
            <Accordion type="single" collapsible className="mt-4 w-full">
              {extra.accordion.map((item) => (
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
      )}

      <Separator className="bg-[var(--border)]" />

      <FadeIn delay={0.08}>
        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">How it affects the body</h2>
          <p className="mt-2 leading-relaxed text-[var(--muted-foreground)]">{c.howItAffects}</p>
        </section>
      </FadeIn>

      <FadeIn delay={0.1}>
        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Reasons and risk context</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-[var(--muted-foreground)] marker:text-[var(--primary)]/70">
            {c.reasons.map((r) => (
              <li key={r} className="leading-relaxed">
                {r}
              </li>
            ))}
          </ul>
        </section>
      </FadeIn>

      {c.screening && (
        <FadeIn delay={0.12}>
          <LearnHoverPanel className="p-5">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Screening & prevention notes
            </h2>
            <p className="mt-2 leading-relaxed text-[var(--muted-foreground)]">{c.screening}</p>
          </LearnHoverPanel>
        </FadeIn>
      )}

      <FadeIn delay={0.14}>
        <p>
          <Link
            href="/learn/types"
            className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/40 underline-offset-2 hover:decoration-[var(--primary)]"
          >
            ← All categories
          </Link>
        </p>
      </FadeIn>
    </LearnShell>
  );
}
