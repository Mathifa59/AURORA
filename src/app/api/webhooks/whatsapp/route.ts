import { getCurrentBusiness } from "@/lib/tenant";
import { runAgentTurn } from "@/server/ai/agent";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * WhatsApp Cloud API webhook — preparado pero opcional.
 * - GET: verification handshake (`hub.challenge`).
 * - POST: incoming message events. Reuses the same agent loop as /api/chat.
 *
 * To wire it up:
 *  1. Set WHATSAPP_VERIFY_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN.
 *  2. Configure the webhook URL in Meta Developer Portal.
 *  3. Implement sendWhatsAppMessage to call the Graph API send endpoint.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  try {
    const entries = payload?.entry ?? [];
    for (const entry of entries) {
      for (const change of entry.changes ?? []) {
        const value = change.value;
        const messages = value?.messages ?? [];
        for (const m of messages) {
          if (m.type !== "text") continue;
          const from = m.from as string; // phone number
          const text = m.text?.body as string;
          if (!from || !text) continue;

          const business = await getCurrentBusiness();
          const sessionId = `wa:${from}`;
          const result = await runAgentTurn({
            business,
            sessionId,
            userMessage: text,
          });
          await sendWhatsAppMessage(from, result.reply);
        }
      }
    }
  } catch (e) {
    console.error("[whatsapp webhook] error:", e);
  }
  // Always 200 — Meta retries otherwise.
  return NextResponse.json({ ok: true });
}

async function sendWhatsAppMessage(to: string, text: string) {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneId || !token) {
    console.log(`[whatsapp:mock] -> ${to}: ${text}`);
    return;
  }
  await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });
}
