/** Two-letter hint for an author (e.g. "Thisara Kavinda" → "TK"). */
export function authorInitials(
  name: string | null | undefined,
  email: string | null | undefined
): string {
  const n = name?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const a = parts[0]?.[0] ?? "";
      const b = parts[parts.length - 1]?.[0] ?? "";
      return (a + b).toUpperCase().slice(0, 2);
    }
    if (parts.length === 1 && parts[0].length > 0) {
      return parts[0].slice(0, 2).toUpperCase();
    }
  }
  const e = email?.trim();
  if (e) {
    const local = e.split("@")[0] ?? "";
    const tokens = local.split(/[._-]+/).filter(Boolean);
    if (tokens.length >= 2) {
      const a = tokens[0]?.[0] ?? "";
      const b = tokens[tokens.length - 1]?.[0] ?? "";
      return (a + b).toUpperCase().slice(0, 2);
    }
    const alnum = local.replace(/[^a-zA-Z0-9]/g, "");
    if (alnum.length >= 2) return alnum.slice(0, 2).toUpperCase();
    if (local.length >= 1) return (local[0] + (local[1] ?? local[0])).toUpperCase();
    return (e[0] + (e[1] ?? "?")).toUpperCase();
  }
  return "?";
}
