import { toast } from "sonner";

// Branded toast presets for Istanbul Digital Nomads
// Glassy design with Turkey Red brand accent
// Usage: showToast.success("RSVP confirmed!") or showToast.error("Failed to save")

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

  auth(message: string) {
    toast(message, {
      description: "Sign in with Google to continue.",
      action: {
        label: "Sign In",
        onClick: () => (window.location.href = "/login"),
      },
    });
  },

  rsvp(eventTitle: string, status: "going" | "maybe" | "not_going") {
    const labels = {
      going: "You're going!",
      maybe: "Marked as maybe",
      not_going: "RSVP removed",
    };
    toast.success(labels[status], { description: eventTitle });
  },

  contact() {
    toast.success("Message sent!", {
      description: "We'll get back to you soon.",
    });
  },

  profileUpdated() {
    toast.success("Profile updated", {
      description: "Your changes have been saved.",
    });
  },
};
