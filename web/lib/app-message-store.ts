export type AppMessageVariant = "success" | "error" | "warning" | "info";

export type AppMessageState =
  | { open: false }
  | {
      open: true;
      kind: "alert";
      variant: AppMessageVariant;
      title: string;
      description?: string;
    }
  | {
      open: true;
      kind: "confirm";
      title: string;
      description?: string;
      confirmLabel: string;
      cancelLabel: string;
      destructive: boolean;
      onConfirm: () => void | Promise<void>;
    };

let snapshot: AppMessageState = { open: false };
const listeners = new Set<() => void>();

export function subscribeAppMessage(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAppMessageSnapshot(): AppMessageState {
  return snapshot;
}

function emit() {
  for (const l of listeners) l();
}

function setSnapshot(next: AppMessageState) {
  snapshot = next;
  emit();
}

/** Centered alert (OK only). */
export function showAppAlert(
  variant: AppMessageVariant,
  title: string,
  description?: string
) {
  setSnapshot({ open: true, kind: "alert", variant, title, description });
}

/** Centered confirm (Cancel + action). */
export function showAppConfirm(options: {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}) {
  const {
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    destructive = true,
    onConfirm,
  } = options;
  setSnapshot({
    open: true,
    kind: "confirm",
    title,
    description,
    confirmLabel,
    cancelLabel,
    destructive,
    onConfirm,
  });
}

export function closeAppMessage() {
  setSnapshot({ open: false });
}
