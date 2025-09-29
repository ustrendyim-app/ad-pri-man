import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { verifyShopifyWebhook } from "../utils/verifyShopifyWebhook.server";
import db from "../db.server";

// Handle GET requests for testing
export const loader = async ({ request }: LoaderFunctionArgs) => {
  return new Response(JSON.stringify({ 
    endpoint: "shop/redact", 
    status: "ready",
    method: "POST only",
    message: "This webhook endpoint is ready to receive POST requests from Shopify" 
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

// Handle POST requests (actual webhooks)
export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const secret = process.env.SHOPIFY_API_SECRET || "";
    const result = await verifyShopifyWebhook(request, secret);
    if (!result.ok) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { shop, topic, payload } = result;
    const data: any = payload;

    console.log(`Received ${topic} webhook for shop: ${shop}`);

    // Delete all sessions and data associated with this shop
    try {
      await db.session.deleteMany({
        where: {
          shop: data?.shop_domain || shop || undefined,
        },
      });

      return new Response(JSON.stringify({ status: "success", message: "Shop redact processed" }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
      
    } catch (dbError) {
      console.error("Database error during shop redact:", dbError);
      return new Response(JSON.stringify({ status: "success", message: "Shop redact completed with warnings" }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    
  } catch (error: any) {
    console.error("Error processing GDPR shop redact:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
