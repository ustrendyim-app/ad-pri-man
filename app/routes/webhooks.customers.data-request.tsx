import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

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
    const { shop, session, topic, payload } = await authenticate.webhook(request);
    
    console.log(`Received ${topic} webhook for shop: ${shop}`);
    
    // Parse the webhook payload (payload is already parsed by authenticate.webhook)
    const data = payload;
    
    console.log("GDPR Data Request received:", {
      shop_id: data.shop_id,
      shop_domain: data.shop_domain,
      customer: data.customer,
      data_request: data.data_request
    });

    // For this app, we don't store personal customer data
    // We only store shop data and product information
    // So we don't have customer-specific data to export
    
    const responseData = {
      customer_id: data.customer?.id,
      shop_domain: data.shop_domain,
      message: "Admin Price Sort Edit does not store personal customer data. Only product pricing information is processed.",
      data_exported: {
        personal_data: "None stored",
        pricing_interactions: "No customer-specific data retained"
      }
    };

    console.log("GDPR Data Request Response:", responseData);

    return new Response(JSON.stringify({ status: "success", message: "Data request processed" }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error processing GDPR data request:", error);
    
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