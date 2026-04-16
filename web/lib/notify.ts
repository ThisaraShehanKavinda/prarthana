import { toast } from "sonner";

/** App-wide toasts: success, error, warning, info (Sonner). */
export const notify = {
  success(message: string, description?: string) {
    return toast.success(message, description ? { description } : undefined);
  },
  error(message: string, description?: string) {
    return toast.error(message, description ? { description } : undefined);
  },
  warning(message: string, description?: string) {
    return toast.warning(message, description ? { description } : undefined);
  },
  info(message: string, description?: string) {
    return toast.info(message, description ? { description } : undefined);
  },
  loading(message: string) {
    return toast.loading(message);
  },
  dismiss(id: string | number) {
    toast.dismiss(id);
  },
  promise: toast.promise,
};

/**
 * Non-blocking confirmation (toast with action + cancel).
 * Use for destructive steps instead of window.confirm.
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

  toast.warning(title, {
    description,
    duration: 25_000,
    action: {
      label: confirmLabel,
      onClick: () => {
        void (async () => {
          try {
            await onConfirm();
          } catch (e) {
            console.error(e);
            notify.error("Something went wrong. Please try again.");
          }
        })();
      },
    },
    cancel: {
      label: cancelLabel,
      onClick: () => {},
    },
  });
}
