import { closeAppMessage, showAppAlert, showAppConfirm } from "@/lib/app-message-store";

/**
 * App-wide feedback: centered modal with dimmed backdrop (no toasts).
 * Maps to success / error / warning / info alerts.
 */
export const notify = {
  success(message: string, description?: string) {
    showAppAlert("success", message, description);
  },
  error(message: string, description?: string) {
    showAppAlert("error", message, description);
  },
  warning(message: string, description?: string) {
    showAppAlert("warning", message, description);
  },
  info(message: string, description?: string) {
    showAppAlert("info", message, description);
  },
  loading(message: string) {
    showAppAlert("info", message, "Please wait…");
  },
  dismiss() {
    closeAppMessage();
  },
  /** Not used in this app; prefer `async`/`await` + `notify.*`. */
  promise: () => {
    console.warn("[notify] promise() is not implemented.");
  },
};

/**
 * Centered confirm dialog (dimmed backdrop, focus in dialog).
 * Use for destructive steps instead of `window.confirm`.
 */
export function confirmDestructive(options: {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
}): void {
  const {
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
  } = options;

  showAppConfirm({
    title,
    description,
    confirmLabel,
    cancelLabel,
    destructive: true,
    onConfirm,
  });
}
