"use client";

import { useState, type FormEvent } from "react";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast.error("Could not send message", data.error);
        return;
      }

      setSubmitted(true);
      showToast.contact();
    } catch {
      showToast.error("Something went wrong", "Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary-200 bg-primary-50/80 p-8 text-center dark:border-primary-900/40 dark:bg-primary-900/20">
        <p className="text-lg font-semibold text-primary-800 dark:text-primary-300">
          Thanks for reaching out!
        </p>
        <p className="mt-2 text-sm text-primary-700 dark:text-primary-400">
          We&apos;ll get back to you as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Name" name="name" placeholder="Your name" required />
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
      />
      <Textarea
        label="Message"
        name="message"
        placeholder="How can we help?"
        required
      />
      <Button type="submit" loading={loading} className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}
