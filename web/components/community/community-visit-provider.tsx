"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { STORAGE_COMMUNITY_LEFT_AT } from "@/lib/client-storage";

type CommunityVisitValue = {
  /** Timestamp from the previous visit’s end (ISO); posts newer than this are “new”. */
  baselineIso: string | null;
  /** True after we read `localStorage` on the client (avoids hydration mismatch). */
  ready: boolean;
};

const CommunityVisitContext = createContext<CommunityVisitValue | null>(null);

export function useCommunityVisitBaseline() {
  return useContext(CommunityVisitContext);
}

export function CommunityVisitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [baselineIso, setBaselineIso] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setBaselineIso(localStorage.getItem(STORAGE_COMMUNITY_LEFT_AT));
    } catch {
      setBaselineIso(null);
    }
    setReady(true);
  }, []);

  const persist = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_COMMUNITY_LEFT_AT, new Date().toISOString());
    } catch {
      /* ignore quota / private mode */
    }
  }, []);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "hidden") persist();
    };
    window.addEventListener("pagehide", persist);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", persist);
      document.removeEventListener("visibilitychange", onVis);
      persist();
    };
  }, [persist]);

  const value = useMemo(
    () => ({ baselineIso, ready }),
    [baselineIso, ready]
  );

  return (
    <CommunityVisitContext.Provider value={value}>
      {children}
    </CommunityVisitContext.Provider>
  );
}
