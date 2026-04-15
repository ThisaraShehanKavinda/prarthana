"use client";

import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export function UserNav({ session }: { session: Session | null }) {
  const user = session?.user;

  if (!user) {
    return (
      <Button
        size="sm"
        variant="default"
        className="h-9 shrink-0 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
        onClick={() => signIn("google")}
      >
        Sign in
      </Button>
    );
  }

  const label = user.name ?? user.email ?? "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 max-w-[min(100%,11rem)] shrink-0 gap-1.5 px-2 sm:h-10 sm:max-w-[14rem] sm:gap-2 sm:px-3"
        >
          <User className="h-4 w-4 shrink-0" aria-hidden />
          <span className="min-w-0 truncate text-left text-xs sm:text-sm">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-[min(calc(100vw-1.5rem),18rem)]"
      >
        <DropdownMenuItem asChild>
          <Link href="/community/new" className="cursor-pointer">
            Create post
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
