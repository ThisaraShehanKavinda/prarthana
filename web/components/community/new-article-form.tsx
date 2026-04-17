"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { encodeImageFileToHeroDataUrl } from "@/lib/encode-hero-image-client";
import { plainTextFromMarkdown } from "@/lib/markdown-preview";
import { ImagePlus, X } from "lucide-react";
import type { Article } from "@/lib/types";
import { COMMUNITY_TOPIC_TAGS } from "@/lib/community-topic-tags";
import { notify } from "@/lib/notify";
import { AppNotice } from "@/components/ui/app-notice";

type Mode = "create" | "edit";

export function NewArticleForm({
  mode = "create",
  articleId,
  initial,
}: {
  mode?: Mode;
  /** Required when mode is `edit` */
  articleId?: string;
  initial?: Pick<
    Article,
    "title" | "excerpt" | "bodyMarkdown" | "heroImageUrl" | "slug" | "tags"
  >;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.bodyMarkdown ?? "");
  const [hero, setHero] = useState(initial?.heroImageUrl ?? "");
  const [heroPreview, setHeroPreview] = useState<string | null>(
    initial?.heroImageUrl?.trim() ? initial.heroImageUrl : null
  );
  const [encodingImage, setEncodingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [publishMode, setPublishMode] = useState<"publish" | "draft" | "scheduled">(
    "publish"
  );
  const [scheduleAt, setScheduleAt] = useState("");

  function toggleTag(id: string) {
    setTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id].slice(0, 6)
    );
  }

  useEffect(() => {
    if (mode === "edit") return;
    if (!excerpt.trim() && body.trim().length >= 10) {
      let auto = plainTextFromMarkdown(body, 220);
      if (auto.length < 10) {
        auto = body.replace(/\s+/g, " ").trim().slice(0, 120) || "Community post";
      }
      setExcerpt(auto);
    }
  }, [body, excerpt, mode]);

  async function onHeroFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setEncodingImage(true);
    try {
      const dataUrl = await encodeImageFileToHeroDataUrl(file);
      setHero(dataUrl);
      setHeroPreview(dataUrl);
    } catch (err) {
      setHero("");
      setHeroPreview(null);
      const msg = err instanceof Error ? err.message : "Could not process image";
      setError(msg);
      notify.warning("Image not added", msg);
    } finally {
      setEncodingImage(false);
    }
  }

  function clearHero() {
    setHero("");
    setHeroPreview(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    let excerptFinal = excerpt.trim() || plainTextFromMarkdown(body, 800);
    if (excerptFinal.length < 10) {
      excerptFinal =
        body.replace(/\s+/g, " ").trim().slice(0, 120) || "Community post";
    }
    setLoading(true);
    try {
      if (mode === "edit") {
        if (!articleId) {
          const msg = "Missing post id";
          setError(msg);
          notify.error("Something went wrong", msg);
          setLoading(false);
          return;
        }
        const res = await fetch(`/api/articles/${articleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            excerpt: excerptFinal,
            bodyMarkdown: body,
            heroImageUrl: hero || undefined,
            tags,
          }),
        });
        const data = (await res.json()) as { slug?: string; error?: string };
        if (!res.ok) {
          const msg = data.error ?? "Failed to save";
          setError(msg);
          notify.error("Could not save post", msg);
          setLoading(false);
          return;
        }
        notify.success("Post saved");
        const slug = data.slug ?? initial?.slug;
        if (slug) router.push(`/community/${slug}`);
        else router.push("/community");
      } else {
        const schedIso =
          publishMode === "scheduled" && scheduleAt.trim()
            ? new Date(scheduleAt).toISOString()
            : undefined;
        const res = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            excerpt: excerptFinal,
            bodyMarkdown: body,
            heroImageUrl: hero || undefined,
            publishMode,
            scheduledPublishAt: schedIso,
            tags,
          }),
        });
        const data = (await res.json()) as {
          slug?: string;
          status?: string;
          error?: string;
        };
        if (!res.ok) {
          const msg = data.error ?? "Failed to publish";
          setError(msg);
          notify.error("Could not publish post", msg);
          setLoading(false);
          return;
        }
        if (data.status === "draft") notify.success("Draft saved");
        else if (data.status === "scheduled") notify.success("Post scheduled");
        else notify.success("Post submitted");
        if (data.status === "draft") router.push("/community/drafts");
        else if (data.slug) router.push(`/community/${data.slug}`);
        else router.push("/community");
      }
    } catch {
      setError("Network error");
      notify.error("Network error", "Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const name = session?.user?.name || session?.user?.email || "You";
  const initialLetter = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const heading = mode === "edit" ? "Edit post" : "Create post";
  const submitLabel =
    mode === "edit"
      ? loading
        ? "Saving…"
        : "Save changes"
      : loading
        ? publishMode === "draft"
          ? "Saving…"
          : "Posting…"
        : publishMode === "draft"
          ? "Save draft"
          : publishMode === "scheduled"
            ? "Schedule post"
            : "Post";

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-lg lg:max-w-2xl">
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-lg">
        <div className="border-b border-[var(--border)] px-4 py-3 text-center text-sm font-semibold text-[var(--foreground)]">
          {heading}
        </div>

        <div className="flex gap-3 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/15 text-sm font-bold text-[var(--primary)]">
            {initialLetter}
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-sm font-medium text-[var(--foreground)]">{name}</p>
            <Textarea
              placeholder="What's on your mind?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              minLength={20}
              maxLength={20000}
              rows={8}
              className="min-h-[180px] resize-none border-0 bg-transparent p-0 text-[17px] leading-relaxed shadow-none focus-visible:ring-0"
            />
            <div>
              <Label htmlFor="title" className="text-xs text-[var(--muted-foreground)]">
                Headline (shown bold in the feed)
              </Label>
              <Input
                id="title"
                placeholder="Add a headline…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={3}
                maxLength={200}
                className="mt-1 rounded-xl border-[var(--border)]"
              />
            </div>
            <div>
              <Label htmlFor="excerpt" className="text-xs text-[var(--muted-foreground)]">
                Short preview (auto-fills from your text — edit if you want)
              </Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                minLength={10}
                maxLength={800}
                rows={2}
                className="mt-1 rounded-xl border-[var(--border)] text-sm"
              />
            </div>
          </div>
        </div>

        {(heroPreview || hero) && (
          <div className="relative mx-4 mb-2 overflow-hidden rounded-2xl border border-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroPreview || hero}
              alt=""
              className="max-h-64 w-full object-cover"
            />
            <button
              type="button"
              onClick={clearHero}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[var(--border)] px-3 py-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--muted)]">
            <ImagePlus className="h-5 w-5" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={onHeroFile}
              disabled={encodingImage || loading}
            />
          </label>
          {encodingImage && (
            <span className="text-xs text-[var(--muted-foreground)]">Processing…</span>
          )}
        </div>

        <div className="border-t border-[var(--border)] px-4 py-2">
          <Label htmlFor="hero-url" className="text-xs text-[var(--muted-foreground)]">
            Or paste image URL (https)
          </Label>
          <Input
            id="hero-url"
            type="url"
            placeholder="https://…"
            value={hero.startsWith("data:") ? "" : hero}
            onChange={(e) => {
              const v = e.target.value.trim();
              setHero(v);
              setHeroPreview(v || null);
            }}
            disabled={Boolean(hero.startsWith("data:"))}
            maxLength={2000}
            className="mt-1 rounded-xl text-sm"
          />
        </div>

        {mode === "create" ? (
          <div className="space-y-3 border-t border-[var(--border)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              Topics (optional)
            </p>
            <div className="flex flex-wrap gap-2">
              {COMMUNITY_TOPIC_TAGS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTag(t.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    tags.includes(t.id)
                      ? "border-[var(--primary)] bg-[var(--primary)]/12 text-[var(--primary)]"
                      : "border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              When to post
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 has-[:checked]:border-[var(--primary)]">
                <input
                  type="radio"
                  name="pub"
                  checked={publishMode === "publish"}
                  onChange={() => setPublishMode("publish")}
                />
                Publish now (may be reviewed first)
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 has-[:checked]:border-[var(--primary)]">
                <input
                  type="radio"
                  name="pub"
                  checked={publishMode === "draft"}
                  onChange={() => setPublishMode("draft")}
                />
                Save as draft
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 has-[:checked]:border-[var(--primary)]">
                <input
                  type="radio"
                  name="pub"
                  checked={publishMode === "scheduled"}
                  onChange={() => setPublishMode("scheduled")}
                />
                Schedule
              </label>
              {publishMode === "scheduled" ? (
                <input
                  type="datetime-local"
                  value={scheduleAt}
                  onChange={(e) => setScheduleAt(e.target.value)}
                  className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
                />
              ) : null}
            </div>
          </div>
        ) : (
          <div className="space-y-3 border-t border-[var(--border)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {COMMUNITY_TOPIC_TAGS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTag(t.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    tags.includes(t.id)
                      ? "border-[var(--primary)] bg-[var(--primary)]/12 text-[var(--primary)]"
                      : "border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {error ? (
          <div className="px-4 pb-2">
            <AppNotice variant="error">{error}</AppNotice>
          </div>
        ) : null}

        <div className="p-3">
          <Button
            type="submit"
            disabled={loading || encodingImage}
            className="h-11 w-full rounded-full text-base font-semibold"
          >
            {submitLabel}
          </Button>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">
        You can use simple formatting in your story (lists, links, bold text). Your
        post may be reviewed before it appears on the feed.
      </p>
    </form>
  );
}
