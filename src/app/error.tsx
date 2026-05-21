"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <Sparkles className="h-6 w-6" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">Error inesperado</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Algo falló en la aplicación. Puedes intentar de nuevo o volver al inicio.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => (window.location.href = "/")}>
          Ir al inicio
        </Button>
        <Button onClick={reset}>Reintentar</Button>
      </div>
    </div>
  );
}
