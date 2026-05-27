// Fetch real Istanbul ferry data from OSM (ODbL) into public/data/ferries.json:
//  - ports (iskele): amenity=ferry_terminal, named, deduped to distinct piers
//  - routes: route=ferry relation geometries (the actual sea paths)
// Mirror fallback + retry to survive Overpass rate limits. Real data only.
import { writeFileSync } from "node:fs";

const MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BBOX = "40.80,27.90,41.65,30.00"; // s,w,n,e - Istanbul province

async function overpass(query) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const url = MIRRORS[attempt % MIRRORS.length];
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "istanbul-nomads/1.0 (ferries; thomas@fodboldpakker.dk)",
          Accept: "application/json",
        },
        body: "data=" + encodeURIComponent(query),
      });
      const text = await res.text();
      if (text.trim().startsWith("{")) return JSON.parse(text);
      console.log(`  mirror ${url} busy, backing off`);
      await sleep(10000);
    } catch (e) {
      console.log(`  ${url} error ${e.message}`);
      await sleep(10000);
    }
  }
  throw new Error("all overpass mirrors failed");
}

// --- Ports (iskele) ---
const portsRaw = await overpass(
  `[out:json][timeout:60];(node["amenity"="ferry_terminal"](${BBOX});way["amenity"="ferry_terminal"](${BBOX}););out center tags;`,
);
const seen = [];
const ports = [];
for (const e of portsRaw.elements) {
  const name = e.tags?.name;
  if (!name) continue;
  const lat = e.lat ?? e.center?.lat;
  const lon = e.lon ?? e.center?.lon;
  if (lat == null || lon == null) continue;
  // dedupe distinct piers within ~150m
  if (seen.some((p) => Math.abs(p.lat - lat) < 0.0015 && Math.abs(p.lon - lon) < 0.0015)) continue;
  seen.push({ lat, lon });
  ports.push({
    name: name.replace(/\s*(İskelesi|Iskelesi|İskele|Vapur İskelesi)\s*$/i, "").trim(),
    lng: +lon.toFixed(5),
    lat: +lat.toFixed(5),
  });
}
console.log(`ports: ${portsRaw.elements.length} raw -> ${ports.length} distinct named`);
await sleep(3000);

// --- Routes (actual ferry paths) ---
let routeFeatures = [];
try {
  const routesRaw = await overpass(
    `[out:json][timeout:90];relation["route"="ferry"](${BBOX});out geom;`,
  );
  for (const rel of routesRaw.elements) {
    const lines = (rel.members || [])
      .filter((m) => m.type === "way" && Array.isArray(m.geometry) && m.geometry.length > 1)
      .map((m) => m.geometry.map((g) => [+g.lon.toFixed(5), +g.lat.toFixed(5)]));
    if (!lines.length) continue;
    routeFeatures.push({
      type: "Feature",
      properties: { name: rel.tags?.name || rel.tags?.ref || String(rel.id), operator: rel.tags?.operator || null },
      geometry: { type: "MultiLineString", coordinates: lines },
    });
  }
  console.log(`routes: ${routesRaw.elements.length} relations -> ${routeFeatures.length} with geometry`);
} catch (e) {
  console.log("routes fetch failed:", e.message);
}

const out = {
  ports,
  routes: { type: "FeatureCollection", features: routeFeatures },
};
writeFileSync("public/data/ferries.json", JSON.stringify(out));
console.log(`\nDONE ports=${ports.length} routeFeatures=${routeFeatures.length}`);
