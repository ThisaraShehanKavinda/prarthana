import { auth } from "@/auth";
import {
  appendCommentRow,
  fetchAllArticles,
  fetchAllComments,
  isSheetsConfigured,
} from "@/lib/sheets";
import { isArticlePubliclyVisible } from "@/lib/article-feed";
import type { Article } from "@/lib/types";
import {
  appendNotifications,
  lastCommentByUserOnArticle,
  parseMentionEmails,
  slowModeSeconds,
} from "@/lib/comment-social";
import { rateLimitKey } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const schema = z.object({
  articleId: z.string().uuid(),
  body: z.string().min(2).max(2000),
  parentCommentId: z.string().uuid().optional().nullable(),
});

function commentableArticle(article: Article | undefined): boolean {
  if (!article) return false;
  if (article.status === "published") return true;
  return isArticlePubliclyVisible(article);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSheetsConfigured()) {
    return NextResponse.json(
      { error: "Comments are temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const limited = rateLimitKey(`comment:${session.user.email}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  let bodyJson: unknown;
  try {
    bodyJson = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(bodyJson);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const articles = await fetchAllArticles();
  const article = articles.find((a) => a.id === parsed.data.articleId);
  if (!article || !commentableArticle(article)) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  const allComments = await fetchAllComments();
  const slow = slowModeSeconds();
  if (slow > 0) {
    const last = lastCommentByUserOnArticle(
      allComments,
      article.id,
      session.user.email
    );
    if (last) {
      const delta = Date.now() - new Date(last.createdAt).getTime();
      if (delta < slow * 1000) {
        const wait = Math.ceil((slow * 1000 - delta) / 1000);
        return NextResponse.json(
          {
            error: `Slow mode: wait about ${wait}s before another comment on posts.`,
          },
          { status: 429 }
        );
      }
    }
  }

  let parentId = (parsed.data.parentCommentId ?? "").trim();
  if (parentId) {
    const parent = allComments.find((c) => c.id === parentId);
    if (!parent || parent.articleId !== article.id) {
      return NextResponse.json({ error: "Invalid reply target." }, { status: 400 });
    }
  } else {
    parentId = "";
  }

  const now = new Date().toISOString();
  const newId = uuidv4();
  const text = parsed.data.body.trim();
  const row = [
    newId,
    now,
    article.id,
    session.user.email,
    session.user.name ?? "",
    text,
    "public",
    parentId,
    (session.user.image ?? "").trim(),
  ];

  try {
    await appendCommentRow(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "We couldn’t save your comment. Please try again in a moment." },
      { status: 502 }
    );
  }

  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const link = `${base}/community/${article.slug}#c-${newId}`;

  const refreshed = await fetchAllComments();
  const notifs: Parameters<typeof appendNotifications>[0] = [];

  if (parentId) {
    const parent = refreshed.find((c) => c.id === parentId);
    if (
      parent &&
      parent.authorEmail.toLowerCase() !== session.user.email.toLowerCase()
    ) {
      notifs.push({
        recipientEmail: parent.authorEmail,
        type: "comment_reply",
        title: "New reply to your comment",
        body: `${session.user.name || session.user.email} replied on “${article.title.slice(0, 72)}${article.title.length > 72 ? "…" : ""}”.`,
        linkHref: link,
      });
    }
  }

  const mentionEmails = parseMentionEmails(
    text,
    article,
    refreshed,
    session.user.email
  );
  for (const em of mentionEmails) {
    notifs.push({
      recipientEmail: em,
      type: "mention",
      title: "You were mentioned",
      body: `${session.user.name || session.user.email} mentioned you on “${article.title.slice(0, 60)}${article.title.length > 60 ? "…" : ""}”.`,
      linkHref: link,
    });
  }

  await appendNotifications(notifs);

  return NextResponse.json({ ok: true, id: newId });
}
