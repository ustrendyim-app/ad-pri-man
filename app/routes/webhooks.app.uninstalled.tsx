import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  // If this webhook already ran, the session may have been deleted previously.
  if (session) {
    try {
      const { default: db } = await import("../db.server"); // lazy load Prisma after HMAC success
      await db.session.deleteMany({ where: { shop } });
    } catch (err) {
      // Swallow DB errors to avoid returning 5xx; Shopify will retry if needed
      console.warn("app/uninstalled cleanup failed (ignored)", err);
    }
  }

  // Always acknowledge webhook with 200
  return new Response();
};
