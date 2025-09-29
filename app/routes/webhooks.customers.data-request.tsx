import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { verifyWebhookHmac } from "../utils/verifyWebhookHmac.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return new Response(
    JSON.stringify({
      endpoint: "customers/data_request",
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

  console.log(`✅ [GDPR Data Request] ${verification.topic} for shop ${verification.shop}`);
  
  // App doesn't store personal customer data
  return new Response(
    JSON.stringify({ ok: true, message: "Data request processed" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
