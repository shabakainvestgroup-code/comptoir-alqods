import { env } from "@/lib/env";

type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(token: unknown, request: Request) {
  if (!env.turnstileSecretKey) {
    return { success: true, skipped: true };
  }

  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return { success: false, skipped: false };
  }

  const remoteIp =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim();

  const body: Record<string, string> = {
    secret: env.turnstileSecretKey,
    response: token
  };

  if (remoteIp) body.remoteip = remoteIp;

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = (await response.json()) as TurnstileResponse;
    return { success: Boolean(result.success), skipped: false, errors: result["error-codes"] || [] };
  } catch {
    return { success: false, skipped: false, errors: ["internal-error"] };
  }
}
