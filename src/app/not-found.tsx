import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-50/60 via-background to-background p-8 text-center">
      {/* Número grande decorativo */}
      <p className="text-[8rem] font-bold leading-none bg-gradient-to-br from-indigo-200 to-violet-200 bg-clip-text text-transparent select-none">
        404
      </p>

      <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Search className="h-7 w-7" />
      </div>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        Página no encontrada
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        La página que buscas no existe o fue movida. Verifica la URL o vuelve
        al inicio.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="btn-primary h-10 px-6 gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Ir al inicio
        </Link>
        <Link
          href="/book"
          className="btn-ghost h-10 px-6 text-sm"
        >
          Hacer una reserva
        </Link>
      </div>
    </div>
  );
}
