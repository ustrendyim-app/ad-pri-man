import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { shop, session, topic } = await authenticate.webhook(request);
    
    console.log(`Received ${topic} webhook for shop: ${shop}`);
    
    // Parse the webhook payload
    const payload = await request.text();
    const data = JSON.parse(payload);
    
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

    return new Response("OK", { status: 200 });
    
  } catch (error) {
    console.error("Error processing GDPR customer redact:", error);
    return new Response("Error", { status: 500 });
  }
};