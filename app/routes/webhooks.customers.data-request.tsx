import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import crypto from "node:crypto";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return new Response(
    JSON.stringify({
      endpoint: "customers/data-request",
      status: "ready",
      method: "POST only",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  const secret = process.env.SHOPIFY_API_SECRET;
  
  if (!hmacHeader || !secret) {
    return new Response(null, { status: 401 });
  }

  const body = await request.text();
  const hash = crypto.createHmac("sha256", secret).update(body, "utf8").digest("base64");

  const a = Buffer.from(hash, "utf8");
  const b = Buffer.from(hmacHeader, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return new Response(null, { status: 401 });
  }

  return new Response(null, { status: 200 });
};
