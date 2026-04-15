import { auth } from "@/auth";
import {
  appendArticleRow,
  fetchAllArticles,
  isSheetsConfigured,
  slugExists,
} from "@/lib/sheets";
import { rateLimitKey } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { MAX_HERO_IMAGE_CHARS } from "@/lib/hero-image-constants";

const schema = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().min(10).max(800),
  bodyMarkdown: z.string().min(20).max(20000),
  heroImageUrl: z.string().max(MAX_HERO_IMAGE_CHARS).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSheetsConfigured()) {
    return NextResponse.json(
      { error: "Posting is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const limited = rateLimitKey(`article:${session.user.email}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { title, excerpt, bodyMarkdown, heroImageUrl } = parsed.data;
  const hero = (heroImageUrl ?? "").trim();
  if (hero) {
    const isHttps = /^https:\/\//i.test(hero);
    const isDataImage = /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(hero);
    if (!isHttps && !isDataImage) {
      return NextResponse.json(
        {
          error:
            "Hero image must be an https URL or a JPEG/PNG/WebP data URL from upload.",
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

  const articles = await fetchAllArticles();
  let base = slugify(title, { lower: true, strict: true });
  if (!base) base = `article-${uuidv4().slice(0, 8)}`;
  let slug = base;
  let n = 1;
  while (slugExists(articles, slug)) {
    slug = `${base}-${n++}`;
  }

  const now = new Date().toISOString();
  const editors = (process.env.EDITOR_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const status = editors.includes(session.user.email.toLowerCase())
    ? "published"
    : "pending";

  const row = [
    uuidv4(),
    now,
    now,
    session.user.email,
    session.user.name ?? "",
    title,
    slug,
    excerpt,
    bodyMarkdown,
    status,
    hero,
  ];

  try {
    await appendArticleRow(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "We couldn’t save your post. Please try again in a moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ slug, status });
}
