import { OpenChatButton } from "@/components/landing/open-chat-button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function RestaurantCTA() {
  return (
    <section className="relative overflow-hidden bg-stone-950 px-6 py-28 text-center">
      {/* Glow ambiental */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(245,158,11,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_30%_at_20%_80%,rgba(180,83,9,0.08),transparent)]" />

      {/* Líneas decorativas */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Ornamento */}
        <div className="mx-auto mb-6 flex items-center justify-center gap-3 text-amber-600/50">
          <div className="h-px w-12 bg-current" />
          <span className="text-lg">✦</span>
          <div className="h-px w-12 bg-current" />
        </div>

        <h2 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
          ¿Listo para vivir{" "}
          <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
            la experiencia?
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-balance text-lg font-light text-stone-400">
          Reserva en segundos desde aquí, o deja que nuestro asistente
          te ayude a elegir la mejor mesa para tu ocasión.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-3.5 text-base font-semibold text-stone-950 shadow-xl shadow-amber-500/20 transition-all hover:bg-amber-400 hover:shadow-amber-400/30 hover:scale-105 active:scale-95"
          >
            Reservar mesa ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
          <OpenChatButton
            label="Hablar con el asistente"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-base font-medium text-white backdrop-blur transition-all hover:bg-white/10"
          />
        </div>

        <p className="mt-6 text-xs text-stone-600">
          Confirmación inmediata · Sin cargo por reserva · Cancelación gratuita con 24h de anticipación
        </p>
      </div>
    </section>
  );
}
