import { OPENAI_MODEL, openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import type { Business } from "@prisma/client";
import type {
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";
import { buildSystemPrompt } from "./prompts";
import { executeTool, toolDefinitions } from "./tools";

const MAX_TOOL_TURNS = 5;

export type AgentTurnResult = {
  reply: string;
  conversationId: string;
  toolCalls: { name: string; args: any; output: any }[];
};

/**
 * Run one agent turn:
 *  - load (or create) the conversation by sessionId
 *  - persist the user message
 *  - loop: call OpenAI -> if tool calls, execute and feed results back
 *  - persist the final assistant reply
 *
 * Tenant scoping: every tool runs with { businessId, sessionId } from this
 * function — the model cannot inject those values.
 */
export async function runAgentTurn(params: {
  business: Business;
  sessionId: string;
  userMessage: string;
}): Promise<AgentTurnResult> {
  const { business, sessionId, userMessage } = params;

  const conversation = await prisma.conversation.upsert({
    where: { sessionId },
    update: {},
    create: { businessId: business.id, sessionId, channel: "web" },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "USER",
      content: userMessage,
    },
  });

  const history = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
    take: 40,
  });

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: buildSystemPrompt(business) },
    ...history.map((m): ChatCompletionMessageParam => {
      if (m.role === "USER") return { role: "user", content: m.content };
      if (m.role === "ASSISTANT") {
        const tc = m.toolCalls as any;
        if (Array.isArray(tc) && tc.length > 0) {
          return { role: "assistant", content: m.content || null, tool_calls: tc };
        }
        return { role: "assistant", content: m.content };
      }
      // Tool messages stored as TOOL — content holds the JSON output
      const tr = m.toolResults as any;
      return {
        role: "tool",
        tool_call_id: tr?.tool_call_id ?? "unknown",
        content: m.content,
      };
    }),
  ];

  const toolCallsLog: AgentTurnResult["toolCalls"] = [];

  for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      tools: toolDefinitions,
      tool_choice: "auto",
      temperature: 0.4,
    });

    const choice = completion.choices[0];
    const msg = choice.message;

    if (msg.tool_calls && msg.tool_calls.length > 0) {
      // Persist assistant message holding the tool_calls
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "ASSISTANT",
          content: msg.content ?? "",
          toolCalls: msg.tool_calls as any,
        },
      });
      messages.push({
        role: "assistant",
        content: msg.content ?? null,
        tool_calls: msg.tool_calls,
      });

      for (const call of msg.tool_calls) {
        if (call.type !== "function") continue;
        let args: any = {};
        try {
          args = JSON.parse(call.function.arguments || "{}");
        } catch {
          args = {};
        }
        const { output } = await executeTool(call.function.name, args, {
          businessId: business.id,
          sessionId,
        });
        toolCallsLog.push({ name: call.function.name, args, output });

        const toolContent = JSON.stringify(output);
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            role: "TOOL",
            content: toolContent,
            toolResults: { tool_call_id: call.id, name: call.function.name } as any,
          },
        });
        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: toolContent,
        });
      }
      continue; // ask the model again with tool results
    }

    // Final assistant message
    const reply = msg.content ?? "Listo.";
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "ASSISTANT",
        content: reply,
      },
    });
    return { reply, conversationId: conversation.id, toolCalls: toolCallsLog };
  }

  // Tool-loop budget exhausted — return graceful fallback
  const fallback =
    "Estoy teniendo problemas para completar la operación. ¿Puedes intentar de nuevo o darme más detalles?";
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "ASSISTANT",
      content: fallback,
    },
  });
  return { reply: fallback, conversationId: conversation.id, toolCalls: toolCallsLog };
}
