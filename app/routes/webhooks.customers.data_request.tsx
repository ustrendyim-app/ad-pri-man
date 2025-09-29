import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { shop, session, topic } = await authenticate.webhook(request);
    
    console.log(`Received ${topic} webhook for shop: ${shop}`);
    
    // Parse the webhook payload
    const payload = await request.text();
    const data = JSON.parse(payload);
    
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

    return new Response("OK", { status: 200 });
    
  } catch (error) {
    console.error("Error processing GDPR data request:", error);
    return new Response("Error", { status: 500 });
  }
};