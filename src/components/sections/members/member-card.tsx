import Link from "next/link";
import Image from "next/image";
import type { MemberPublic } from "@/types/models";

/**
 * Design System v2 Phase 5a - one member in the directory grid. Rectangular
 * dark card; the avatar is a real photo when present, otherwise a tinted
 * initial block (honest placeholder, no fake faces).
 */
export function MemberCard({ member }: { member: MemberPublic }) {
  const initial = (member.display_name || "?").trim().charAt(0).toUpperCase();
  return (
    <Link
      href={`/members/${member.id}`}
      className="group flex flex-col border border-ink-3 bg-ink-2 p-5 transition-colors duration-fast hover:border-ink-5"
    >
      <div className="relative aspect-square w-full overflow-hidden border border-ink-4 bg-ink-3">
        {member.avatar_url ? (
          <Image
            src={member.avatar_url}
            alt={member.display_name}
            fill
            sizes="(max-width: 640px) 50vw, 220px"
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center font-display text-5xl text-paper-faint">
            {initial}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-h4 text-paper transition-colors group-hover:text-terracotta">
        {member.display_name}
      </h3>
      {member.location ? (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
          {member.location}
        </p>
      ) : null}
      {member.bio ? (
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-paper-dim">
          {member.bio}
        </p>
      ) : null}
      {member.skills && member.skills.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {member.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="border border-ink-4 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wide text-paper-mute"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
