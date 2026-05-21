"use client";

import { MessageSquare } from "lucide-react";

interface Props {
  label?: string;
  className?: string;
}

export function OpenChatButton({
  label = "Probar el agente",
  className = "btn-secondary h-12 px-6 text-base",
}: Props) {
  function open() {
    const launcher = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Abrir chat"]'
    );
    launcher?.click();
  }

  return (
    <button onClick={open} className={className}>
      <MessageSquare className="h-4 w-4" />
      {label}
    </button>
  );
}
