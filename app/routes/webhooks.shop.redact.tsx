import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import crypto from "node:crypto";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return new Response(
    JSON.stringify({
      endpoint: "shop/redact",
      status: "ready",
      method: "POST only",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  const secret = process.env.SHOPIFY_API_SECRET;
  
  if (!hmacHeader || !secret) {
    return new Response(null, { status: 401 });
  }

  const body = await request.text();
  const hash = crypto.createHmac("sha256", secret).update(body, "utf8").digest("base64");
  
  if (!crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmacHeader))) {
    return new Response(null, { status: 401 });
  }

  // Clean up shop data if needed
  try {
    const shopDomain = request.headers.get("x-shopify-shop-domain");
    if (shopDomain) {
      await db.session.deleteMany({ where: { shop: shopDomain } });
    }
  } catch {}

  return new Response(null, { status: 200 });
};
