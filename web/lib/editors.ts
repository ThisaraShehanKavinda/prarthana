export function editorEmailSet(): Set<string> {
  return new Set(
    (process.env.EDITOR_EMAILS ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isEditor(email: string | null | undefined): boolean {
  if (!email) return false;
  return editorEmailSet().has(email.toLowerCase());
}
