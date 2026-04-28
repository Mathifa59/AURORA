"use client";

import { MessageSquare } from "lucide-react";

export function OpenChatButton() {
  function open() {
    const launcher = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Abrir chat"]'
    );
    launcher?.click();
  }
  return (
    <button onClick={open} className="btn-secondary h-12 px-6 text-base">
      <MessageSquare className="h-4 w-4" />
      Probar el agente
    </button>
  );
}
