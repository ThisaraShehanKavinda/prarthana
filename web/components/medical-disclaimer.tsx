import { AlertTriangle } from "lucide-react";

export function MedicalDisclaimer({ className }: { className?: string }) {
  return (
    <aside
      className={`rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100 ${className ?? ""}`}
      role="note"
    >
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="min-w-0">
          <strong>Educational use only.</strong> This site shares general health
          information and community stories. It is not medical advice, diagnosis,
          or treatment. Always consult a qualified clinician for personal
          decisions about cancer care.
        </p>
      </div>
    </aside>
  );
}
