import { auth } from "@/auth";
import { SiteHeaderClient } from "@/components/layout/site-header-client";

const nav = [
  { href: "/learn", label: "Learn" },
  { href: "/community", label: "Community" },
];

export async function SiteHeader() {
  const session = await auth();
  return <SiteHeaderClient session={session} nav={nav} />;
}
