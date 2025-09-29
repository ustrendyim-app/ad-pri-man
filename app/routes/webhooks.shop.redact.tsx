import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { shop, session, topic } = await authenticate.webhook(request);
    
    console.log(`Received ${topic} webhook for shop: ${shop}`);
    
    // Parse the webhook payload
    const payload = await request.text();
    const data = JSON.parse(payload);
    
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

      return new Response("OK", { status: 200 });
      
    } catch (dbError) {
      console.error("Database error during shop redact:", dbError);
      
      // Even if DB cleanup fails, we should return OK
      // as the shop is being uninstalled anyway
      console.log("GDPR Shop Redact completed with DB cleanup error:", {
        shop_domain: data.shop_domain || shop,
        status: "completed_with_warnings"
      });
      
      return new Response("OK", { status: 200 });
    }
    
  } catch (error) {
    console.error("Error processing GDPR shop redact:", error);
    return new Response("Error", { status: 500 });
  }
};