import { CommunityVisitProvider } from "@/components/community/community-visit-provider";

export const revalidate = 60;

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CommunityVisitProvider>{children}</CommunityVisitProvider>;
}
