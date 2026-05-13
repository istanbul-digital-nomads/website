import { toast } from "sonner";

// Branded toast presets. Messages and descriptions are passed in by callers
// so they can be localized via `useTranslations`. No literal English copy
// lives in this module.
// Usage: showToast.success(t("toast.success"), t("toast.successBody"))

export const showToast = {
  success(message: string, description?: string) {
    toast.success(message, { description });
  },

  error(message: string, description?: string) {
    toast.error(message, { description });
  },

  info(message: string, description?: string) {
    toast(message, { description });
  },

  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    },
  ) {
    return toast.promise(promise, messages);
  },
};
