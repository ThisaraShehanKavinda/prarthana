import { auth } from "@/auth";
import { fetchNotificationsForEmail, isSheetsConfigured } from "@/lib/sheets";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSheetsConfigured()) {
    return NextResponse.json({ items: [], unreadCount: 0 });
  }

  const items = await fetchNotificationsForEmail(session.user.email, 80);
  const unreadCount = items.filter((n) => !n.readAt?.trim()).length;
  return NextResponse.json({ items, unreadCount });
}
