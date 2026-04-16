/**
 * External link policy + domain registry.
 *
 * One source of truth for every domain we link to from the site, and the rel
 * attributes each category should ship with. Used by:
 *   - <ExternalLink> (`src/components/ui/external-link.tsx`) at render time
 *   - `scripts/check-external-links.ts` at build time / in CI
 *
 * Policy:
 *   authority      -> noopener noreferrer (preserve trust signal)
 *   directory      -> noopener noreferrer
 *   news           -> noopener noreferrer
 *   own-social     -> noopener noreferrer
 *   third-party    -> noopener noreferrer
 *   tool           -> noopener noreferrer (review for "sponsored" if affiliate)
 *   partner        -> noopener noreferrer (review for "sponsored" if affiliate)
 *   sponsored      -> sponsored noopener noreferrer
 *   ugc            -> ugc noopener noreferrer
 *   low-value      -> nofollow noopener noreferrer
 */

export type LinkCategory =
  | "authority"
  | "directory"
  | "news"
  | "own-social"
  | "third-party"
  | "tool"
  | "partner"
  | "sponsored"
  | "ugc"
  | "low-value";

export interface DomainEntry {
  /** Apex domain or subdomain match. Matched against the URL hostname. */
  domain: string;
  category: LinkCategory;
  /** Optional human note for the linter and contributors. */
  note?: string;
}

/**
 * Domain registry. Keep alphabetized within each category for review-ability.
 * Add a new domain here BEFORE linking to it from anywhere.
 */
export const DOMAIN_REGISTRY: DomainEntry[] = [
  // ---------- authority (gov, edu, well-known orgs) ----------
  { domain: "goc.gov.tr", category: "authority", note: "Turkish migration authority" },
  { domain: "evisa.gov.tr", category: "authority", note: "Turkish e-visa portal" },
  { domain: "mfa.gov.tr", category: "authority", note: "Turkish foreign ministry" },
  { domain: "turkiye.gov.tr", category: "authority", note: "Turkish e-government portal" },
  { domain: "digitalnomads.goturkiye.com", category: "authority", note: "Turkish official digital nomad portal" },
  { domain: "mea.gov.in", category: "authority", note: "Indian Ministry of External Affairs" },
  { domain: "wikipedia.org", category: "authority" },
  { domain: "europa.eu", category: "authority" },

  // ---------- directory (maps, listings) ----------
  { domain: "google.com", category: "directory", note: "Maps + Search links" },
  { domain: "maps.google.com", category: "directory" },
  { domain: "goo.gl", category: "directory", note: "Google short links" },
  { domain: "openstreetmap.org", category: "directory" },
  { domain: "workfrom.co", category: "directory" },
  { domain: "coworker.com", category: "directory" },
  { domain: "sahibinden.com", category: "directory", note: "Turkish housing listings" },
  { domain: "hepsiemlak.com", category: "directory", note: "Turkish housing listings" },
  { domain: "emlakjet.com", category: "directory", note: "Turkish housing listings" },
  { domain: "sehirhatlari.istanbul", category: "directory", note: "Istanbul ferry operator" },
  { domain: "facebook.com", category: "directory", note: "Used for community group links" },

  // ---------- news / publications ----------
  { domain: "freakingnomads.com", category: "news" },

  // ---------- own brand social ----------
  { domain: "linkedin.com/company/istanbulnomads", category: "own-social" },
  { domain: "t.me/istanbul_digital_nomads", category: "own-social" },
  { domain: "github.com/istanbul-digital-nomads", category: "own-social" },

  // ---------- third-party social (broad allow, narrow if abused) ----------
  { domain: "linkedin.com", category: "third-party" },
  { domain: "instagram.com", category: "third-party" },
  { domain: "x.com", category: "third-party" },
  { domain: "twitter.com", category: "third-party" },
  { domain: "youtube.com", category: "third-party" },
  { domain: "youtu.be", category: "third-party" },
  { domain: "t.me", category: "third-party" },
  { domain: "github.com", category: "third-party" },

  // ---------- tools / utilities we recommend ----------
  { domain: "hava.ist", category: "tool", note: "Havaist airport bus" },
  { domain: "wise.com", category: "tool", note: "Multi-currency banking" },
  { domain: "revolut.com", category: "tool", note: "Multi-currency banking" },
  { domain: "turkcell.com.tr", category: "tool", note: "Turkish telco" },
  { domain: "vodafone.com.tr", category: "tool", note: "Turkish telco" },
  { domain: "turktelekom.com.tr", category: "tool", note: "Turkish telco" },
  { domain: "bitaksi.com", category: "tool", note: "Istanbul taxi app" },
  { domain: "moovit.com", category: "tool" },
  { domain: "istanbulkart.istanbul", category: "tool" },
  { domain: "uber.com", category: "tool" },
  { domain: "fast.com", category: "tool", note: "Wifi speed test" },
  { domain: "migros.com.tr", category: "tool", note: "Turkish grocery chain" },
  { domain: "bedas.com.tr", category: "tool", note: "Istanbul European-side electricity utility" },
  { domain: "igdas.istanbul", category: "tool", note: "Istanbul gas utility" },
  // Telcos / connectivity
  { domain: "airalo.com", category: "tool", note: "eSIM provider" },
  { domain: "holafly.com", category: "tool", note: "eSIM provider" },
  // Insurance
  { domain: "safetywing.com", category: "tool", note: "Nomad insurance" },
  { domain: "worldnomads.com", category: "tool", note: "Travel insurance" },
  { domain: "iyisigorta.com", category: "tool", note: "Turkish insurance broker" },
  // Housing platforms
  { domain: "airbnb.com", category: "tool" },
  { domain: "spotahome.com", category: "tool", note: "Mid-term housing" },
  { domain: "flatio.com", category: "tool", note: "Mid-term housing" },
  // Language learning
  { domain: "duolingo.com", category: "tool" },
  { domain: "italki.com", category: "tool" },
  { domain: "preply.com", category: "tool" },
  { domain: "languagetransfer.org", category: "tool" },
  { domain: "turkishclass101.com", category: "tool" },
  { domain: "turkishteatime.com", category: "tool" },

  // ---------- partner-potential (flag for sponsored conversion later) ----------
  // Coworking spaces we recommend - swap to category "sponsored" if/when an
  // affiliate or partnership exists.
  { domain: "kolektifhouse.co", category: "partner", note: "Coworking" },
  { domain: "workinton.com", category: "partner", note: "Coworking" },
  { domain: "justwork.com.tr", category: "partner", note: "Coworking" },
  { domain: "mob.ist", category: "partner", note: "Coworking" },
  { domain: "istanbul.impacthub.net", category: "partner", note: "Coworking" },

  // ---------- low-value (linker beware) ----------
  // Anything we explicitly nofollow. Empty by default - prefer not linking
  // to low-value targets at all.
];

