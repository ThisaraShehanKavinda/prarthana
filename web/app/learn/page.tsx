import type { LearnTopicIconId } from "@/components/learn/learn-topic-card";
import { LearnShell } from "@/components/learn/learn-shell";
import { LearnTopicCard } from "@/components/learn/learn-topic-card";
import { FadeIn } from "@/components/motion/fade-in";

const sections: {
  href: string;
  title: string;
  desc: string;
  icon: LearnTopicIconId;
}[] = [
  {
    href: "/learn/burden",
    title: "Global burden",
    desc: "Incidence vs mortality, prevention levers, data literacy—plus interactive deep dives.",
    icon: "globe2",
  },
  {
    href: "/learn/age",
    title: "Children & older adults",
    desc: "Pediatric, AYA, midlife screening windows, and geriatric oncology—accordion life-course guide.",
    icon: "users",
  },
  {
    href: "/learn/types",
    title: "Categories of cancer",
    desc: "Taxonomy primer (lineage, grade vs stage), then deep pages with extra interactives per type.",
    icon: "layers2",
  },
  {
    href: "/learn/myths",
    title: "Myths vs facts",
    desc: "Nine expandable myths with NCI/FDA links—phones, biopsies, deodorants, attitude claims, and more.",
    icon: "shieldQuestion",
  },
  {
    href: "/learn/treatments",
    title: "Treatments",
    desc: "Illustrative mix chart, MDT & intent accordions, and rich modality cards with “living with” toggles.",
    icon: "stethoscope",
  },
  {
    href: "/learn/medicines",
    title: "Medicines (educational)",
    desc: "ADME, biosimilars, trials—plus expanded class cards (cytotoxics through ADCs/radiopharma).",
    icon: "pill",
  },
  {
    href: "/learn/nutrition",
    title: "Nutrition spotlight",
    desc: "King coconut, delum (pomegranate), and balanced eating during treatment.",
    icon: "apple",
  },
  {
    href: "/learn/science",
    title: "Science inside cancer",
    desc: "Four rich concept cards plus clonal evolution, microenvironment, and model-limit accordions.",
    icon: "dna",
  },
];

export default function LearnIndexPage() {
  return (
    <LearnShell
      title="Learn hub"
      kicker="Start anywhere"
      crumbs={[{ href: "/", label: "Home" }, { href: "/learn", label: "Learn" }]}
    >
      <FadeIn>
        <p className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/25 px-4 py-4 text-lg leading-relaxed text-[var(--muted-foreground)] shadow-sm backdrop-blur-sm">
          Each module pairs plain-language explanations with charts or visuals. All
          medical decisions belong with your care team—these pages exist to improve
          literacy, not to replace clinicians.
        </p>
      </FadeIn>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((s, i) => (
          <FadeIn key={s.href} delay={0.04 * i}>
            <LearnTopicCard
              href={s.href}
              title={s.title}
              description={s.desc}
              icon={s.icon}
              accentIndex={i}
            />
          </FadeIn>
        ))}
      </div>
    </LearnShell>
  );
}
