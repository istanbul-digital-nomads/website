// Builds typed district entries for src/lib/map-neighborhoods.ts from the
// fetched coordinates (/tmp/district-markers.json) + honest geographic blurbs,
// and inserts them before the closing `];`. Districts are tier "district"
// (rendered as light dots). Run AFTER fetch-district-borders.mjs.
import { readFileSync, writeFileSync } from "node:fs";

const vibes = {
  arnavutkoy: "Far northwest, airport-adjacent, rural edges and new estates",
  avcilar: "Western Marmara coast, university crowd, metrobus commute",
  bagcilar: "Dense inland west, residential and working neighborhoods",
  bahcelievler: "Inland west, residential, metro and metrobus access",
  basaksehir: "Newer northwest suburbs, planned estates, families",
  bayrampasa: "Inland by the old walls, residential, transport links",
  beylikduzu: "Far west coast, modern estates, seaside parks, families",
  buyukcekmece: "Far west lakeside and coast, weekend houses, lower density",
  catalca: "Rural far northwest, farmland and forest, village pace",
  esenler: "Inland west, residential, the main intercity bus terminal",
  esenyurt: "Far west, fast-growing dense residential, very affordable",
  eyupsultan: "Golden Horn up to the northern forests, historic and green",
  gaziosmanpasa: "Inland north, dense residential, working neighborhoods",
  gungoren: "Small dense inland district, textile trade, central west",
  kagithane: "Central valley, fast-gentrifying, new offices near Levent",
  kucukcekmece: "Western lakeside, dense and mixed, lake parks",
  sariyer: "Northern Bosphorus, forests, fishing villages, upscale coast",
  silivri: "Far western Marmara coast, summer houses, open country",
  sultangazi: "Northern inland, residential, newer working districts",
  zeytinburnu: "Marmara coast by the walls, dense, coastal park, transport",
  adalar: "The Princes' Islands - car-free, ferries, pine and sea",
  beykoz: "Northern Asian Bosphorus, forests, quiet waterfront villages",
  cekmekoy: "Northeast suburbs, forest edges, newer low-rise estates",
  kartal: "Southeast Marmara coast, redeveloping, marina and metro",
  maltepe: "Asian coast, long seaside park, residential, metro",
  pendik: "Far southeast, coast and Sabiha Gokcen airport, growing fast",
  sancaktepe: "Inland northeast, newer residential, expanding",
  sultanbeyli: "Far inland southeast, affordable residential",
  sile: "Far Black Sea coast, beaches and forest, weekend getaway",
  tuzla: "Far southeast tip, shipyards, marinas, university campuses",
  umraniye: "Inland Asian hub, business towers, dense residential, metro",
};
const palette = [
  ["#f39c12", "bg-accent-warm text-neutral-950"],
  [
    "#737373",
    "bg-neutral-200 text-neutral-800 dark:bg-[#3c2d24] dark:text-[#d5dce3]",
  ],
  ["#c0392b", "bg-primary-500 text-white"],
  ["#27ae60", "bg-accent-green text-white"],
  [
    "#1a1a2e",
    "bg-neutral-900 text-white dark:bg-neutral-200 dark:text-neutral-900",
  ],
];

const markers = JSON.parse(readFileSync("/tmp/district-markers.json", "utf8"));
const entries = markers.map((m, i) => {
  const [color, bgClass] = palette[i % palette.length];
  const vibe = vibes[m.slug] || `${m.side}-side Istanbul district`;
  return `  {
    slug: "${m.slug}",
    name: "${m.name}",
    lng: ${m.lng},
    lat: ${m.lat},
    vibe: "${vibe}",
    side: "${m.side}",
    color: "${color}",
    bgClass: "${bgClass}",
    labelSide: "right",
    hasBorder: true,
    tier: "district",
  },`;
});

const path = "src/lib/map-neighborhoods.ts";
let src = readFileSync(path, "utf8");
const marker = "\n];\n"; // end of the mapNeighborhoods array
const idx = src.lastIndexOf(marker);
src = src.slice(0, idx) + "\n" + entries.join("\n") + src.slice(idx);
writeFileSync(path, src);
console.log(`Inserted ${entries.length} district entries into ${path}`);