/** Build a fast lookup for the linter / runtime. */
const REGISTRY_INDEX = new Map<string, DomainEntry>();
for (const entry of DOMAIN_REGISTRY) {
  REGISTRY_INDEX.set(entry.domain.toLowerCase(), entry);
}

/**
 * Extract the registry-comparable host from a URL. Strips `www.`,
 * lowercases, returns null for non-http(s) or unparseable URLs.
 */
export function getHost(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Look up a URL in the registry. Matches on exact host first, then on any
 * registry domain that the host ends with (so `t.me/foo` matches the
 * registry entry `t.me/istanbul_digital_nomads` is checked first by being
 * more specific - kept simple by checking longest first).
 */
export function lookupDomain(url: string): DomainEntry | null {
  const host = getHost(url);
  if (!host) return null;

  // Path-aware exact match (own-social entries embed the path).
  let parsedPath = "";
  try {
    parsedPath = new URL(url).pathname;
  } catch {
    /* ignore */
  }
  const fullKey = `${host}${parsedPath}`.toLowerCase();

  // Match longest registry key first so `linkedin.com/company/istanbulnomads`
  // beats `linkedin.com`.
  const sortedKeys = [...REGISTRY_INDEX.keys()].sort(
    (a, b) => b.length - a.length,
  );
  for (const key of sortedKeys) {
    if (fullKey.startsWith(key) || host === key || host.endsWith(`.${key}`)) {
      return REGISTRY_INDEX.get(key) ?? null;
    }
  }

  return null;
}

/** Map a category to the rel value the link should ship with. */
export function relForCategory(category: LinkCategory): string {
  switch (category) {
    case "sponsored":
      return "sponsored noopener noreferrer";
    case "ugc":
      return "ugc noopener noreferrer";
    case "low-value":
      return "nofollow noopener noreferrer";
    default:
      return "noopener noreferrer";
  }
}

/**
 * Return the recommended rel for a URL. Falls back to `noopener noreferrer`
 * when the domain is unknown - so the link still ships safe even if the
 * contributor forgot to register the domain. The linter will flag the
 * unknown domain separately.
 */
export function recommendedRel(url: string): string {
  const entry = lookupDomain(url);
  if (entry) return relForCategory(entry.category);
  return "noopener noreferrer";
}
