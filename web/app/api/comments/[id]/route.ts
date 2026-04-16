import { auth } from "@/auth";
import {
  deleteCommentSheetRow,
  fetchAllArticles,
  fetchAllComments,
  findCommentSheetRowNumber,
  isSheetsConfigured,
  updateCommentVisibilityAtRow,
} from "@/lib/sheets";
import { appendNotifications } from "@/lib/comment-social";
import { isEditor } from "@/lib/editors";
import type { CommentVisibility } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";

const idSchema = z.string().uuid();

const patchSchema = z.object({
  visibility: z.enum(["public", "hidden"]),
});

function emEq(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
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
      { error: "Comments are temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const { id } = await context.params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
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

  const comments = await fetchAllComments();
  const comment = comments.find((c) => c.id === parsedId.data);
  if (!comment) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  const articles = await fetchAllArticles();
  const article = articles.find((a) => a.id === comment.articleId);
  if (!article) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const isPostAuthor = emEq(session.user.email, article.authorEmail);
  if (!isPostAuthor && !isEditor(session.user.email)) {
    return NextResponse.json(
      { error: "Only the post author or an editor can hide or unhide comments." },
      { status: 403 }
    );
  }

  const row = await findCommentSheetRowNumber(parsedId.data);
  if (row === null) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  const visibility = parsed.data.visibility as CommentVisibility;
  const wasHidden = comment.visibility === "hidden";
  const nowHidden = visibility === "hidden";
  try {
    const ok = await updateCommentVisibilityAtRow(row, visibility);
    if (!ok) {
      return NextResponse.json(
        { error: "Could not update comment." },
        { status: 502 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not update comment." },
      { status: 502 }
    );
  }

  if (nowHidden && !wasHidden) {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "http://localhost:3000";
    if (
      comment.authorEmail.toLowerCase() !== session.user.email!.toLowerCase()
    ) {
      await appendNotifications([
        {
          recipientEmail: comment.authorEmail,
          type: "mod_comment_hidden",
          title: "Your comment was hidden",
          body: `A moderator hid your comment on “${article.title.slice(0, 72)}${article.title.length > 72 ? "…" : ""}”.`,
          linkHref: `${base}/community/${article.slug}`,
        },
      ]);
    }
  }

  return NextResponse.json({ ok: true, visibility });
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
      { error: "Comments are temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const { id } = await context.params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const comments = await fetchAllComments();
  const comment = comments.find((c) => c.id === parsedId.data);
  if (!comment) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  const articles = await fetchAllArticles();
  const article = articles.find((a) => a.id === comment.articleId);
  if (!article) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const isCommentAuthor = emEq(session.user.email, comment.authorEmail);
  const isPostAuthor = emEq(session.user.email, article.authorEmail);
  if (!isCommentAuthor && !isPostAuthor && !isEditor(session.user.email)) {
    return NextResponse.json(
      {
        error:
          "You can only delete your own comments, comments on your post, or use an editor account.",
      },
      { status: 403 }
    );
  }

  const row = await findCommentSheetRowNumber(parsedId.data);
  if (row === null) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  try {
    const ok = await deleteCommentSheetRow(row);
    if (!ok) {
      return NextResponse.json(
        { error: "Could not delete comment." },
        { status: 502 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not delete comment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
