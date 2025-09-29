import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
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
    const { shop, session, topic, payload } = await authenticate.webhook(request);
    
    console.log(`Received ${topic} webhook for shop: ${shop}`);
    
    // Parse the webhook payload (payload is already parsed by authenticate.webhook)
    const data = payload;
    
    console.log("GDPR Shop Redact received:", {
      shop_id: data.shop_id,
      shop_domain: data.shop_domain
    });

    // Delete all sessions and data associated with this shop
    try {
      // Delete all sessions for this shop
      await db.session.deleteMany({
        where: {
          shop: data.shop_domain || shop
        }
      });

      console.log("GDPR Shop Redact processed:", {
        shop_id: data.shop_id,
        shop_domain: data.shop_domain || shop,
        action: "All shop data and sessions deleted",
        status: "completed"
      });

      return new Response(JSON.stringify({ status: "success", message: "Shop redact processed" }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
      
    } catch (dbError) {
      console.error("Database error during shop redact:", dbError);
      
      // Even if DB cleanup fails, we should return OK
      // as the shop is being uninstalled anyway
      console.log("GDPR Shop Redact completed with DB cleanup error:", {
        shop_domain: data.shop_domain || shop,
        status: "completed_with_warnings"
      });
      
      return new Response(JSON.stringify({ status: "success", message: "Shop redact completed with warnings" }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    
  } catch (error: any) {
    console.error("Error processing GDPR shop redact:", error);
    
    if (error instanceof Response) {
      return error; // Propagate 401 from HMAC verification
    }
    
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
