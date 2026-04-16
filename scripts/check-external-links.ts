#!/usr/bin/env tsx
/**
 * External-link policy linter.
 *
 * Walks src/ + scripts knownsafe (skip), grep-finds every external URL in
 * MDX and TSX, and validates each against `src/lib/external-links.ts`.
 *
 * Exit codes:
 *   0 - all links pass
 *   1 - one or more violations
 *
 * Usage:
 *   pnpm check-links
 *   pnpm check-links --fix-suggestions   (prints suggested rel for unknown domains)
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import {
  DOMAIN_REGISTRY,
  getHost,
  lookupDomain,
  recommendedRel,
} from "../src/lib/external-links";

const ROOT = resolve(__dirname, "..");
const SCAN_DIRS = ["src/content", "src/app", "src/components", "src/lib", "src/data"];
const FILE_RE = /\.(mdx?|tsx?)$/;
const EXCLUDE = new Set(["node_modules", ".next", "dist", "build"]);

// Match markdown links and html/tsx anchors.
const MD_LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
const HTML_HREF_RE = /href\s*=\s*["'`](https?:\/\/[^"'`]+)["'`]/g;
const HTML_HREF_BRACE_RE = /href\s*=\s*\{["'`](https?:\/\/[^"'`]+)["'`]\}/g;

/**
 * URLs we ignore because they aren't user-visible outbound links:
 *   - preconnect / dns-prefetch / preload <link> tags (CDN hints)
 *   - example URLs in JSDoc / source comments
 *   - URLs inside string literals that are clearly not anchors (best-effort)
 */
const IGNORE_REL_VALUES = ["preconnect", "dns-prefetch", "preload", "prefetch"];
const IGNORE_HOSTS = new Set([
  "partner.example",
  "example.com",
  "example.org",
  "schema.org",
]);

function isPrefetchOrPreconnect(text: string, matchIndex: number): boolean {
  // Walk backwards to find the start of the enclosing tag.
  const back = text.slice(Math.max(0, matchIndex - 200), matchIndex);
  const tagStart = back.lastIndexOf("<");
  if (tagStart === -1) return false;
  const tagSnippet = back.slice(tagStart) + text.slice(matchIndex, matchIndex + 50);
  for (const rel of IGNORE_REL_VALUES) {
    if (tagSnippet.includes(`rel="${rel}"`) || tagSnippet.includes(`rel='${rel}'`)) {
      return true;
    }
  }
  return false;
}

