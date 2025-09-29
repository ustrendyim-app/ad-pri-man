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
    
    // Log the data request
    console.log("GDPR Data Request received:", {
      shop_id: data.shop_id,
      shop_domain: data.shop_domain,
      customer: data.customer,
      data_request: data.data_request
    });

    // In a real app, you would:
    // 1. Collect all customer data from your databases
    // 2. Format it according to the request
    // 3. Send it to the specified endpoint or email
    
    // For this app, we don't store personal customer data
    // We only store shop data and product information
    const responseData = {
      customer_id: data.customer?.id,
      shop_domain: data.shop_domain,
      message: "Admin Price Sort Edit does not store personal customer data. Only product pricing information is processed.",
      data_exported: {
        personal_data: "None stored",
        pricing_interactions: "No customer-specific data retained"
      }
    };

    // In production, send this data to the customer or data protection officer
    console.log("GDPR Data Request Response:", responseData);

    return new Response("OK", { status: 200 });
    
  } catch (error) {
    console.error("Error processing GDPR data request:", error);
    return new Response("Error", { status: 500 });
  }
};