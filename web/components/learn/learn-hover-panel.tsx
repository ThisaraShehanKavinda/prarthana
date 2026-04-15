"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LearnHoverPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "group rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-shadow duration-300",
        "hover:border-[var(--primary)]/25 hover:shadow-md hover:shadow-[var(--primary)]/5",
        className
      )}
      whileHover={
        reduce
          ? undefined
          : { y: -3, transition: { type: "spring", stiffness: 400, damping: 24 } }
      }
      whileTap={reduce ? undefined : { scale: 0.995 }}
    >
      {children}
    </motion.div>
  );
}
