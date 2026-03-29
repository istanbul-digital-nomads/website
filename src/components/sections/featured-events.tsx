import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { type EventType } from "@/lib/constants";

interface FeaturedEvent {
  title: string;
  type: EventType;
  date: string;
  location: string;
  attendees: number;
}

const events: FeaturedEvent[] = [
  {
    title: "Weekly Coworking - Kadikoy",
    type: "coworking",
    date: "Every Wednesday",
    location: "MOB Kadikoy",
    attendees: 12,
  },
  {
    title: "Nomad Meetup - Rooftop Social",
    type: "social",
    date: "First Saturday monthly",
    location: "Beyoglu Rooftop",
    attendees: 35,
  },
  {
    title: "Workshop: Turkish Tax for Freelancers",
    type: "workshop",
    date: "Coming soon",
    location: "Online",
    attendees: 24,
  },
];

export function FeaturedEvents() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Upcoming Events</SectionTitle>
        <SectionDescription>
          Join our regular meetups, coworking sessions, and workshops.
        </SectionDescription>
      </SectionHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.title} hoverable>
            <CardContent>
              <Badge variant={event.type} className="mb-3">
                {event.type}
              </Badge>
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <div className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {event.attendees} attending
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
