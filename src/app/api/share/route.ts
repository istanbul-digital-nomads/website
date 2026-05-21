import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, rateLimitHeaders, getClientIp } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/seo";
import {
  getOrCreateShortLink,
  isShortableKind,
  isValidTargetPath,
} from "@/lib/short-links";

const SHARE_LIMIT = 30;
const SHARE_WINDOW_MS = 60 * 60 * 1000;

// POST { kind, entityId, path } -> { url } with a short link to `path`.
// Anonymous is allowed (sharing a public page); a logged-in user is recorded
// as created_by. The path is validated against an allowlist per kind so the
// shortener can't be turned into an open redirect.
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = await rateLimit(`share:${ip}`, SHARE_LIMIT, SHARE_WINDOW_MS);
  const headers = rateLimitHeaders(rl, SHARE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many share requests. Retry in ${rl.retryAfterSeconds}s.` },
      { status: 429, headers },
    );
  }

  const body = await request.json().catch(() => null);
  const kind = body?.kind;
  const entityId = body?.entityId;
  const path = body?.path;

  if (
    !isShortableKind(kind) ||
    typeof entityId !== "string" ||
    !entityId ||
    typeof path !== "string" ||
    !isValidTargetPath(kind, path)
  ) {
    return NextResponse.json(
      { error: "Invalid share request" },
      { status: 400, headers },
    );
  }

  // Best-effort: attribute the link to the signed-in member if there is one.
  let createdBy: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    createdBy = user?.id ?? null;
  } catch {
    createdBy = null;
  }

  const result = await getOrCreateShortLink({
    kind,
    entityId,
    targetPath: path,
    createdBy,
  });
  if ("error" in result) {
    return NextResponse.json(
      { error: "Could not create share link" },
      { status: 500, headers },
    );
  }

  return NextResponse.json(
    { url: `${SITE_URL}/s/${result.code}` },
    { status: 200, headers },
  );
}
