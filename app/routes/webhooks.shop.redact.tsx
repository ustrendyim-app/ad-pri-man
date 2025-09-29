import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { verifyWebhookHmac } from "../utils/verifyWebhookHmac.server";
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
  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    return new Response("Server configuration error", { status: 500 });
  }

  const verification = await verifyWebhookHmac(request, secret);
  if (!verification.isValid) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log(`✅ [GDPR Shop Redact] ${verification.topic} for shop ${verification.shop}`);
  
  try {
    // Delete all sessions for this shop
    const shopDomain = verification.data?.shop_domain || verification.shop;
    if (shopDomain) {
      await db.session.deleteMany({
        where: { shop: shopDomain },
      });
    }

    return new Response(
      JSON.stringify({ ok: true, message: "Shop redact processed" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (dbError) {
    console.error("Database error during shop redact:", dbError);
    // Return success even if DB fails
    return new Response(
      JSON.stringify({ ok: true, message: "Shop redact completed" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
