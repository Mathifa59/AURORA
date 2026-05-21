import { OpenChatButton } from "@/components/landing/open-chat-button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function RestaurantCTA() {
  return (
    <section className="relative overflow-hidden bg-stone-950 px-4 py-16 text-center sm:px-6 sm:py-28">
      {/* Glow ambiental */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(245,158,11,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_30%_at_20%_80%,rgba(180,83,9,0.08),transparent)]" />

      {/* Líneas decorativas */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Ornamento */}
        <div className="mx-auto mb-5 flex items-center justify-center gap-3 text-amber-600/50 sm:mb-6">
          <div className="h-px w-10 bg-current sm:w-12" />
          <span className="text-base sm:text-lg">✦</span>
          <div className="h-px w-10 bg-current sm:w-12" />
        </div>

        <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl">
          ¿Listo para vivir{" "}
          <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
            la experiencia?
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-balance text-base font-light text-stone-400 sm:mt-5 sm:text-lg">
          Reserva en segundos desde aquí, o deja que nuestro asistente
          te ayude a elegir la mejor mesa para tu ocasión.
        </p>

        {/* CTAs — apilados en móvil */}
        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/book"
            className="flex items-center justify-center gap-2 rounded-full bg-amber-500 px-8 py-3.5 text-base font-semibold text-stone-950 shadow-xl shadow-amber-500/20 transition-all hover:bg-amber-400 hover:scale-105 active:scale-95"
          >
            Reservar mesa ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
          <OpenChatButton
            label="Hablar con el asistente"
            className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-base font-medium text-white backdrop-blur transition-all hover:bg-white/10 active:scale-95"
          />
        </div>

        {/* Disclaimer — envuelto correctamente en móvil */}
        <div className="mt-5 flex flex-col items-center gap-1 text-xs text-stone-600 sm:mt-6 sm:flex-row sm:justify-center sm:gap-0">
          <span>Confirmación inmediata</span>
          <span className="hidden sm:mx-2 sm:block">·</span>
          <span>Sin cargo por reserva</span>
          <span className="hidden sm:mx-2 sm:block">·</span>
          <span>Cancelación gratuita con 24 h de anticipación</span>
        </div>
      </div>
    </section>
  );
}
