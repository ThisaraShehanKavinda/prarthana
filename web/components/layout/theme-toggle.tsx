"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 shrink-0"
          aria-label="Color theme"
        >
          {!mounted ? (
            <Sun className="h-5 w-5 opacity-40" aria-hidden />
          ) : resolvedTheme === "dark" ? (
            <Moon className="h-5 w-5" aria-hidden />
          ) : (
            <Sun className="h-5 w-5" aria-hidden />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="min-w-[10.5rem]">
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2"
          onClick={() => setTheme("light")}
        >
          <Sun className="h-4 w-4 shrink-0" aria-hidden />
          <span className="flex-1">Light</span>
          {theme === "light" ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2"
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-4 w-4 shrink-0" aria-hidden />
          <span className="flex-1">Dark</span>
          {theme === "dark" ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2"
          onClick={() => setTheme("system")}
        >
          <Monitor className="h-4 w-4 shrink-0" aria-hidden />
          <span className="flex-1">System</span>
          {theme === "system" ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
