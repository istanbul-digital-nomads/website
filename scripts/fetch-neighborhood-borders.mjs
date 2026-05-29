// One-off data fetcher: pulls real OSM boundary polygons for each map
// neighborhood from Nominatim (ODbL) and writes a GeoJSON FeatureCollection to
// public/data/neighborhood-borders.json. Real data only - if a name has no
// polygon in OSM, it's skipped and reported (never fabricated).
//
// Run: node scripts/fetch-neighborhood-borders.mjs
import { writeFileSync } from "node:fs";

// slug + our map label + side + the best-match OSM query (Turkish names help).
const HOODS = [
  { slug: "galata", name: "Galata", side: "European", q: "Galata, Beyoğlu, İstanbul" },
  { slug: "karakoy", name: "Karakoy", side: "European", q: "Karaköy, Beyoğlu, İstanbul" },
  { slug: "beyoglu", name: "Beyoglu", side: "European", q: "Beyoğlu, İstanbul" },
  { slug: "cihangir", name: "Cihangir", side: "European", q: "Cihangir Mahallesi, Beyoğlu, İstanbul" },
  { slug: "besiktas", name: "Besiktas", side: "European", q: "Beşiktaş, İstanbul" },
  { slug: "nisantasi", name: "Nisantasi", side: "European", q: "Nişantaşı, Şişli, İstanbul" },
  { slug: "sisli", name: "Sisli", side: "European", q: "Şişli, İstanbul" },
  { slug: "levent", name: "Levent", side: "European", q: "Levent, Beşiktaş, İstanbul" },
  { slug: "maslak", name: "Maslak", side: "European", q: "Maslak, Sarıyer, İstanbul" },
  { slug: "bebek", name: "Bebek", side: "European", q: "Bebek, Beşiktaş, İstanbul" },
  { slug: "balat", name: "Balat", side: "European", q: "Balat, Fatih, İstanbul" },
  { slug: "fatih", name: "Fatih", side: "European", q: "Fatih, İstanbul" },
  { slug: "bakirkoy", name: "Bakirkoy", side: "European", q: "Bakırköy, İstanbul" },
  { slug: "kadikoy", name: "Kadikoy", side: "Asian", q: "Kadıköy, İstanbul" },
  { slug: "moda", name: "Moda", side: "Asian", q: "Moda, Kadıköy, İstanbul" },
  { slug: "caddebostan", name: "Caddebostan", side: "Asian", q: "Caddebostan, Kadıköy, İstanbul" },
  { slug: "bostanci", name: "Bostanci", side: "Asian", q: "Bostancı, Kadıköy, İstanbul" },
  { slug: "uskudar", name: "Uskudar", side: "Asian", q: "Üsküdar, İstanbul" },
  { slug: "atasehir", name: "Atasehir", side: "Asian", q: "Ataşehir, İstanbul" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const features = [];
const missing = [];

for (const h of HOODS) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(h.q)}&format=json&polygon_geojson=1&limit=1&countrycodes=tr`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "istanbul-nomads/1.0 (map borders, contact: thomas@fodboldpakker.dk)" },
    });
    const data = await res.json();
    const hit = data[0];
    if (hit && hit.geojson && /Polygon/.test(hit.geojson.type)) {
      features.push({
        type: "Feature",
        properties: {
          slug: h.slug,
          name: h.name,
          side: h.side,
          osm_id: hit.osm_id,
          osm_type: hit.osm_type,
          display_name: hit.display_name,
        },
        geometry: hit.geojson,
      });
      console.log(`OK   ${h.slug.padEnd(12)} <- ${hit.display_name.slice(0, 60)} (${hit.geojson.type})`);
    } else {
      missing.push(h.slug);
      console.log(`MISS ${h.slug.padEnd(12)} (no polygon for "${h.q}")`);
    }
  } catch (e) {
    missing.push(h.slug);
    console.log(`ERR  ${h.slug.padEnd(12)} ${e.message}`);
  }
  await sleep(1200); // Nominatim: max ~1 req/sec
}

const fc = { type: "FeatureCollection", features };
writeFileSync("public/data/neighborhood-borders.json", JSON.stringify(fc));
console.log(`\nWrote ${features.length} polygons; missing: ${missing.join(", ") || "none"}`);
