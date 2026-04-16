import type { Comment } from "@/lib/types";
import { isEditor } from "@/lib/editors";

/** Hides `visibility: "hidden"` from everyone except the post author and the comment author. */
export function commentsVisibleToReader(
  comments: Comment[],
  articleAuthorEmail: string,
  readerEmail?: string | null
): Comment[] {
  if (isEditor(readerEmail)) return comments;
  const owner = readerEmail?.toLowerCase() ?? "";
  const postOwner = owner && owner === articleAuthorEmail.toLowerCase();
  return comments.filter((c) => {
    if (c.visibility !== "hidden") return true;
    if (postOwner) return true;
    if (owner && owner === c.authorEmail.toLowerCase()) return true;
    return false;
  });
}
