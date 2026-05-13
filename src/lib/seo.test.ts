import { describe, expect, it } from "vitest";
import {
  SITE_URL,
  alternatesFor,
  faqPageSchema,
  jsonLdGraph,
  localeUrl,
  organizationSchema,
  websiteSchema,
} from "./seo";

describe("localeUrl", () => {
  it("returns the bare site URL for the English homepage", () => {
    expect(localeUrl("en", "/")).toBe(SITE_URL);
  });

  it("adds the locale prefix for non-default locales", () => {
    expect(localeUrl("tr", "/guides")).toBe(`${SITE_URL}/tr/guides`);
    expect(localeUrl("fa", "/blog/visa-guide")).toBe(
      `${SITE_URL}/fa/blog/visa-guide`,
    );
  });

  it("keeps English paths prefix-free under as-needed routing", () => {
    expect(localeUrl("en", "/spaces")).toBe(`${SITE_URL}/spaces`);
  });

  it("handles paths without a leading slash", () => {
    expect(localeUrl("ru", "blog")).toBe(`${SITE_URL}/ru/blog`);
  });
});

describe("alternatesFor", () => {
  it("emits canonical + every BCP 47 hreflang + x-default", () => {
    const alt = alternatesFor("tr", "/blog/visa-guide");
    expect(alt.canonical).toBe(`${SITE_URL}/tr/blog/visa-guide`);
    expect(alt.languages["en-US"]).toBe(`${SITE_URL}/blog/visa-guide`);
    expect(alt.languages["tr-TR"]).toBe(`${SITE_URL}/tr/blog/visa-guide`);
    expect(alt.languages["fa-IR"]).toBe(`${SITE_URL}/fa/blog/visa-guide`);
    expect(alt.languages["ar-SA"]).toBe(`${SITE_URL}/ar/blog/visa-guide`);
    expect(alt.languages["ru-RU"]).toBe(`${SITE_URL}/ru/blog/visa-guide`);
    expect(alt.languages["x-default"]).toBe(`${SITE_URL}/blog/visa-guide`);
  });
});

describe("schema helpers", () => {
  it("organizationSchema has a stable @id and sameAs links", () => {
    const org = organizationSchema();
    expect(org["@id"]).toBe(`${SITE_URL}#organization`);
    expect(org.sameAs).toContain("https://t.me/istanbul_digital_nomads");
  });

  it("websiteSchema carries inLanguage in BCP 47 and a SearchAction", () => {
    const site = websiteSchema("fa");
    expect(site.inLanguage).toBe("fa-IR");
    expect(site.potentialAction["@type"]).toBe("SearchAction");
  });

  it("faqPageSchema returns null when no valid entries are provided", () => {
    expect(faqPageSchema([])).toBeNull();
    expect(faqPageSchema([{ question: "", answer: "" }])).toBeNull();
  });

  it("faqPageSchema builds Question/Answer entries", () => {
    const schema = faqPageSchema([
      { question: "Is wifi fast?", answer: "Yes, 100+ Mbps in most spots." },
    ]);
    expect(schema?.["@type"]).toBe("FAQPage");
    expect(schema?.mainEntity[0].acceptedAnswer.text).toContain("100+");
  });

  it("jsonLdGraph filters falsy nodes", () => {
    const graph = jsonLdGraph({ a: 1 }, null, false, { b: 2 });
    expect(graph["@graph"]).toHaveLength(2);
  });
});
