const buckets = new Map<string, { count: number; reset: number }>();

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;

export function rateLimitKey(
  key: string
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + WINDOW_MS });
    return { ok: true };
  }
  if (b.count >= MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((b.reset - now) / 1000)) };
  }
  b.count += 1;
  return { ok: true };
}
