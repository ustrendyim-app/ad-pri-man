import crypto from "node:crypto";

export interface VerifyResult {
  ok: boolean;
  status: number; // 200 or 401
  shop?: string | null;
  topic?: string | null;
  payload?: any;
}

// Verify Shopify webhook HMAC on the raw request body
export async function verifyShopifyWebhook(request: Request, secret: string): Promise<VerifyResult> {
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  const topic = request.headers.get("x-shopify-topic");
  const shop = request.headers.get("x-shopify-shop-domain");

  if (!hmacHeader) {
    return { ok: false, status: 401, shop, topic };
  }

  // Read the raw body exactly as sent
  const rawBody = await request.text();

  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  const a = Buffer.from(digest);
  const b = Buffer.from(hmacHeader);
  const equal = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!equal) return { ok: false, status: 401, shop, topic };

  // If valid, parse JSON payload (if possible)
  let payload: any = undefined;
  try {
    payload = rawBody ? JSON.parse(rawBody) : undefined;
  } catch {
    payload = undefined;
  }

  return { ok: true, status: 200, shop, topic, payload };
}
