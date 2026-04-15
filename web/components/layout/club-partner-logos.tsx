import Image from "next/image";

const CLUB_LINE = "Leo Club of District 306 D7";
const UNIVERSITY_LINE = "University of Sri Jayewardenepura";

export function ClubPartnerLogos() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/60 px-4 py-5">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
        Launched by
      </p>
      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="flex flex-row items-center justify-center gap-4 min-[480px]:gap-6">
          <Image
            src="/images/logo1.jpeg"
            alt={`${CLUB_LINE}, ${UNIVERSITY_LINE}`}
            width={128}
            height={128}
            className="h-16 w-16 shrink-0 rounded-full border-2 border-[var(--border)] bg-[var(--card)] object-cover shadow-sm sm:h-[4.5rem] sm:w-[4.5rem]"
          />
          <Image
            src="/images/logo2.jpeg"
            alt={UNIVERSITY_LINE}
            width={128}
            height={128}
            className="h-16 w-16 shrink-0 rounded-full border-2 border-[var(--border)] bg-[var(--card)] object-cover shadow-sm sm:h-[4.5rem] sm:w-[4.5rem]"
          />
        </div>
        <div className="max-w-md text-center">
          <p className="text-sm font-semibold leading-snug text-[var(--foreground)]">{CLUB_LINE}</p>
          <p className="mt-0.5 text-sm font-semibold leading-snug text-[var(--foreground)]">
            {UNIVERSITY_LINE}
          </p>
        </div>
      </div>
    </div>
  );
}
