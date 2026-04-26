import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";

// Force Node runtime — we use node:crypto and a process-wide Map for the
// rate limiter (neither works on Edge). For real production we'd swap this
// for Vercel KV or Upstash; this is fine for "soft launch" volume.
export const runtime = "nodejs";

type Source = "observe" | "request" | "home";

interface InterestPayload {
  email?: unknown;
  source?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_SOURCES: ReadonlySet<Source> = new Set([
  "observe",
  "request",
  "home",
]);

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 submission per IP per minute
// NOTE: in-memory rate limit. Swap for Vercel KV / Upstash for real prod.
const rateLimitMap = new Map<string, number>();

function getClientIp(req: NextRequest): string {
  // Vercel forwards the real IP via x-forwarded-for. First hop is the user.
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

function hashIp(ip: string): string {
  // Hashed so we never store raw IPs at rest.
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const last = rateLimitMap.get(ip);
  if (last && now - last < RATE_LIMIT_WINDOW_MS) return true;
  rateLimitMap.set(ip, now);
  // Opportunistic GC so the map doesn't grow forever
  if (rateLimitMap.size > 5000) {
    for (const [k, t] of rateLimitMap) {
      if (now - t > RATE_LIMIT_WINDOW_MS * 5) rateLimitMap.delete(k);
    }
  }
  return false;
}

async function persistToSupabase(
  email: string,
  source: Source,
  ipHash: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return { ok: false, reason: "supabase-not-configured" };
  }
  try {
    const res = await fetch(`${url}/rest/v1/interested_users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        // on conflict (email,source) do nothing — idempotent signups
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({ email, source, ip_hash: ipHash }),
    });
    if (!res.ok && res.status !== 409) {
      return { ok: false, reason: `supabase-${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "supabase-error",
    };
  }
}

export async function POST(req: NextRequest) {
  let body: InterestPayload;
  try {
    body = (await req.json()) as InterestPayload;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
  const source = typeof body.source === "string" ? body.source : "";

  if (!EMAIL_RE.test(rawEmail)) {
    return NextResponse.json(
      { success: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (!VALID_SOURCES.has(source as Source)) {
    return NextResponse.json(
      { success: false, message: "Invalid source." },
      { status: 400 },
    );
  }

  const ip = getClientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        message: "You just signed up — give it a minute and try again.",
      },
      { status: 429 },
    );
  }

  const ipHash = hashIp(ip);
  const result = await persistToSupabase(
    rawEmail.toLowerCase(),
    source as Source,
    ipHash,
  );

  if (!result.ok) {
    if (result.reason === "supabase-not-configured") {
      // Local dev / preview deploy fallback — log + succeed.
      console.log(
        `[interest] (no supabase) email=${rawEmail} source=${source} ipHash=${ipHash}`,
      );
    } else {
      // Persisting failed but the user shouldn't be punished — log loudly,
      // still tell them they're on the list (we'll reconcile from logs).
      console.error(
        `[interest] persist failed: ${result.reason} email=${rawEmail} source=${source}`,
      );
    }
  }

  return NextResponse.json({
    success: true,
    message: "You're on the list. We'll email you the night the telescope wakes up.",
  });
}

// Reject other methods cleanly so misuse doesn't 404 silently.
export function GET() {
  return NextResponse.json(
    { success: false, message: "Use POST." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
