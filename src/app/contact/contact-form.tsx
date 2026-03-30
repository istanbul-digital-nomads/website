"use client";

import { useState, type FormEvent } from "react";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Will integrate with Resend API in Phase 2
    setSubmitted(true);
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
      <Button type="submit" className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}
