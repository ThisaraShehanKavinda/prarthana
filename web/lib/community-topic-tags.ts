/** Curated topic ids stored on articles (comma-separated in Sheets). */
export const COMMUNITY_TOPIC_TAGS = [
  { id: "caregiver", label: "Caregiver" },
  { id: "treatment", label: "Treatment experience" },
  { id: "policy", label: "Policy & access" },
  { id: "science", label: "Science & research" },
  { id: "wellbeing", label: "Wellbeing & daily life" },
  { id: "advocacy", label: "Advocacy" },
] as const;

export type CommunityTopicId = (typeof COMMUNITY_TOPIC_TAGS)[number]["id"];

export function topicLabelForId(id: string): string {
  const t = COMMUNITY_TOPIC_TAGS.find((x) => x.id === id);
  return t?.label ?? id;
}
