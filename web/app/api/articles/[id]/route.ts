import { auth } from "@/auth";
import {
  articleSheetRowNumber,
  deleteArticleById,
  fetchAllArticles,
  isSheetsConfigured,
  updateArticleRowAt,
} from "@/lib/sheets";
import { COMMUNITY_TOPIC_TAGS } from "@/lib/community-topic-tags";
import { NextResponse } from "next/server";
import { z } from "zod";
import { MAX_HERO_IMAGE_CHARS } from "@/lib/hero-image-constants";
import type { Article, ArticleStatus } from "@/lib/types";

const ALLOWED_TAG_IDS = new Set(
  COMMUNITY_TOPIC_TAGS.map((t) => t.id as string)
);

const patchSchema = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().min(10).max(800),
  bodyMarkdown: z.string().min(20).max(20000),
  heroImageUrl: z.string().max(MAX_HERO_IMAGE_CHARS).optional(),
  tags: z.array(z.string()).max(6).optional(),
  publishMode: z.enum(["publish", "draft", "scheduled"]).optional(),
  scheduledPublishAt: z.string().nullable().optional(),
});

function isOwner(sessionEmail: string, article: Article): boolean {
  return sessionEmail.toLowerCase() === article.authorEmail.toLowerCase();
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSheetsConfigured()) {
    return NextResponse.json(
      { error: "Saving is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const { id } = await context.params;
  const articles = await fetchAllArticles();
  const article = articles.find((a) => a.id === id);
  if (!article) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
  if (!isOwner(session.user.email, article)) {
    return NextResponse.json({ error: "You can only edit your own posts." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    title,
    excerpt,
    bodyMarkdown,
    heroImageUrl,
    tags: tagsIn,
    publishMode,
    scheduledPublishAt: schedIn,
  } = parsed.data;
  const hero = (heroImageUrl ?? "").trim();
  if (hero) {
    const isHttps = /^https:\/\//i.test(hero);
    const isDataImage = /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(hero);
    if (!isHttps && !isDataImage) {
      return NextResponse.json(
        {
          error:
            "Photo must be an https link or an uploaded JPEG/PNG/WebP image.",
        },
        { status: 400 }
      );
    }
    if (hero.length > MAX_HERO_IMAGE_CHARS) {
      return NextResponse.json(
        {
          error:
            "That image is too large to upload. Try a smaller photo or one saved with lower quality.",
        },
        { status: 400 }
      );
    }
  }

  const editors = (process.env.EDITOR_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const isEditor = editors.includes(session.user.email.toLowerCase());

  let status: ArticleStatus = article.status;
  let scheduledPublishAt = article.scheduledPublishAt ?? "";

  if (publishMode === "draft") {
    status = "draft";
    scheduledPublishAt = "";
  } else if (publishMode === "scheduled") {
    const s = (schedIn ?? "").trim();
    if (!s) {
      return NextResponse.json(
        { error: "Choose a date and time for scheduled posts." },
        { status: 400 }
      );
    }
    const at = new Date(s).getTime();
    if (Number.isNaN(at) || at <= Date.now()) {
      return NextResponse.json(
        { error: "Scheduled time must be in the future." },
        { status: 400 }
      );
    }
    status = "scheduled";
    scheduledPublishAt = new Date(s).toISOString();
  } else if (publishMode === "publish") {
    status = isEditor ? "published" : "pending";
    scheduledPublishAt = "";
  }

  const tags =
    tagsIn !== undefined
      ? tagsIn
          .map((t) => t.trim().toLowerCase())
          .filter((t) => ALLOWED_TAG_IDS.has(t))
      : article.tags;

  const rowNumber = articleSheetRowNumber(articles, id);
  if (rowNumber === null) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const updated: Article = {
    ...article,
    updatedAt: new Date().toISOString(),
    title,
    excerpt,
    bodyMarkdown,
    slug: article.slug,
    heroImageUrl: hero,
    status,
    tags,
    scheduledPublishAt,
    authorImageUrl:
      (session.user.image ?? "").trim() || article.authorImageUrl || "",
  };

  try {
    const ok = await updateArticleRowAt(rowNumber, updated);
    if (!ok) {
      return NextResponse.json(
        { error: "We couldn’t save your changes. Please try again." },
        { status: 502 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "We couldn’t save your changes. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ slug: updated.slug, status: updated.status });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSheetsConfigured()) {
    return NextResponse.json(
      { error: "Deleting is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const { id } = await context.params;
  const articles = await fetchAllArticles();
  const article = articles.find((a) => a.id === id);
  if (!article) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
  if (!isOwner(session.user.email, article)) {
    return NextResponse.json(
      { error: "You can only delete your own posts." },
      { status: 403 }
    );
  }

  try {
    const ok = await deleteArticleById(id);
    if (!ok) {
      return NextResponse.json(
        { error: "We couldn’t delete this post. Please try again." },
        { status: 502 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "We couldn’t delete this post. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
