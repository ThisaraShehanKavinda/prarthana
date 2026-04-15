"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Apple,
  ArrowRight,
  Baby,
  Bone,
  Brain,
  Dna,
  Droplets,
  GitBranch,
  Globe2,
  Layers2,
  Pill,
  ShieldQuestion,
  Stethoscope,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TOPIC_ICONS = {
  globe2: Globe2,
  users: Users,
  layers2: Layers2,
  shieldQuestion: ShieldQuestion,
  stethoscope: Stethoscope,
  pill: Pill,
  apple: Apple,
  dna: Dna,
  carcinoma: Layers2,
  sarcoma: Bone,
  leukemia: Droplets,
  lymphoma: GitBranch,
  cns: Brain,
  childhood: Baby,
} as const;

export type LearnTopicIconId = keyof typeof TOPIC_ICONS;

/* Ocean blue #3A6EA5, lavender #EDE5F8, soft green #A8D8A5, light gray #EFEFEF */
const accents = [
  {
    wash: "from-[#3A6EA5]/12 to-[#EDE5F8]/80",
    ring: "ring-[#3A6EA5]/22 group-hover:ring-[#3A6EA5]/45",
    icon: "from-[#3A6EA5]/22 to-[#A8D8A5]/28 text-[#2d5080] dark:text-[#a8c4e8]",
  },
  {
    wash: "from-[#EDE5F8]/90 to-[#A8D8A5]/18",
    ring: "ring-[#A8D8A5]/28 group-hover:ring-[#3A6EA5]/35",
    icon: "from-[#EDE5F8] to-[#3A6EA5]/18 text-[#3A6EA5] dark:text-[#b8c9e6]",
  },
  {
    wash: "from-[#A8D8A5]/22 to-[#EFEFEF]/95",
    ring: "ring-[#3A6EA5]/18 group-hover:ring-[#A8D8A5]/45",
    icon: "from-[#A8D8A5]/35 to-[#3A6EA5]/15 text-[#2f5a42] dark:text-[#c4e8c2]",
  },
  {
    wash: "from-[#EFEFEF] to-[#3A6EA5]/10",
    ring: "ring-[#EDE5F8]/60 group-hover:ring-[#3A6EA5]/38",
    icon: "from-[#3A6EA5]/18 to-[#EDE5F8]/90 text-[#3A6EA5] dark:text-[#9ec0ea]",
  },
  {
    wash: "from-[#3A6EA5]/10 to-[#A8D8A5]/14",
    ring: "ring-[#3A6EA5]/20 group-hover:ring-[#A8D8A5]/40",
    icon: "from-[#3A6EA5]/20 to-[#A8D8A5]/22 text-[#2d5080] dark:text-[#a8d4b0]",
  },
  {
    wash: "from-[#EDE5F8]/70 to-[#3A6EA5]/12",
    ring: "ring-[#EDE5F8]/50 group-hover:ring-[#3A6EA5]/42",
    icon: "from-[#EDE5F8] to-[#A8D8A5]/25 text-[#4a5a78] dark:text-[#c5d4f0]",
  },
  {
    wash: "from-[#A8D8A5]/15 to-[#3A6EA5]/10",
    ring: "ring-[#A8D8A5]/25 group-hover:ring-[#3A6EA5]/35",
    icon: "from-[#A8D8A5]/30 to-[#EDE5F8]/80 text-[#355d8c] dark:text-[#b8e0b6]",
  },
  {
    wash: "from-[#3A6EA5]/08 to-[#EDE5F8]/60",
    ring: "ring-[#3A6EA5]/18 group-hover:ring-[#A8D8A5]/38",
    icon: "from-[#EFEFEF] to-[#3A6EA5]/20 text-[#3A6EA5] dark:text-[#8fb4e0]",
  },
] as const;

export function LearnTopicCard({
  href,
  title,
  description,
  icon,
  accentIndex = 0,
}: {
  href: string;
  title: string;
  description: string;
  icon: LearnTopicIconId;
  accentIndex?: number;
}) {
  const reduce = useReducedMotion();
  const a = accents[accentIndex % accents.length];
  const Icon = TOPIC_ICONS[icon] ?? Layers2;

  return (
    <Link href={href} className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]">
      <motion.div
        className={cn(
          "relative h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm ring-1 ring-transparent transition-shadow duration-300",
          "group-hover:border-[var(--primary)]/30 group-hover:shadow-lg group-hover:shadow-[var(--primary)]/8"
        )}
        whileHover={
          reduce
            ? undefined
            : { y: -4, transition: { type: "spring", stiffness: 420, damping: 22 } }
        }
        whileTap={reduce ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            a.wash
          )}
          aria-hidden
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl ring-inset ring-1 transition-all duration-300 opacity-0 group-hover:opacity-100",
            a.ring
          )}
          aria-hidden
        />
        <div className="relative flex gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-inner transition-transform duration-300",
              "ring-1 ring-[var(--border)] group-hover:scale-110 group-hover:ring-[var(--primary)]/25",
              a.icon
            )}
          >
            <Icon
              className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
              strokeWidth={1.75}
              aria-hidden
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold leading-snug tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                {title}
              </h3>
              <ArrowRight
                className="mt-0.5 h-5 w-5 shrink-0 text-[var(--muted-foreground)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--primary)]"
                aria-hidden
              />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
