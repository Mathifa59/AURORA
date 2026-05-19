"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function BookError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[book error]", error);
  }, [error]);

  const isPaused =
    (error.message ?? "").includes("ENOTFOUND") ||
    (error.message ?? "").includes("tenant");

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold">
        {isPaused ? "Servicio temporalmente no disponible" : "Error al cargar"}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {isPaused
          ? "Estamos teniendo problemas con nuestra base de datos. Por favor intenta en unos minutos."
          : "No pudimos cargar la página de reservas. Intenta de nuevo."}
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-ghost text-sm h-9 px-4">
          ← Volver al inicio
        </Link>
        <button onClick={reset} className="btn-primary text-sm h-9 px-4 gap-2">
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </button>
      </div>
    </div>
  );
}
