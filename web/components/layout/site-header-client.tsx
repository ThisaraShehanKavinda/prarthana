"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import { Menu } from "lucide-react";
import { UserNav } from "@/components/layout/user-nav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SiteBrandLockup } from "@/components/layout/site-brand-lockup";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function SiteHeaderClient({
  session,
  nav,
}: {
  session: Session | null;
  nav: { href: string; label: string }[];
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)]/80 bg-[var(--background)]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--background)]/75">
      <div className="relative mx-auto flex h-14 min-w-0 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="relative z-10 min-w-0 shrink rounded-lg py-1 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          <SiteBrandLockup variant="header" />
        </Link>

        <nav
          className="absolute left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 md:flex"
          aria-label="Main"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)]/80 transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-10 flex shrink-0 items-center gap-0.5 sm:gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0 md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[min(100vw-1.5rem,16rem)]"
              sideOffset={6}
            >
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {nav.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="cursor-pointer">
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <UserNav session={session} />
        </div>
      </div>
    </header>
  );
}
