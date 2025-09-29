import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { verifyShopifyWebhook } from "../utils/verifyShopifyWebhook.server";

// Handle GET requests for testing
export const loader = async ({ request }: LoaderFunctionArgs) => {
  return new Response(JSON.stringify({ 
    endpoint: "customers/data_request", 
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
    console.log(`Received ${topic} webhook for shop: ${shop}`);

    // For this app, we don't store personal customer data
    return new Response(JSON.stringify({ status: "success", message: "Data request processed" }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error: any) {
    console.error("Error processing GDPR data request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
