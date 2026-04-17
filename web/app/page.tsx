import Link from "next/link";
import Image from "next/image";
import { siteImages } from "@/content/site-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { getSiteStats } from "@/lib/stats";
import { ArrowRight, BookOpen, LineChart, Users } from "lucide-react";
import { SiteBrandLockup } from "@/components/layout/site-brand-lockup";
import { HomeFaq } from "@/components/home/home-faq";

export default function HomePage() {
  const stats = getSiteStats();

  return (
    <div>
      <section className="mesh-hero relative overflow-hidden border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:flex lg:items-center lg:gap-12 lg:px-8 lg:py-24">
          <div className="max-w-2xl flex-1">
            <FadeIn>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
                Cancer literacy, reimagined
              </p>
              <h1 className="text-balance text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl lg:text-6xl">
                Understand cancer with clarity, data, and care.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
                <SiteBrandLockup variant="body" />{" "}
                combines interactive charts, evidence-grounded explainers, and a
                respectful community space—so you can learn and share in one place.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" className="w-full min-h-11 sm:w-auto">
                  <Link href="/learn/burden">
                    Explore the data
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full min-h-11 sm:w-auto">
                  <Link href="/community">Join the community</Link>
                </Button>
              </div>
            </FadeIn>
            <FadeIn delay={0.1} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Card className="border-[var(--border)] bg-[var(--card)]/80 backdrop-blur">
                <CardContent className="p-4">
                  <p className="text-xs text-[var(--muted-foreground)]">New cases / yr (illustr.)</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    ~{stats.globalBurden.newCasesPerYearMillions}M
                  </p>
                </CardContent>
              </Card>
              <Card className="border-[var(--border)] bg-[var(--card)]/80 backdrop-blur">
                <CardContent className="p-4">
                  <p className="text-xs text-[var(--muted-foreground)]">Deaths / yr (illustr.)</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    ~{stats.globalBurden.deathsPerYearMillions}M
                  </p>
                </CardContent>
              </Card>
              <Card className="col-span-2 border-[var(--border)] bg-[var(--card)]/80 backdrop-blur sm:col-span-1">
                <CardContent className="p-4">
                  <p className="text-xs text-[var(--muted-foreground)]">Share of all deaths (illustr.)</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    ~{stats.globalBurden.shareOfAllDeathsPercent}%
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
          <FadeIn delay={0.15} className="mt-12 flex-1 lg:mt-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--muted)] shadow-xl">
              <Image
                src={siteImages.homeHero}
                alt="DNA double helix model (Wikimedia Commons)"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 480px, 100vw"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--background)]/40 via-transparent to-transparent" />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <FadeIn>
          <h2 className="text-balance text-xl font-bold tracking-tight sm:text-2xl">Three ways to explore</h2>
          <p className="mt-2 max-w-2xl text-[var(--muted-foreground)]">
            Move from population-level context to cellular science, then share
            lived perspectives—always alongside trusted references.
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Guided learning",
              body: "Burden charts, age patterns, treatment mechanisms, myth busting, and nutrition context.",
              href: "/learn",
              icon: BookOpen,
            },
            {
              title: "Science hub",
              body: "DNA damage, hallmarks of cancer, staging, and how therapies work—short modules.",
              href: "/learn/science",
              icon: LineChart,
            },
            {
              title: "Community articles",
              body: "Write posts, add photos, and discuss with comments alongside the learning hub.",
              href: "/community",
              icon: Users,
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={0.05 * i}>
              <Card className="h-full border-[var(--border)] transition hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex h-full flex-col p-6">
                  <item.icon className="h-8 w-8 text-[var(--primary)]" />
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-[var(--muted-foreground)]">
                    {item.body}
                  </p>
                  <Button asChild variant="link" className="mt-4 px-0">
                    <Link href={item.href}>
                      Open
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--muted)]/20 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-balance text-xl font-bold tracking-tight sm:text-2xl">
              Common questions
            </h2>
            <p className="mt-2 max-w-2xl text-[var(--muted-foreground)]">
              Quick answers about how to use this site responsibly—tap a question to expand.
            </p>
          </FadeIn>
          <FadeIn delay={0.06} className="mt-8">
            <HomeFaq />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
