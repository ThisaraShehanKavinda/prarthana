"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/notify";

const REASONS = [
  { id: "spam", label: "Spam or scam" },
  { id: "harassment", label: "Harassment or abuse" },
  { id: "misinformation", label: "Harmful misinformation" },
  { id: "off_topic", label: "Off topic" },
  { id: "other", label: "Other" },
] as const;

export function ReportContentDialog({
  open,
  onOpenChange,
  targetType,
  targetId,
  articleId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  targetType: "article" | "comment";
  targetId: string;
  articleId: string;
}) {
  const [reason, setReason] = useState<(typeof REASONS)[number]["id"]>("off_topic");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          articleId,
          reasonCode: reason,
          note: note.trim() || undefined,
        }),
      });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) {
        notify.error(j.error ?? "Could not send report");
        return;
      }
      notify.success("Report submitted", "Editors will review when they can.");
      onOpenChange(false);
      setNote("");
    } catch {
      notify.error("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report {targetType === "article" ? "post" : "comment"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-[var(--muted-foreground)]">Reason</Label>
            <div className="mt-1 flex flex-col gap-1">
              {REASONS.map((r) => (
                <label
                  key={r.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm has-[:checked]:border-[var(--primary)] has-[:checked]:bg-[var(--primary)]/10"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.id}
                    checked={reason === r.id}
                    onChange={() => setReason(r.id)}
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="rep-note">Details (optional)</Label>
            <Textarea
              id="rep-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={3}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={busy} onClick={() => void submit()}>
              {busy ? "Sending…" : "Submit report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
