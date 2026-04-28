import { prisma } from "@/lib/prisma";
import { getCurrentBusiness } from "@/lib/tenant";
import { formatDateTime } from "@/lib/utils";
import { Bot, MessageSquare, User, Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ConversationsPage() {
  const business = await getCurrentBusiness();
  const conversations = await prisma.conversation.findMany({
    where: { businessId: business.id },
    orderBy: { updatedAt: "desc" },
    take: 25,
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 50,
      },
      _count: { select: { messages: true } },
    },
  });

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Conversaciones</h1>
        <p className="text-sm text-muted-foreground">
          Historial de chats con el agente IA. Útil para auditoría y mejora continua.
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="card-elevated p-12 text-center text-sm text-muted-foreground">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3">Aún no hay conversaciones.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {conversations.map((c) => (
            <div key={c.id} className="card-elevated overflow-hidden">
              <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="badge bg-sky-50 text-sky-700 ring-sky-200">
                    {c.channel}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {c._count.messages} mensajes
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(c.updatedAt, business.locale)}
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto p-4 space-y-2 text-xs">
                {c.messages.slice(-8).map((m) => (
                  <div key={m.id} className="flex items-start gap-2">
                    <div className="shrink-0 pt-0.5">
                      {m.role === "USER" ? (
                        <User className="h-3.5 w-3.5 text-sky-500" />
                      ) : m.role === "ASSISTANT" ? (
                        <Bot className="h-3.5 w-3.5 text-violet-500" />
                      ) : (
                        <Wrench className="h-3.5 w-3.5 text-amber-500" />
                      )}
                    </div>
                    <p className="flex-1 leading-relaxed text-muted-foreground line-clamp-3">
                      {m.role === "TOOL"
                        ? `tool result · ${(m.toolResults as any)?.name ?? "?"}`
                        : m.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
