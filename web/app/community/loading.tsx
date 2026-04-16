import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityLoading() {
  return (
    <div className="min-h-screen bg-[var(--muted)]/40 pb-20 pt-6 sm:pt-10">
      <div className="mx-auto max-w-lg px-3 sm:px-4">
        <header className="mb-4 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between min-[420px]:gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-7 w-40 rounded-lg" />
            <Skeleton className="h-4 w-56 max-w-full rounded-md" />
          </div>
          <Skeleton className="h-10 w-full shrink-0 rounded-full min-[420px]:h-9 min-[420px]:w-32" />
        </header>
        <Skeleton className="mb-4 h-24 w-full rounded-2xl" />
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm"
            >
              <div className="flex gap-3 p-4 pb-3">
                <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 max-w-[14rem] rounded-md" />
                  <Skeleton className="h-5 w-full rounded-md" />
                  <Skeleton className="h-4 w-full max-w-[18rem] rounded-md" />
                </div>
              </div>
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="space-y-2 px-4 py-3">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-11/12 rounded-md" />
              </div>
              <div className="flex gap-2 border-t border-[var(--border)] px-2 py-3">
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="ml-auto h-9 w-28 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
