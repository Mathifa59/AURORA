"use client";

import { AlertTriangle, Database, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin error]", error);
  }, [error]);

  const msg = error.message ?? "";

  const isPaused =
    msg.includes("ENOTFOUND") ||
    msg.includes("tenant") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("P1001") ||
    msg.includes("P1017");

  const isSeed =
    msg.includes("seed") ||
    msg.includes("Business") ||
    msg.includes("P2025");

  function title() {
    if (isPaused) return "Base de datos no disponible";
    if (isSeed) return "Negocio no configurado";
    return "Algo salió mal";
  }

  function description() {
    if (isPaused)
      return 'El proyecto de Supabase está pausado. Ve al dashboard de Supabase y haz clic en "Restore project", luego espera ~2 minutos y recarga.';
    if (isSeed)
      return "No se encontró el negocio configurado. Ejecuta npm run db:seed en la terminal.";
    return msg || "Error inesperado. Intenta de nuevo.";
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
        {isPaused ? (
          <Database className="h-7 w-7" />
        ) : (
          <AlertTriangle className="h-7 w-7" />
        )}
      </div>

      <h2 className="text-lg font-semibold">{title()}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
        {description()}
      </p>

      {isPaused && (
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-xs font-medium text-primary hover:underline"
        >
          Abrir Supabase Dashboard →
        </a>
      )}

      {error.digest && (
        <p className="mt-2 text-xs text-muted-foreground/60">ID: {error.digest}</p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => (window.location.href = "/")}
          className="btn-ghost text-sm h-9 px-4"
        >
          Ir al inicio
        </button>
        <button onClick={reset} className="btn-primary text-sm h-9 px-4 gap-2">
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </button>
      </div>
    </div>
  );
}
