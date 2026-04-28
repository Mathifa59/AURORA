"use client";

import { cn } from "@/lib/utils";
import {
  Calendar,
  ClipboardList,
  Clock,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Reservas", icon: ClipboardList },
  { href: "/admin/calendar", label: "Calendario", icon: Calendar },
  { href: "/admin/services", label: "Servicios", icon: Wrench },
  { href: "/admin/availability", label: "Disponibilidad", icon: Clock },
  { href: "/admin/conversations", label: "Conversaciones", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-muted/20 md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="font-semibold tracking-tight">Reservalo</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
          Volver al sitio
        </Link>
      </div>
    </aside>
  );
}
