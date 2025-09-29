import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

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
    
  } catch (error) {
    console.error("Error processing GDPR customer redact:", error);
    
    // Check if it's a webhook verification error
    if (error.message && error.message.includes("webhook")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};