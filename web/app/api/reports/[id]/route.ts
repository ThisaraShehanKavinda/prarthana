import { auth } from "@/auth";
import {
  findReportSheetRowNumber,
  isSheetsConfigured,
  updateReportStatusAtRow,
} from "@/lib/sheets";
import { isEditor } from "@/lib/editors";
import { NextResponse } from "next/server";
import { z } from "zod";

const idSchema = z.string().uuid();

const patchSchema = z.object({
  status: z.enum(["reviewed"]),
});

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email || !isEditor(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
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

  const row = await findReportSheetRowNumber(parsedId.data);
  if (row === null) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ok = await updateReportStatusAtRow(row, parsed.data.status);
  if (!ok) {
    return NextResponse.json({ error: "Could not update" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
