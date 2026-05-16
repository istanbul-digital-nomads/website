import Image from "next/image";
import { cn } from "@/lib/utils";

interface Attendee {
  member_id: string;
  display_name: string;
  avatar_url: string | null;
}

interface Props {
  attendees: Attendee[];
  max?: number;
  size?: number;
  className?: string;
}

export function PlanAttendeeStack({
  attendees,
  max = 4,
  size = 28,
  className,
}: Props) {
  const visible = attendees.slice(0, max);
  const overflow = Math.max(0, attendees.length - max);
  if (!visible.length && !overflow) return null;

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-2">
        {visible.map((a) => (
          <span
            key={a.member_id}
            className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-ink-1 bg-ink-3 text-[10px] font-medium uppercase text-paper-mute"
            style={{ width: size, height: size }}
            title={a.display_name}
          >
            {a.avatar_url ? (
              <Image
                src={a.avatar_url}
                alt={a.display_name}
                width={size}
                height={size}
                className="h-full w-full object-cover"
              />
            ) : (
              a.display_name.charAt(0)
            )}
          </span>
        ))}
      </div>
      {overflow > 0 && (
        <span className="ms-2 font-mono text-[10px] uppercase tracking-wide text-paper-mute">
          +{overflow}
        </span>
      )}
    </div>
  );
}
