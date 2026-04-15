import Image from "next/image";
import Link from "next/link";
import { HeartPulse, Quote, Users } from "lucide-react";
import { LearnShell } from "@/components/learn/learn-shell";
import { LearnHoverPanel } from "@/components/learn/learn-hover-panel";
import { AgeGroupChart } from "@/components/charts/age-group-chart";
import { getSiteStats } from "@/lib/stats";
import { FadeIn } from "@/components/motion/fade-in";
import { siteImages } from "@/content/site-images";
import { ageLifeCourse } from "@/content/learn-age";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function AgePage() {
  const stats = getSiteStats();

  return (
    <LearnShell
      title="Children, adults, and older adults"
      kicker="Development, screening windows, and frailty"
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/learn", label: "Learn" },
        { href: "/learn/age", label: "Age" },
      ]}
    >
      <FadeIn>
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/25 px-4 py-5 text-[var(--muted-foreground)] shadow-sm sm:px-5 sm:py-6">
          <p className="text-lg leading-relaxed">
            Cancer is not one disease—it is hundreds of diseases whose incidence curves
            bend with age because of different cell lineages, exposure timelines, and
            host biology.{" "}
            <strong className="text-[var(--foreground)]">
              Pediatric leukemias and embryonal tumors
            </strong>{" "}
            cluster differently from{" "}
            <strong className="text-[var(--foreground)]">
              carcinomas that surge after middle age
            </strong>
            , while{" "}
            <strong className="text-[var(--foreground)]">
              geriatric oncology
            </strong>{" "}
            asks how chronologic age, frailty, and polypharmacy change the benefit–risk
            of aggressive therapy.
          </p>
          <blockquote className="flex gap-3 rounded-xl border border-[var(--accent-green)]/35 bg-[var(--accent-green)]/10 px-4 py-3 text-[var(--foreground)]/95">
            <Quote className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" aria-hidden />
            <p className="text-sm font-medium leading-relaxed sm:text-base">
              The right question is rarely “What is average for my age?”—it is “What
              biology, exposures, and organ reserve does this person actually have?”
            </p>
          </blockquote>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <LearnHoverPanel className="p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
            <Users className="h-5 w-5 text-[var(--primary)]" aria-hidden />
            Life-course lens: tap to explore
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            These panels connect epidemiology to survivorship—why pediatric protocols,
            AYA navigation, and geriatric assessment exist as distinct subspecialties.
          </p>
          <Accordion type="single" collapsible className="mt-4 w-full">
            {ageLifeCourse.map((item) => (
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

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <FadeIn delay={0.08}>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Illustrative age-group shares
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
            {stats.sourcesNote} Percentages are a teaching visualization—not a
            substitute for national registry tables or trial inclusion criteria.
          </p>
          <LearnHoverPanel className="mt-4 overflow-hidden p-4">
            <AgeGroupChart data={stats.ageGroups.illustrativeIncidenceByGroup} />
          </LearnHoverPanel>
          <LearnHoverPanel className="mt-4 p-4">
            <div className="flex items-start gap-3">
              <HeartPulse className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" aria-hidden />
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                Childhood cancers account for roughly{" "}
                <strong className="text-[var(--foreground)]">
                  {stats.ageGroups.childhoodShareOfAllCancersPercent}%
                </strong>{" "}
                of all cancers in many global summaries—small numerically, but enormous
                in human impact. {stats.ageGroups.olderAdultMajorityNote}
              </p>
            </div>
          </LearnHoverPanel>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--muted)]">
            <Image
              src={siteImages.learnAgeChildren}
              alt="Children playing (Wikimedia Commons)"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 400px, 100vw"
              unoptimized
            />
          </div>
          <p className="mt-3 text-xs text-[var(--muted-foreground)]">
            Stock photo context—not diagnostic imagery.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
            Screening ages for breast, colorectal, cervical, lung, and prostate cancer
            shift as trial evidence evolves—always compare lay articles with{" "}
            <a
              className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/40 underline-offset-2 hover:decoration-[var(--primary)]"
              href="https://www.uspreventiveservicestaskforce.org/"
              target="_blank"
              rel="noreferrer"
            >
              national guideline tables
            </a>{" "}
            (U.S. example linked) or your country’s equivalent.
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={0.12}>
        <p className="text-sm text-[var(--muted-foreground)]">
          Next:{" "}
          <Link
            href="/learn/types"
            className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/40 underline-offset-2 hover:decoration-[var(--primary)]"
          >
            Explore cancer categories
          </Link>
          .
        </p>
      </FadeIn>
    </LearnShell>
  );
}
