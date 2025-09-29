import crypto from "node:crypto";

export interface WebhookVerification {
  isValid: boolean;
  shop?: string | null;
  topic?: string | null;
  data?: any;
}

// Aggressive HMAC verification for Shopify automated checks
export async function verifyWebhookHmac(
  request: Request,
  secret: string
): Promise<WebhookVerification> {
  // Clone request to avoid body consumption issues
  const clonedRequest = request.clone();
  
  const hmacHeader = clonedRequest.headers.get("x-shopify-hmac-sha256");
  const topic = clonedRequest.headers.get("x-shopify-topic");
  const shop = clonedRequest.headers.get("x-shopify-shop-domain");

  if (!hmacHeader || !secret) {
    return { isValid: false, shop, topic };
  }

  try {
    // Get raw body as string
    const body = await clonedRequest.text();
    
    // Calculate HMAC
    const calculatedHmac = crypto
      .createHmac("sha256", secret)
      .update(body, "utf8")
      .digest("base64");

    // Timing-safe comparison
    const providedHmac = Buffer.from(hmacHeader);
    const computedHmac = Buffer.from(calculatedHmac);
    
    const isValid = 
      providedHmac.length === computedHmac.length &&
      crypto.timingSafeEqual(providedHmac, computedHmac);

    if (!isValid) {
      return { isValid: false, shop, topic };
    }

    // Parse JSON data if valid
    let data: any = null;
    try {
      data = body ? JSON.parse(body) : null;
    } catch {
      data = null;
    }

    return { isValid: true, shop, topic, data };
  } catch (error) {
    console.error("HMAC verification error:", error);
    return { isValid: false, shop, topic };
  }
}