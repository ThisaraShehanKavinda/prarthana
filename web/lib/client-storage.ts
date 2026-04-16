/** Browser storage keys shared across client components (keep stable for users). */
export const STORAGE_COMMUNITY_LEFT_AT = "prarthana-community-left-at";
export const STORAGE_LEARN_LAST = "prarthana-learn-last";

export type LearnLastPayload = {
  href: string;
  label: string;
  at: string;
};
