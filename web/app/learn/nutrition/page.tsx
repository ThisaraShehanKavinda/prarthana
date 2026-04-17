import Image from "next/image";
import Link from "next/link";
import {
  Apple,
  BookOpen,
  Droplets,
  Egg,
  Quote,
  Shield,
} from "lucide-react";
import { siteImages } from "@/content/site-images";
import {
  nutritionPillars,
  nutritionTrustedLinks,
  nutritionWhenEatingIsHard,
} from "@/content/learn-nutrition";
import { LearnShell } from "@/components/learn/learn-shell";
import { LearnHoverPanel } from "@/components/learn/learn-hover-panel";
import { FadeIn } from "@/components/motion/fade-in";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function NutritionPage() {
  return (
    <LearnShell
      title="Food through cancer treatment"
      kicker="Strength, safety, science—and Sri Lankan context"
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/learn", label: "Learn" },
        { href: "/learn/nutrition", label: "Nutrition" },
      ]}
    >
      <FadeIn>
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/25 px-4 py-5 text-[var(--muted-foreground)] shadow-sm sm:px-5 sm:py-6">
          <p className="text-lg leading-relaxed">
            Treatment can change appetite, taste, bowel habits, and body strength.{" "}
            <strong className="text-[var(--foreground)]">
              Food does not replace cancer treatment
            </strong>
            , but good nutrition can help people tolerate treatment better and recover
            faster.
          </p>
          <p className="leading-relaxed">
            Major cancer centers and guidelines (including work summarized by the{" "}
            <a
              className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/35 underline-offset-2 hover:decoration-[var(--primary)]"
              href="https://www.cancer.gov/about-cancer/treatment/side-effects/nutrition"
              target="_blank"
              rel="noreferrer"
            >
              U.S. National Cancer Institute
            </a>{" "}
            and the{" "}
            <a
              className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/35 underline-offset-2 hover:decoration-[var(--primary)]"
              href="https://www.cancer.org/cancer/survivorship/coping/nutrition.html"
              target="_blank"
              rel="noreferrer"
            >
              American Cancer Society
            </a>
            ) emphasize{" "}
            <strong className="text-[var(--foreground)]">
              enough calories and protein, symptom control, and food safety
            </strong>{" "}
            instead of strict diet rules that are hard to follow during treatment.
          </p>
          <blockquote className="flex gap-3 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/[0.06] px-4 py-3 text-[var(--foreground)]/95">
            <Quote
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]"
              aria-hidden
            />
            <p className="text-sm font-medium leading-relaxed sm:text-base">
              The goal is not a perfect diet chart—it is preserving strength, reducing
              infection risk from unsafe food, and catching weight or muscle loss early
              enough to intervene.
            </p>
          </blockquote>
        </div>
      </FadeIn>

      <FadeIn delay={0.04}>
        <LearnHoverPanel className="p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            When eating feels impossible
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            Side effects are common and manageable. Use these tips to discuss your
            own plan with your care team.
          </p>
          <Accordion type="single" collapsible className="mt-4 w-full">
            {nutritionWhenEatingIsHard.map((item) => (
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

      <FadeIn delay={0.06}>
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Three pillars teams actually measure
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            Across major cancer nutrition guidance (for example summaries aligned with{" "}
            <a
              className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/35 underline-offset-2 hover:decoration-[var(--primary)]"
              href="https://www.espen.org/"
              target="_blank"
              rel="noreferrer"
            >
              ESPEN
            </a>{" "}
            guidance), the same themes appear again and again: protect muscle, keep
            fluid/electrolyte balance, and reduce food infection risk when immunity is low.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {nutritionPillars.map((pillar, i) => {
              const Icon = [Egg, Droplets, Shield][i] ?? Egg;
              return (
                <Card
                  key={pillar.title}
                  className="border-[var(--border)] bg-[var(--card)]/80"
                >
                  <CardHeader className="space-y-2 pb-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/15">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <CardTitle className="text-lg leading-snug">{pillar.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
                    <p className="leading-relaxed">{pillar.summary}</p>
                    <ul className="list-disc space-y-2 pl-4 marker:text-[var(--primary)]/70">
                      {pillar.bullets.map((b, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </FadeIn>

      <Separator className="bg-[var(--border)]" />

      <FadeIn delay={0.08}>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Sri Lankan table, global evidence
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
          Familiar foods can help people keep eating. What matters most is whether the
          portion, texture, and hygiene are safe for your symptoms and treatment phase.
        </p>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-2">
        <FadeIn delay={0.1}>
          <LearnHoverPanel className="overflow-hidden">
            <Card className="border-0 bg-transparent shadow-none">
              <div className="relative aspect-video w-full overflow-hidden bg-[var(--muted)]">
                <Image
                  src={siteImages.nutritionKingCoconut}
                  alt="King coconut (Wikimedia Commons)"
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 480px, 100vw"
                  unoptimized
                />
              </div>
              <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-700 ring-1 ring-sky-500/25 dark:text-sky-300">
                  <Droplets className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <CardTitle className="text-xl leading-snug">
                  King coconut (thambili,{" "}
                  <span className="font-normal italic">Cocos nucifera</span>)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
                <p>
                  The clear fluid is naturally rich in potassium and contains modest
                  sodium and magnesium—closer in spirit to a mild electrolyte beverage
                  than to plain bottled water. That is why some clinicians suggest it
                  when oral rehydration is needed and{" "}
                  <strong className="text-[var(--foreground)]/90">
                    blood sugar control allows
                  </strong>
                  : the same natural sugars that make it palatable can spike glucose if
                  diabetes or high‑dose steroids are in play.
                </p>
                <p>
                  Compared with sweetened soft drinks, king coconut delivers fluid plus
                  minerals without artificial colors—but{" "}
                  <strong className="text-[var(--foreground)]/90">
                    it is not identical to WHO oral rehydration salts
                  </strong>
                  , which use a specific glucose‑to‑sodium ratio for acute diarrheal
                  losses. Use clinician‑directed ORS when dehydration is significant.
                </p>
                <p>
                  Practical tip: chill lightly if cold soothes nausea; sip through a
                  straw if metallic taste bothers you. Always discard nuts that smell
                  fermented—food safety still applies.
                </p>
              </CardContent>
            </Card>
          </LearnHoverPanel>
        </FadeIn>
        <FadeIn delay={0.12}>
          <LearnHoverPanel className="overflow-hidden">
            <Card className="border-0 bg-transparent shadow-none">
              <div className="relative aspect-video w-full overflow-hidden bg-[var(--muted)]">
                <Image
                  src={siteImages.nutritionDelum}
                  alt="Pomegranate, delum (Wikimedia Commons)"
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 480px, 100vw"
                  unoptimized
                />
              </div>
              <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-800 ring-1 ring-rose-500/25 dark:text-rose-300">
                  <Apple className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <CardTitle className="text-xl leading-snug">
                  Delum — pomegranate (<span className="font-normal italic">Punica granatum</span>)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
                <p>
                  Pomegranate arils deliver fiber, vitamin C, and a dense mix of
                  polyphenols (including punicalagin and ellagic acid derivatives). Cell
                  and animal studies are fascinating; human cancer trials are smaller and
                  heterogeneous, so{" "}
                  <strong className="text-[var(--foreground)]/90">
                    no guideline lists pomegranate as a treatment
                  </strong>
                  . What is solid: as part of a varied plant‑forward diet, it supports
                  fiber intake and culinary enjoyment—important when pleasure drives
                  intake.
                </p>
                <p>
                  Concentrated juice can interact with enzymes that metabolize certain
                  prescription drugs (notably some statins and immunosuppressants). If
                  you drink pomegranate juice daily,{" "}
                  <strong className="text-[var(--foreground)]/90">
                    mention it at pharmacy review
                  </strong>
                  —the issue is drug concentration, not “natural versus synthetic.”
                </p>
                <p>
                  For mouth sensitivity, try chilled arils blended into yogurt or
                  curd‑based smoothies rather than sharp acidic dressings; seeds can be
                  sieved if texture triggers coughing.
                </p>
              </CardContent>
            </Card>
          </LearnHoverPanel>
        </FadeIn>
      </div>

      <FadeIn delay={0.14}>
        <LearnHoverPanel className="p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--foreground)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-green)]/25 text-[var(--foreground)]">
              <BookOpen className="h-4 w-4" aria-hidden />
            </span>
            Patterns research tends to reward
          </h2>
          <ul className="mt-4 list-disc space-y-2.5 pl-5 text-[var(--muted-foreground)] marker:text-[var(--primary)]/70">
            <li>
              <strong className="text-[var(--foreground)]/90">Protein spread through the day</strong>{" "}
              with legumes, fish, egg, dairy, or fortified plant alternatives—especially
              if appetite is low.
            </li>
            <li>
              <strong className="text-[var(--foreground)]/90">Color diversity</strong>{" "}
              (greens, pumpkin, beetroot, papaya, gotukola, brinjal) for micronutrients
              and fiber—not because each color “fights cancer,” but because variety
              hedges against gaps when preferences narrow.
            </li>
            <li>
              <strong className="text-[var(--foreground)]/90">Gentle food safety</strong>{" "}
              (fully cooked curries, safe water, washed greens) whenever neutrophils may
              be low.
            </li>
            <li>
              <strong className="text-[var(--foreground)]/90">Honest limits on alcohol</strong>{" "}
              for many prevention and survivorship contexts; your oncologist’s advice
              overrides general wellness blogs.
            </li>
            <li>
              <strong className="text-[var(--foreground)]/90">Caution with high‑dose supplements</strong>{" "}
              or concentrated herbal powders—antioxidant capsules are not risk‑free
              during radiotherapy or some chemotherapies.
            </li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
            Viral “sugar feeds cancer” posts flatten a nuanced topic. For a concise,
            evidence‑aligned rebuttal, see{" "}
            <Link
              href="/learn/myths"
              className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/35 underline-offset-2 hover:decoration-[var(--primary)]"
            >
              Myths vs facts
            </Link>{" "}
            on this site, plus the NCI link inside that section.
          </p>
        </LearnHoverPanel>
      </FadeIn>

      <FadeIn delay={0.16}>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 px-4 py-5 sm:px-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
            <BookOpen className="h-5 w-5 text-[var(--primary)]" aria-hidden />
            Go deeper with trusted sources
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted-foreground)]">
            {nutritionTrustedLinks.map((item) => (
              <li key={item.href} className="leading-relaxed">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/35 underline-offset-2 hover:decoration-[var(--primary)]"
                >
                  {item.label}
                </a>
                <span className="text-[var(--muted-foreground)]"> — {item.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
    </LearnShell>
  );
}
