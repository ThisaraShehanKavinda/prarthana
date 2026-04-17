import type { Comment } from "@/lib/types";

export type MentionCandidate = {
  email: string;
  /** Shown in the suggestion list (typically authorName from Sheets). */
  label: string;
  /** Inserted after `@`; must match `/[\w.-]+/` so notifications still resolve. */
  insertToken: string;
  emailLocal: string;
  /** Profile photo URL when known (post/comment author). */
  imageUrl?: string;
};

function pickInsertToken(displayName: string, email: string): string {
  const local = (email.split("@")[0] ?? "user").replace(/[^\w.-]/g, "") || "user";
  const parts = displayName
    .trim()
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  for (const p of parts) {
    const safe = p.replace(/[^\w.-]/g, "");
    if (safe.length >= 1) return safe;
  }
  return local;
}

/**
 * People who can be @mentioned on this thread (post author + comment authors),
 * deduped by email. Excludes the current user. Names come from `authorName` /
 * `authorEmail` columns on articles and comments.
 */
export function buildMentionCandidates(
  article: {
    authorEmail: string;
    authorName: string;
    authorImageUrl?: string;
  },
  comments: Comment[],
  excludeEmail?: string | null
): MentionCandidate[] {
  const ex = excludeEmail?.trim().toLowerCase() ?? "";
  const byEmail = new Map<string, MentionCandidate>();

  function add(
    email: string,
    authorName: string,
    authorImageUrl?: string | null
  ) {
    const em = email.trim();
    if (!em) return;
    const key = em.toLowerCase();
    if (ex && key === ex) return;
    const img = (authorImageUrl ?? "").trim();
    if (byEmail.has(key)) {
      const prev = byEmail.get(key)!;
      if (!prev.imageUrl?.trim() && img) {
        byEmail.set(key, { ...prev, imageUrl: img });
      }
      return;
    }
    const label = (authorName || em).trim() || em;
    const insertToken = pickInsertToken(authorName || "", em);
    const emailLocal = key.split("@")[0] ?? "";
    byEmail.set(key, {
      email: em,
      label,
      insertToken,
      emailLocal,
      ...(img ? { imageUrl: img } : {}),
    });
  }

  add(article.authorEmail, article.authorName, article.authorImageUrl);
  for (const c of comments) {
    add(c.authorEmail, c.authorName, c.authorImageUrl);
  }

  const list = [...byEmail.values()];
  const authorKey = article.authorEmail.trim().toLowerCase();
  list.sort((a, b) => {
    const ao = a.email.toLowerCase() === authorKey ? 0 : 1;
    const bo = b.email.toLowerCase() === authorKey ? 0 : 1;
    if (ao !== bo) return ao - bo;
    return a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
  });
  return list;
}

export function filterMentionCandidates(
  candidates: MentionCandidate[],
  query: string
): MentionCandidate[] {
  const q = query.trim().toLowerCase();
  if (!q) return candidates;
  return candidates.filter((c) => {
    const label = c.label.toLowerCase();
    const token = c.insertToken.toLowerCase();
    const loc = c.emailLocal.toLowerCase();
    const em = c.email.toLowerCase();
    return (
      label.includes(q) ||
      token.startsWith(q) ||
      loc.startsWith(q) ||
      em.includes(q) ||
      label.split(/\s+/).some((w) => w.startsWith(q))
    );
  });
}
