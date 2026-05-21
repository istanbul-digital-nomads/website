import "server-only";
import { randomBytes } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/server";

// postgrest-js v12 infers insert/update payloads as `never` for some tables
// (the codebase works around this with the same client cast in
// plans/mutations.ts). Cast the service client to a loose shape for the
// short_links reads/writes; the SQL itself is correct.
type LooseClient = { from: (table: string) => any };

// On-demand link shortener. The Share button POSTs to /api/share, which calls
// getOrCreateShortLink; /s/[code] calls resolveShortLink to redirect. All DB
// access uses the service-role client (the short_links table is RLS-deny for
// clients - see migration 027).

export const SHORTABLE_KINDS = [
  "member",
  "plan",
  "paperwork",
  "guide",
  "blog",
] as const;
export type ShortableKind = (typeof SHORTABLE_KINDS)[number];

export function isShortableKind(v: unknown): v is ShortableKind {
  return (
    typeof v === "string" && (SHORTABLE_KINDS as readonly string[]).includes(v)
  );
}

const UUID =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
const SLUG = "[a-z0-9]+(?:-[a-z0-9]+)*";

// A path is only shortenable if it matches the canonical shape for its kind.
// This blocks shortening arbitrary URLs (open-redirect / abuse surface).
const ALLOWED_PATH_PATTERNS: Record<ShortableKind, RegExp> = {
  member: new RegExp(`^/members/${UUID}$`),
  plan: new RegExp(`^/plans/${UUID}$`),
  paperwork: new RegExp(`^/paperwork/${UUID}$`),
  guide: new RegExp(`^/guides/${SLUG}$`),
  blog: new RegExp(`^/blog/${SLUG}$`),
};

export function isValidTargetPath(kind: ShortableKind, path: string): boolean {
  return ALLOWED_PATH_PATTERNS[kind].test(path);
}

// 7-char base62 code from CSPRNG bytes (~62^7 ≈ 3.5e12 space). Collisions are
// astronomically unlikely but handled with a retry in getOrCreateShortLink.
const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CODE_LEN = 7;

export function generateShortCode(): string {
  const bytes = randomBytes(CODE_LEN);
  let out = "";
  for (let i = 0; i < CODE_LEN; i++) {
    out += BASE62[bytes[i] % 62];
  }
  return out;
}

interface CreateArgs {
  kind: ShortableKind;
  entityId: string;
  targetPath: string;
  createdBy?: string | null;
}

// Returns an existing code for this (kind, entity) or mints a new one.
// Idempotent per entity thanks to the unique (kind, entity_id) index.
export async function getOrCreateShortLink(
  args: CreateArgs,
): Promise<{ code: string } | { error: string }> {
  const { kind, entityId, targetPath, createdBy = null } = args;
  const supabase = createServiceClient() as unknown as LooseClient;

  const { data: existing, error: selErr } = await supabase
    .from("short_links")
    .select("code")
    .eq("kind", kind)
    .eq("entity_id", entityId)
    .maybeSingle();
  if (selErr) return { error: selErr.message };
  if (existing) return { code: existing.code as string };

  // Insert with a fresh code, retrying on the (rare) primary-key collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateShortCode();
    const { error: insErr } = await supabase.from("short_links").insert({
      code,
      kind,
      entity_id: entityId,
      target_path: targetPath,
      created_by: createdBy,
    });
    if (!insErr) return { code };
    // 23505 = unique_violation. Could be the code PK (retry) or the
    // (kind, entity_id) index racing another request (re-select + reuse).
    if (insErr.code === "23505") {
      const { data: raced } = await supabase
        .from("short_links")
        .select("code")
        .eq("kind", kind)
        .eq("entity_id", entityId)
        .maybeSingle();
      if (raced) return { code: raced.code as string };
      continue; // PK collision - try a new code
    }
    return { error: insErr.message };
  }
  return { error: "Could not allocate a short code" };
}

// Resolve a code to its target path and bump the click counter (best-effort).
export async function resolveShortLink(code: string): Promise<string | null> {
  const supabase = createServiceClient() as unknown as LooseClient;
  const { data, error } = await supabase
    .from("short_links")
    .select("target_path, click_count")
    .eq("code", code)
    .maybeSingle();
  if (error || !data) return null;
  // Fire-and-forget increment; never block the redirect on it.
  void supabase
    .from("short_links")
    .update({ click_count: (data.click_count ?? 0) + 1 })
    .eq("code", code);
  return data.target_path as string;
}
