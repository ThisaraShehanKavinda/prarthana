import type { Article, Comment } from "@/lib/types";
import { appendNotificationRow } from "@/lib/sheets";
import { v4 as uuidv4 } from "uuid";

function tokenMatchesParticipant(
  token: string,
  email: string,
  displayName: string
): boolean {
  const t = token.toLowerCase();
  const em = email.toLowerCase();
  const local = em.split("@")[0] ?? "";
  if (t === local) return true;
  const parts = displayName
    .trim()
    .split(/\s+/)
    .map((p) => p.toLowerCase())
    .filter(Boolean);
  return parts.some((p) => p === t || p.startsWith(t));
}

function collectParticipants(article: Article, comments: Comment[]) {
  const byEmail = new Map<
    string,
    { email: string; displayName: string }
  >();
  byEmail.set(article.authorEmail.toLowerCase(), {
    email: article.authorEmail,
    displayName: article.authorName || article.authorEmail,
  });
  for (const c of comments) {
    const k = c.authorEmail.toLowerCase();
    if (!byEmail.has(k)) {
      byEmail.set(k, {
        email: c.authorEmail,
        displayName: c.authorName || c.authorEmail,
      });
    }
  }
  return byEmail;
}

export function parseMentionEmails(
  body: string,
  article: Article,
  comments: Comment[],
  authorEmail: string
): string[] {
  const participants = collectParticipants(article, comments);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of body.matchAll(/@([\w.-]+)/g)) {
    const token = m[1];
    if (!token) continue;
    for (const { email, displayName } of participants.values()) {
      if (email.toLowerCase() === authorEmail.toLowerCase()) continue;
      if (tokenMatchesParticipant(token, email, displayName)) {
        const k = email.toLowerCase();
        if (!seen.has(k)) {
          seen.add(k);
          out.push(email);
        }
        break;
      }
    }
  }
  return out;
}

export async function appendNotifications(
  rows: Array<{
    recipientEmail: string;
    type: "comment_reply" | "mention" | "mod_comment_hidden" | "mod_post_hidden";
    title: string;
    body: string;
    linkHref: string;
  }>
): Promise<void> {
  const seen = new Set<string>();
  const deduped = rows.filter((r) => {
    const k = `${r.recipientEmail.toLowerCase()}\0${r.type}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const now = new Date().toISOString();
  for (const r of deduped) {
    const id = uuidv4();
    await appendNotificationRow([
      id,
      now,
      r.recipientEmail,
      r.type,
      r.title,
      r.body,
      r.linkHref,
      "",
    ]);
  }
}

export function lastCommentByUserOnArticle(
  comments: Comment[],
  articleId: string,
  userEmail: string
): Comment | undefined {
  const em = userEmail.toLowerCase();
  const mine = comments.filter(
    (c) =>
      c.articleId === articleId && c.authorEmail.toLowerCase() === em
  );
  if (mine.length === 0) return undefined;
  return mine.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];
}

export function slowModeSeconds(): number {
  const raw = process.env.COMMUNITY_SLOW_MODE_SECONDS;
  if (!raw?.trim()) return 0;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 3600) : 0;
}
