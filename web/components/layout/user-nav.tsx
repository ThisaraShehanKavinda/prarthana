"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import { User as UserIcon } from "lucide-react";
import { authorInitials } from "@/lib/author-initials";

function UserNavSignedIn({ user }: { user: NonNullable<Session["user"]> }) {
  const label = user.name ?? user.email ?? "Account";
  const initials = authorInitials(user.name, user.email);
  const rawImage = user.image?.trim();
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = Boolean(rawImage) && !photoFailed;

  useEffect(() => {
    setPhotoFailed(false);
  }, [rawImage]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 overflow-hidden rounded-full p-0 md:flex md:h-10 md:w-auto md:max-w-[14rem] md:rounded-lg md:px-2 md:py-0 md:gap-2"
          aria-label={`Account menu (${label})`}
        >
          {showPhoto ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- OAuth avatar hostnames vary by provider */}
              <img
                src={rawImage}
                alt=""
                referrerPolicy="no-referrer"
                width={40}
                height={40}
                className="size-10 object-cover md:size-8 md:rounded-full"
                onError={() => setPhotoFailed(true)}
              />
              <span className="hidden min-w-0 truncate text-left text-sm md:inline" aria-hidden>
                {label}
              </span>
            </>
          ) : (
            <>
              <span
                aria-hidden
                className="select-none text-[0.7rem] font-bold leading-none tracking-tight text-[var(--primary)] md:hidden"
              >
                {initials}
              </span>
              <UserIcon className="hidden h-4 w-4 shrink-0 md:inline" aria-hidden />
              <span className="hidden min-w-0 truncate text-left text-sm md:inline" aria-hidden>
                {label}
              </span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="bottom"
        sideOffset={8}
        collisionPadding={16}
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

  return <UserNavSignedIn user={user} />;
}
