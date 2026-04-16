import { auth } from "@/auth";
import {
  appendLikeRow,
  deleteLikeSheetRow,
  fetchAllArticles,
  fetchAllLikes,
  findLikeSheetRowNumber,
  isSheetsConfigured,
} from "@/lib/sheets";
import { rateLimitKey } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const idSchema = z.string().uuid();

function likersPayload(
  likes: { authorEmail: string; authorName: string; createdAt: string }[]
) {
  const sorted = [...likes].sort((a, b) => {
    const an = (a.authorName || a.authorEmail).toLowerCase();
    const bn = (b.authorName || b.authorEmail).toLowerCase();
    return an.localeCompare(bn);
  });
  return sorted.map((l) => ({
    authorEmail: l.authorEmail,
    authorName: l.authorName || l.authorEmail,
    createdAt: l.createdAt,
  }));
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  if (!isSheetsConfigured()) {
    return NextResponse.json({ count: 0, likers: [], likedByMe: false });
  }

  const session = await auth();
  const me = session?.user?.email?.toLowerCase() ?? "";

  const likes = (await fetchAllLikes()).filter((l) => l.articleId === parsed.data);
  const likedByMe = Boolean(
    me && likes.some((l) => l.authorEmail.toLowerCase() === me)
  );

  return NextResponse.json({
    count: likes.length,
    likers: likersPayload(likes),
    likedByMe,
  });
}

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSheetsConfigured()) {
    return NextResponse.json(
      { error: "Likes are temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const limited = rateLimitKey(`like:${session.user.email}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  const { id } = await context.params;
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const articles = await fetchAllArticles();
  const article = articles.find((a) => a.id === parsed.data);
  if (!article || article.status !== "published") {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const articleId = parsed.data;
  const email = session.user.email;
  const row = await findLikeSheetRowNumber(articleId, email);

  try {
    if (row !== null) {
      await deleteLikeSheetRow(row);
    } else {
      const now = new Date().toISOString();
      const ok = await appendLikeRow([
        uuidv4(),
        now,
        articleId,
        email,
        session.user.name ?? "",
      ]);
      if (!ok) {
        return NextResponse.json(
          { error: "Could not save like. Check the article_likes sheet tab exists." },
          { status: 502 }
        );
      }
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error:
          "Could not update like. Ensure a tab named article_likes (or SHEETS_LIKES_TAB) exists with headers: id,createdAt,articleId,authorEmail,authorName.",
      },
      { status: 502 }
    );
  }

  const likes = (await fetchAllLikes()).filter((l) => l.articleId === articleId);
  const likedByMe = likes.some(
    (l) => l.authorEmail.toLowerCase() === email.toLowerCase()
  );

  return NextResponse.json({
    liked: likedByMe,
    count: likes.length,
    likers: likersPayload(likes),
  });
}
