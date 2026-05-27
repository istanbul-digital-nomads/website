// Fetch real OSM boundary polygons + centroids for the Istanbul districts we
// don't already have, into public/data/neighborhood-borders.json (ODbL).
// Robust against Nominatim rate limits: backs off + retries on non-JSON.
import { readFileSync, writeFileSync } from "node:fs";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = {
  "User-Agent": "istanbul-nomads/1.0 (district borders; thomas@fodboldpakker.dk)",
};
const districts = [
  ["arnavutkoy", "Arnavutkoy", "Arnavutköy", "European"],
  ["avcilar", "Avcilar", "Avcılar", "European"],
  ["bagcilar", "Bagcilar", "Bağcılar", "European"],
  ["bahcelievler", "Bahcelievler", "Bahçelievler", "European"],
  ["basaksehir", "Basaksehir", "Başakşehir", "European"],
  ["bayrampasa", "Bayrampasa", "Bayrampaşa", "European"],
  ["beylikduzu", "Beylikduzu", "Beylikdüzü", "European"],
  ["buyukcekmece", "Buyukcekmece", "Büyükçekmece", "European"],
  ["catalca", "Catalca", "Çatalca", "European"],
  ["esenler", "Esenler", "Esenler", "European"],
  ["esenyurt", "Esenyurt", "Esenyurt", "European"],
  ["eyupsultan", "Eyupsultan", "Eyüpsultan", "European"],
  ["gaziosmanpasa", "Gaziosmanpasa", "Gaziosmanpaşa", "European"],
  ["gungoren", "Gungoren", "Güngören", "European"],
  ["kagithane", "Kagithane", "Kağıthane", "European"],
  ["kucukcekmece", "Kucukcekmece", "Küçükçekmece", "European"],
  ["sariyer", "Sariyer", "Sarıyer", "European"],
  ["silivri", "Silivri", "Silivri", "European"],
  ["sultangazi", "Sultangazi", "Sultangazi", "European"],
  ["zeytinburnu", "Zeytinburnu", "Zeytinburnu", "European"],
  ["adalar", "Adalar", "Adalar", "Asian"],
  ["beykoz", "Beykoz", "Beykoz", "Asian"],
  ["cekmekoy", "Cekmekoy", "Çekmeköy", "Asian"],
  ["kartal", "Kartal", "Kartal", "Asian"],
  ["maltepe", "Maltepe", "Maltepe", "Asian"],
  ["pendik", "Pendik", "Pendik", "Asian"],
  ["sancaktepe", "Sancaktepe", "Sancaktepe", "Asian"],
  ["sultanbeyli", "Sultanbeyli", "Sultanbeyli", "Asian"],
  ["sile", "Sile", "Şile", "Asian"],
  ["tuzla", "Tuzla", "Tuzla", "Asian"],
  ["umraniye", "Umraniye", "Ümraniye", "Asian"],
];
const fc = JSON.parse(
  readFileSync("public/data/neighborhood-borders.json", "utf8"),
);
const bySlug = new Map(fc.features.map((f) => [f.properties.slug, f]));
const markers = [];
const missing = [];
async function fetchHit(tr) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(tr + ", İstanbul, Türkiye")}&format=json&polygon_geojson=1&limit=1&countrycodes=tr`;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { headers: UA });
      const text = await res.text();
      if (text.trim().startsWith("[") || text.trim().startsWith("{")) {
        return JSON.parse(text)[0];
      }
      // rate-limited / error page - back off
      await sleep(8000);
    } catch {
      await sleep(8000);
    }
  }
  return null;
}
for (const [slug, name, tr, side] of districts) {
  if (bySlug.has(slug)) continue;
  const hit = await fetchHit(tr);
  if (hit && hit.geojson && /Polygon/.test(hit.geojson.type)) {
    bySlug.set(slug, {
      type: "Feature",
      properties: {
        slug,
        name,
        side,
        osm_id: hit.osm_id,
        osm_type: hit.osm_type,
        display_name: hit.display_name,
      },
      geometry: hit.geojson,
    });
    markers.push({
      slug,
      name,
      side,
      lng: +(+hit.lon).toFixed(4),
      lat: +(+hit.lat).toFixed(4),
    });
    console.log(`OK   ${slug}`);
  } else {
    missing.push(slug);
    console.log(`MISS ${slug}`);
  }
  await sleep(2500);
}
fc.features = [...bySlug.values()];
writeFileSync("public/data/neighborhood-borders.json", JSON.stringify(fc));
writeFileSync("/tmp/district-markers.json", JSON.stringify(markers, null, 2));
console.log(
  `\nDONE borders=${fc.features.length} added=${markers.length} missing=${missing.join(",") || "none"}`,
);
