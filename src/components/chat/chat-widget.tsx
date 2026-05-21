"use client";

import { cn } from "@/lib/utils";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const SESSION_KEY = "bistro:sessionId";
const HISTORY_KEY = "bistro:history";

function genSessionId() {
  return `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session + history from localStorage
  useEffect(() => {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = genSessionId();
      localStorage.setItem(SESSION_KEY, id);
    }
    setSessionId(id);

    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      try {
        setMessages(JSON.parse(raw));
      } catch {}
    } else {
      setMessages([
        {
          role: "assistant",
          content:
            "¡Hola! 👋 Soy el asistente. Puedo ayudarte a reservar, ver disponibilidad o cancelar una cita. ¿Qué necesitas?",
        },
      ]);
    }
  }, []);

  // Persist + scroll
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages([
          ...next,
          {
            role: "assistant",
            content: "Ups, algo falló. ¿Puedes intentar de nuevo?",
          },
        ]);
      } else {
        setMessages([...next, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "No pude conectar. Revisa tu internet." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function reset() {
    const id = genSessionId();
    localStorage.setItem(SESSION_KEY, id);
    setSessionId(id);
    localStorage.removeItem(HISTORY_KEY);
    setMessages([
      {
        role: "assistant",
        content: "Empezamos de nuevo. ¿En qué te ayudo?",
      },
    ]);
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all",
          "bg-gradient-to-br from-amber-500 to-orange-600 text-white",
          "hover:shadow-xl hover:scale-105 active:scale-95",
          open && "rotate-90"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute top-0 right-0 h-3 w-3 animate-pulse-soft rounded-full bg-emerald-400 ring-2 ring-white" />
        )}
      </button>

      {/* Panel */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-[400px] origin-bottom-right",
          "transition-all duration-300",
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "pointer-events-none opacity-0 scale-95 translate-y-4"
        )}
      >
        <div className="card-elevated overflow-hidden flex flex-col h-[600px] max-h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-amber-500 to-orange-600 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Asistente</p>
                <p className="text-xs text-white/80 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  En línea ahora
                </p>
              </div>
            </div>
            <button
              onClick={reset}
              className="text-xs text-white/80 hover:text-white transition-colors"
            >
              Nueva
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-muted/30">
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}
            {loading && <TypingBubble />}
          </div>

          {/* Input */}
          <div className="border-t border-border bg-background p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Escribe un mensaje..."
                className="input flex-1"
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground text-center">
              Asistente impulsado por IA · puede equivocarse
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Bubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div
      className={cn("flex animate-slide-up", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-wrap",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-white border border-border rounded-bl-md"
        )}
      >
        {content}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white border border-border px-4 py-3 shadow-sm">
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
      style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }}
    />
  );
}
