import { ChatWidget } from "@/components/chat/chat-widget";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Reservar cita — Reservalo",
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-background to-background">
      {/* Minimal nav */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">Reservalo</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Volver
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">{children}</main>

      <ChatWidget />
    </div>
  );
}
