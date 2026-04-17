"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items: { id: string; question: string; answer: ReactNode }[] = [
  {
    id: "medical",
    question: "Is this website medical advice?",
    answer: (
      <>
        No. Everything here is for{" "}
        <strong className="text-[var(--foreground)]">education and general health literacy</strong>
        . Community stories are personal experiences, not instructions for your care. Always follow
        your own doctors and care team for diagnosis, treatment, and decisions about cancer.
      </>
    ),
  },
  {
    id: "post",
    question: "How do I write a post in the community?",
    answer: (
      <>
        Sign in with Google, then open{" "}
        <Link href="/community/new" className="font-medium text-[var(--primary)] underline underline-offset-2">
          Create post
        </Link>
        . Add a headline, your story (you can use simple formatting), and optionally a photo. Some
        posts may be reviewed before they appear publicly.
      </>
    ),
  },
  {
    id: "moderation",
    question: "Who moderates posts and comments?",
    answer: (
      <>
        Editors can review content and community members can use{" "}
        <strong className="text-[var(--foreground)]">Report</strong> on posts or comments. Authors
        can hide comments on their own posts. Full rules are in the{" "}
        <Link
          href="/community/guidelines"
          className="font-medium text-[var(--primary)] underline underline-offset-2"
        >
          community guidelines
        </Link>
        .
      </>
    ),
  },
  {
    id: "data",
    question: "Are the charts and numbers about my personal risk?",
    answer: (
      <>
        No. Learn pages use{" "}
        <strong className="text-[var(--foreground)]">illustrative, population-level</strong> figures
        to explain concepts like incidence and mortality—not to predict any one person’s outcome.
        Headlines without year, region, and context rarely tell you about <em>your</em> risk.
      </>
    ),
  },
  {
    id: "languages",
    question: "Is the site only in English?",
    answer: (
      <>
        The interface mixes English with the site name in Sinhala. Learning content is largely in
        English with clear structure; you can still use the community in the language you are
        comfortable writing in, while keeping the guidelines in mind.
      </>
    ),
  },
];

export function HomeFaq() {
  return (
    <div className="mx-auto max-w-3xl">
      <Accordion type="single" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-[var(--foreground)] sm:px-5 sm:py-4 sm:text-base">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed sm:px-5">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
