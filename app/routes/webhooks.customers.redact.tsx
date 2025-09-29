import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

// Handle GET requests for testing
export const loader = async ({ request }: LoaderFunctionArgs) => {
  return new Response(JSON.stringify({ 
    endpoint: "customers/redact", 
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
    const { shop, session, topic, payload } = await authenticate.webhook(request);
    
    console.log(`Received ${topic} webhook for shop: ${shop}`);
    
    // Parse the webhook payload (payload is already parsed by authenticate.webhook)
    const data = payload;
    
    console.log("GDPR Customer Redact received:", {
      shop_id: data.shop_id,
      shop_domain: data.shop_domain,
      customer: data.customer
    });

    // For this app, we don't store personal customer data
    // We only store shop data and product information
    // So there's nothing to redact for specific customers
    
    console.log("GDPR Customer Redact processed:", {
      customer_id: data.customer?.id,
      shop_domain: data.shop_domain,
      action: "No customer-specific data found to redact",
      status: "completed"
    });

    return new Response(JSON.stringify({ status: "success", message: "Customer redact processed" }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error: any) {
    console.error("Error processing GDPR customer redact:", error);
    
    if (error instanceof Response) {
      return error; // Propagate 401 from HMAC verification
    }
    
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
