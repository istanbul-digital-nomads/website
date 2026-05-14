/**
 * Design System v2 - a not-to-scale schematic of the Bosphorus with the
 * ten neighborhoods plotted by side. Decorative orientation aid for the
 * neighborhoods index; positions are hand-placed, not geographic.
 */
const NODES: { slug: string; label: string; x: number; y: number }[] = [
  { slug: "besiktas", label: "Beşiktaş", x: 60, y: 64 },
  { slug: "nisantasi", label: "Nişantaşı", x: 32, y: 96 },
  { slug: "levent", label: "Levent", x: 70, y: 30 },
  { slug: "cihangir", label: "Cihangir", x: 92, y: 128 },
  { slug: "galata", label: "Karaköy / Galata", x: 108, y: 158 },
  { slug: "balat", label: "Balat", x: 40, y: 222 },
  { slug: "uskudar", label: "Üsküdar", x: 286, y: 92 },
  { slug: "kadikoy", label: "Kadıköy", x: 298, y: 198 },
  { slug: "moda", label: "Moda", x: 316, y: 238 },
  { slug: "atasehir", label: "Atasehir", x: 352, y: 224 },
];

export function BosphorusSchematic({ label }: { label: string }) {
  return (
    <div className="border border-ink-3 bg-ink-2 p-4">
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider">
        <span className="text-paper-mute">{label}</span>
        <span className="text-paper-faint">not to scale</span>
      </div>
      <div className="relative mt-3 h-[280px] border border-dashed border-ink-4">
        <svg
          viewBox="0 0 380 280"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M180,0 C170,60 220,110 200,160 C180,210 230,250 220,280"
            stroke="rgb(var(--bosphorus))"
            strokeWidth="14"
            fill="none"
            opacity="0.35"
          />
          <path
            d="M180,0 C170,60 220,110 200,160 C180,210 230,250 220,280"
            stroke="rgb(var(--bosphorus))"
            strokeWidth="1"
            strokeDasharray="3 4"
            fill="none"
          />
        </svg>
        <div className="absolute left-4 top-4 font-mono text-[9.5px] uppercase text-paper-faint">
          Europe ←
        </div>
        <div className="absolute right-4 top-4 font-mono text-[9.5px] uppercase text-paper-faint">
          → Asia
        </div>
        {NODES.map((node) => (
          <div
            key={node.slug}
            className="absolute flex items-center gap-1.5"
            style={{ left: node.x, top: node.y }}
          >
            <span className="h-2 w-2 rounded-full bg-terracotta shadow-[0_0_0_3px_rgb(var(--ink-2))]" />
            <span className="whitespace-nowrap font-mono text-[9.5px] text-paper">
              {node.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
