import { Sparkles } from "lucide-react";
import Link from "next/link";
import { ReservationLookup } from "./reservation-lookup";

export const metadata = {
  title: "Mis reservas — Bistro Aurora",
  description: "Consulta y cancela tus reservas ingresando tu número de teléfono.",
};

export default function MisReservasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-background to-background">
      {/* Nav mínima */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">Bistro Aurora</span>
          </Link>
          <Link
            href="/book"
            className="btn-primary h-8 px-4 text-xs gap-1.5"
          >
            Nueva reserva
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Mis reservas
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Ingresa tu número de teléfono para ver y gestionar tus reservas.
          </p>
        </div>

        <ReservationLookup />
      </main>
    </div>
  );
}
