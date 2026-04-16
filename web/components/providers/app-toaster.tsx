"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function AppToaster() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Toaster
      position="top-center"
      className="prarthana-sonner-center"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      richColors
      closeButton
      expand={false}
      gap={10}
      toastOptions={{
        classNames: {
          toast:
            "group border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-lg",
          title: "font-semibold",
          description: "text-[var(--muted-foreground)]",
        },
      }}
    />
  );
}
