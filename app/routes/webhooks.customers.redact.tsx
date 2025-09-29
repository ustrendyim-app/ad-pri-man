import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import crypto from "crypto";

export const action = async ({ request }: ActionFunctionArgs) => {
  // Verify webhook authenticity
  const body = await request.text();
  const hmac = request.headers.get("X-Shopify-Hmac-Sha256");
  const topic = request.headers.get("X-Shopify-Topic");
  
  // Verify HMAC if secret is available
  if (process.env.SHOPIFY_WEBHOOK_SECRET && hmac) {
    const generatedHash = crypto
      .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET)
      .update(body, "utf8")
      .digest("base64");
      
    if (generatedHash !== hmac) {
      console.log("Webhook verification failed");
      return new Response("Unauthorized", { status: 401 });
    }
  }

  try {
    const data = JSON.parse(body);
    
    // Log the redact request
    console.log("GDPR Customer Redact received:", {
      shop_id: data.shop_id,
      shop_domain: data.shop_domain,
      customer: data.customer
    });

    // In a real app, you would:
    // 1. Find all customer data in your databases
    // 2. Delete or anonymize it
    // 3. Log the deletion for compliance records
    
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