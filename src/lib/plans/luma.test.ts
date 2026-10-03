import { describe, it, expect } from "vitest";
import { parseLumaUrl, parseEventFromJsonLd, toIstanbulDateTime } from "./luma";

describe("parseLumaUrl", () => {
  it("accepts a bare slug link", () => {
    expect(parseLumaUrl("https://lu.ma/abc123")).toEqual({
      slug: "abc123",
      canonicalUrl: "https://lu.ma/abc123",
    });
  });

  it("accepts the /e/ id form", () => {
    expect(parseLumaUrl("https://lu.ma/e/evt-XyZ_9")).toEqual({
      slug: "evt-XyZ_9",
      canonicalUrl: "https://lu.ma/e/evt-XyZ_9",
    });
  });

  it("tolerates a missing protocol and www host", () => {
    expect(parseLumaUrl("www.lu.ma/abc123")?.canonicalUrl).toBe(
      "https://lu.ma/abc123",
    );
  });

  it("accepts the luma.com domain (Luma serves events there too)", () => {
    expect(parseLumaUrl("https://luma.com/0hcbnhuh")).toEqual({
      slug: "0hcbnhuh",
      canonicalUrl: "https://lu.ma/0hcbnhuh",
    });
  });

  it("strips tracking query params", () => {
    expect(parseLumaUrl("https://lu.ma/abc123?tk=foo&utm_source=x")).toEqual({
      slug: "abc123",
      canonicalUrl: "https://lu.ma/abc123",
    });
  });

  it("rejects non-luma hosts", () => {
    expect(parseLumaUrl("https://eventbrite.com/e/123")).toBeNull();
    expect(parseLumaUrl("https://lu.ma.evil.com/abc")).toBeNull();
  });

  it("rejects deeper management paths and junk", () => {
    expect(parseLumaUrl("https://lu.ma/abc/manage")).toBeNull();
    expect(parseLumaUrl("https://lu.ma/")).toBeNull();
    expect(parseLumaUrl("not a url")).toBeNull();
    expect(parseLumaUrl("")).toBeNull();
  });
});

describe("parseEventFromJsonLd", () => {
  const html = `
    <html><head>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "Istanbul Nomads Meetup",
      "startDate": "2026-07-03T19:00:00+03:00",
      "endDate": "2026-07-03T22:00:00+03:00",
      "image": ["https://cdn.lu.ma/cover.png"],
      "location": {
        "@type": "Place",
        "name": "Kadikoy Hall",
        "geo": { "@type": "GeoCoordinates", "latitude": 40.99, "longitude": 29.02 }
      }
    }
    </script>
    </head></html>`;

  it("pulls title, times, venue and geo out of the Event node", () => {
    const ev = parseEventFromJsonLd(html);
    expect(ev?.title).toBe("Istanbul Nomads Meetup");
    expect(ev?.startsAt).toBe("2026-07-03T19:00:00+03:00");
    expect(ev?.endsAt).toBe("2026-07-03T22:00:00+03:00");
    expect(ev?.venueName).toBe("Kadikoy Hall");
    expect(ev?.lat).toBe(40.99);
    expect(ev?.lng).toBe(29.02);
    expect(ev?.coverUrl).toBe("https://cdn.lu.ma/cover.png");
  });

  it("finds an Event wrapped in an @graph array", () => {
    const graph = `<script type="application/ld+json">
      {"@graph":[{"@type":"WebSite"},{"@type":"SocialEvent","name":"Graphed"}]}
    </script>`;
    expect(parseEventFromJsonLd(graph)?.title).toBe("Graphed");
  });

  it("finds an Event nested inside an ItemList (calendar shape)", () => {
    const list = `<script type="application/ld+json">
      {"@type":"ItemList","itemListElement":[
        {"@type":"ListItem","item":{"@type":"Event","name":"Nested Run","startDate":"2026-07-03T19:00:00+03:00"}}
      ]}
    </script>`;
    expect(parseEventFromJsonLd(list)?.title).toBe("Nested Run");
  });

  it("returns null when there's no event JSON-LD", () => {
    expect(
      parseEventFromJsonLd("<html><body>nothing</body></html>"),
    ).toBeNull();
  });

  it("ignores malformed JSON without throwing", () => {
    const bad = `<script type="application/ld+json">{ not json }</script>`;
    expect(parseEventFromJsonLd(bad)).toBeNull();
  });
});

describe("toIstanbulDateTime", () => {
  it("converts a +03:00 instant to the same wall clock", () => {
    expect(toIstanbulDateTime("2026-07-03T19:00:00+03:00")).toEqual({
      date: "2026-07-03",
      time: "19:00",
    });
  });

  it("converts a UTC instant into Istanbul local (UTC+3)", () => {
    expect(toIstanbulDateTime("2026-07-03T21:30:00Z")).toEqual({
      date: "2026-07-04",
      time: "00:30",
    });
  });

  it("returns null for bad input", () => {
    expect(toIstanbulDateTime("nope")).toBeNull();
    expect(toIstanbulDateTime(null)).toBeNull();
  });
});
