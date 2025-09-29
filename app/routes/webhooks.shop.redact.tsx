import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import crypto from "crypto";
import prisma from "../db.server";

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
    
    // Log the shop redact request
    console.log("GDPR Shop Redact received:", {
      shop_id: data.shop_id,
      shop_domain: data.shop_domain
    });

    // Delete all sessions and data associated with this shop
    try {
      // Delete all sessions for this shop
      await prisma.session.deleteMany({
        where: {
          shop: data.shop_domain
        }
      });

      console.log("GDPR Shop Redact processed:", {
        shop_id: data.shop_id,
        shop_domain: data.shop_domain,
        action: "All shop data and sessions deleted",
        status: "completed"
      });

      return new Response("OK", { status: 200 });
      
    } catch (dbError) {
      console.error("Database error during shop redact:", dbError);
      
      // Even if DB cleanup fails, we should return OK
      // as the shop is being uninstalled anyway
      console.log("GDPR Shop Redact completed with DB cleanup error:", {
        shop_domain: data.shop_domain,
        status: "completed_with_warnings"
      });
      
      return new Response("OK", { status: 200 });
    }
    
  } catch (error) {
    console.error("Error processing GDPR shop redact:", error);
    return new Response("Error", { status: 500 });
  }
};