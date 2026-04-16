import { auth } from "@/auth";
import {
  appendCommentRow,
  fetchAllArticles,
  isSheetsConfigured,
} from "@/lib/sheets";
import { rateLimitKey } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const schema = z.object({
  articleId: z.string().uuid(),
  body: z.string().min(2).max(2000),
});

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
  if (!article || article.status !== "published") {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const row = [
    uuidv4(),
    now,
    article.id,
    session.user.email,
    session.user.name ?? "",
    parsed.data.body.trim(),
    "public",
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

  return NextResponse.json({ ok: true });
}