function isInComment(text: string, matchIndex: number): boolean {
  // Find the start of the line.
  const lineStart = text.lastIndexOf("\n", matchIndex - 1) + 1;
  const lineUpToMatch = text.slice(lineStart, matchIndex);
  // Single-line comment markers before the match on the same line.
  if (/^\s*(\*|\/\/|#)/.test(lineUpToMatch)) return true;
  // Inside a /* ... */ block - cheap check: count `/*` vs `*/` before the match.
  const before = text.slice(0, matchIndex);
  const opens = (before.match(/\/\*/g) ?? []).length;
  const closes = (before.match(/\*\//g) ?? []).length;
  return opens > closes;
}

interface Finding {
  file: string;
  line: number;
  url: string;
  anchor?: string;
  issue: string;
  severity: "error" | "warn";
}

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    if (EXCLUDE.has(entry)) continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) yield* walk(full);
    else if (FILE_RE.test(entry)) yield full;
  }
}

function lineOf(text: string, index: number): number {
  return text.slice(0, index).split("\n").length;
}

function scanFile(file: string): Finding[] {
  const findings: Finding[] = [];
  const text = readFileSync(file, "utf8");
  const isMdx = /\.mdx?$/.test(file);
  const rel = relative(ROOT, file);

  const seen = new Set<string>();

  // Markdown links (only meaningful in MDX, but harmless elsewhere).
  if (isMdx) {
    for (const m of text.matchAll(MD_LINK_RE)) {
      const [, anchor, url] = m;
      const key = `${m.index}:${url}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const line = lineOf(text, m.index ?? 0);
      validateUrl({ file: rel, line, url, anchor, findings });
    }
  }

  // TSX/HTML href="..." (no curly braces).
  for (const m of text.matchAll(HTML_HREF_RE)) {
    const [, url] = m;
    const idx = m.index ?? 0;
    const key = `${idx}:${url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (isPrefetchOrPreconnect(text, idx)) continue;
    if (isInComment(text, idx)) continue;
    validateUrl({ file: rel, line: lineOf(text, idx), url, findings });
  }

  // TSX href={"..."} variant.
  for (const m of text.matchAll(HTML_HREF_BRACE_RE)) {
    const [, url] = m;
    const idx = m.index ?? 0;
    const key = `${idx}:${url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (isPrefetchOrPreconnect(text, idx)) continue;
    if (isInComment(text, idx)) continue;
    validateUrl({ file: rel, line: lineOf(text, idx), url, findings });
  }

  return findings;
}

function validateUrl({
  file,
  line,
  url,
  anchor,
  findings,
}: {
  file: string;
  line: number;
  url: string;
  anchor?: string;
  findings: Finding[];
}) {
  // Strip trailing punctuation that often gets caught by the regex.
  const cleanUrl = url.replace(/[.,;:!?)]+$/, "");

  const host = getHost(cleanUrl);
  if (!host) {
    findings.push({
      file,
      line,
      url: cleanUrl,
      anchor,
      issue: "URL is not http(s) or could not be parsed",
      severity: "error",
    });
    return;
  }

  // Skip own-domain links - they're internal.
  if (host === "istanbulnomads.com" || host.endsWith(".istanbulnomads.com")) return;

  // Skip placeholder / example domains.
  if (IGNORE_HOSTS.has(host)) return;

  const entry = lookupDomain(cleanUrl);
  if (!entry) {
    findings.push({
      file,
      line,
      url: cleanUrl,
      anchor,
      issue: `Domain "${host}" is not in DOMAIN_REGISTRY (src/lib/external-links.ts). Add it with the right category, or remove the link.`,
      severity: "error",
    });
    return;
  }

  // Anchor text quality (markdown only).
  if (anchor) {
    const lc = anchor.toLowerCase().trim();
    if (lc === "click here" || lc === "here" || lc === "link") {
      findings.push({
        file,
        line,
        url: cleanUrl,
        anchor,
        issue: `Anchor text "${anchor}" is non-descriptive. Use the destination page name or topic.`,
        severity: "warn",
      });
    }
    if (lc === cleanUrl.toLowerCase()) {
      findings.push({
        file,
        line,
        url: cleanUrl,
        anchor,
        issue: "Anchor text is the bare URL. Use descriptive text instead.",
        severity: "warn",
      });
    }
  }

  // Sponsored category MUST be intentional - flag when registry says sponsored
  // so reviewers see it.
  if (entry.category === "sponsored") {
    findings.push({
      file,
      line,
      url: cleanUrl,
      anchor,
      issue: `Sponsored link to ${host}. Confirm <ExternalLink category="sponsored"> or MDX rel attribute is set, and disclosure is present in the post.`,
      severity: "warn",
    });
  }
}

function main() {
  const start = Date.now();
  const allFindings: Finding[] = [];
  let fileCount = 0;
  let urlCount = 0;

  for (const dir of SCAN_DIRS) {
    const full = join(ROOT, dir);
    try {
      for (const file of walk(full)) {
        fileCount += 1;
        const findings = scanFile(file);
        allFindings.push(...findings);
      }
    } catch {
      // Directory might not exist in some setups - skip silently.
    }
  }

  // Count URLs by re-scanning quickly (cheap; same regex pass).
  for (const dir of SCAN_DIRS) {
    const full = join(ROOT, dir);
    try {
      for (const file of walk(full)) {
        const text = readFileSync(file, "utf8");
        urlCount += [...text.matchAll(MD_LINK_RE)].length;
        urlCount += [...text.matchAll(HTML_HREF_RE)].length;
        urlCount += [...text.matchAll(HTML_HREF_BRACE_RE)].length;
      }
    } catch {
      /* ignore */
    }
  }

  const errors = allFindings.filter((f) => f.severity === "error");
  const warnings = allFindings.filter((f) => f.severity === "warn");
  const elapsed = ((Date.now() - start) / 1000).toFixed(2);

  console.log(
    `\nScanned ${fileCount} files / ${urlCount} URLs in ${elapsed}s.`,
  );
  console.log(
    `Registry has ${DOMAIN_REGISTRY.length} domains across ${
      new Set(DOMAIN_REGISTRY.map((d) => d.category)).size
    } categories.\n`,
  );

  if (errors.length === 0 && warnings.length === 0) {
    console.log("All external links pass policy.\n");
    process.exit(0);
  }

  if (errors.length > 0) {
    console.log(`Errors (${errors.length}):\n`);
    for (const f of errors) {
      console.log(`  ${f.file}:${f.line}`);
      console.log(`    ${f.url}`);
      console.log(`    -> ${f.issue}`);
      const host = getHost(f.url);
      if (host) {
        console.log(`    suggested rel: ${recommendedRel(f.url)}`);
      }
      console.log("");
    }
  }

  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):\n`);
    for (const f of warnings) {
      console.log(`  ${f.file}:${f.line}`);
      console.log(`    ${f.url}`);
      console.log(`    -> ${f.issue}\n`);
    }
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
