"use client";

import { cn } from "@/lib/utils";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { MobileSidebar } from "./mobile-sidebar";

export function MobileHeader({ businessName }: { businessName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold text-sm">{businessName}</span>
        </div>

        <button
          onClick={() => setOpen(true)}
          className={cn("btn-ghost h-9 w-9 p-0")}
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <MobileSidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
}
