"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

// Client wrapper for the event RSVP / book link (the event detail page is a
// server component). Fires the `event_rsvp` funnel event on click, then lets
// the normal anchor navigation proceed to Telegram / Stripe checkout.
export function EventRsvpLink({
  href,
  eventId,
  paid,
  className,
  children,
}: {
  href: string;
  eventId: string;
  paid: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track("event_rsvp", { event_id: eventId, paid })}
    >
      {children}
    </a>
  );
}
