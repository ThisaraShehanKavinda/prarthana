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
    desc: "Simple charts and clear terms to understand new cases, deaths, and prevention.",
    icon: "globe2",
  },
  {
    href: "/learn/age",
    title: "Children & older adults",
    desc: "How cancer patterns change from childhood to older age, with practical age-based context.",
    icon: "users",
  },
  {
    href: "/learn/types",
    title: "Categories of cancer",
    desc: "Easy guide to cancer families, plus deeper pages for each type.",
    icon: "layers2",
  },
  {
    href: "/learn/myths",
    title: "Myths vs facts",
    desc: "Common cancer myths explained in plain language with trusted source links.",
    icon: "shieldQuestion",
  },
  {
    href: "/learn/treatments",
    title: "Treatments",
    desc: "How surgery, radiation, medicine, and immune therapy are used in real care plans.",
    icon: "stethoscope",
  },
  {
    href: "/learn/medicines",
    title: "Medicines (educational)",
    desc: "A plain-language guide to major cancer medicine groups and key safety concepts.",
    icon: "pill",
  },
  {
    href: "/learn/nutrition",
    title: "Nutrition spotlight",
    desc: "Practical eating tips for treatment days, side effects, hydration, and safety.",
    icon: "apple",
  },
  {
    href: "/learn/science",
    title: "Science inside cancer",
    desc: "Core cancer biology explained simply: DNA changes, staging, hallmarks, and treatment links.",
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
