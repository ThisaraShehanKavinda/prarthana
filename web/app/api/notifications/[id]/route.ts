import { auth } from "@/auth";
import {
  fetchNotificationsForEmail,
  findNotificationSheetRowNumber,
  isSheetsConfigured,
  updateNotificationReadAtRow,
} from "@/lib/sheets";
import { NextResponse } from "next/server";
import { z } from "zod";

const idSchema = z.string().uuid();

export async function PATCH(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const { id } = await context.params;
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const mine = await fetchNotificationsForEmail(session.user.email, 200);
  const n = mine.find((x) => x.id === parsed.data);
  if (!n) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const row = await findNotificationSheetRowNumber(parsed.data);
  if (row === null) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ok = await updateNotificationReadAtRow(row, new Date().toISOString());
  if (!ok) {
    return NextResponse.json({ error: "Could not update" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
