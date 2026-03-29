import { Users, Calendar, BookOpen, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";

const stats = [
  { label: "Community Members", value: "500+", icon: Users },
  { label: "Events Hosted", value: "80+", icon: Calendar },
  { label: "City Guides", value: "10", icon: BookOpen },
  { label: "Neighborhoods", value: "15+", icon: MapPin },
];

export function Stats() {
  return (
    <section className="border-y border-neutral-200 bg-neutral-50 py-12 dark:border-neutral-800 dark:bg-neutral-900/50">
      <Container>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto h-6 w-6 text-primary-600 dark:text-primary-400" />
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
