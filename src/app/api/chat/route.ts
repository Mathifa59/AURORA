import { getCurrentBusiness } from "@/lib/tenant";
import { runAgentTurn } from "@/server/ai/agent";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const Body = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().min(8).max(128),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e: any) {
    return NextResponse.json({ error: "Invalid request", details: e.errors }, { status: 400 });
  }

  try {
    const business = await getCurrentBusiness();
    const result = await runAgentTurn({
      business,
      sessionId: body.sessionId,
      userMessage: body.message,
    });
    return NextResponse.json({
      reply: result.reply,
      toolCalls: result.toolCalls.map((c) => ({ name: c.name })),
    });
  } catch (e: any) {
    console.error("[/api/chat] error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
