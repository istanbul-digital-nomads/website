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
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-900 dark:bg-green-900/20">
        <p className="text-lg font-semibold text-green-800 dark:text-green-300">
          Thanks for reaching out!
        </p>
        <p className="mt-2 text-sm text-green-700 dark:text-green-400">
          We&apos;ll get back to you as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        placeholder="Your name"
        required
      />
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
