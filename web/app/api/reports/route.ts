import { auth } from "@/auth";
import {
  appendReportRow,
  fetchOpenReports,
  isSheetsConfigured,
} from "@/lib/sheets";
import { isEditor } from "@/lib/editors";
import { rateLimitKey } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const postSchema = z.object({
  targetType: z.enum(["article", "comment"]),
  targetId: z.string().uuid(),
  articleId: z.string().uuid(),
  reasonCode: z.enum(["spam", "harassment", "misinformation", "off_topic", "other"]),
  note: z.string().max(500).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.email || !isEditor(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isSheetsConfigured()) {
    return NextResponse.json({ items: [] });
  }
  const items = await fetchOpenReports(200);
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const limited = rateLimitKey(`report:${session.user.email}`);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many reports." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const row = [
    uuidv4(),
    now,
    session.user.email,
    parsed.data.targetType,
    parsed.data.targetId,
    parsed.data.articleId,
    parsed.data.reasonCode,
    (parsed.data.note ?? "").trim(),
    "open",
  ];

  const ok = await appendReportRow(row);
  if (!ok) {
    return NextResponse.json(
      { error: "Could not save report (add content_reports tab?)." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
