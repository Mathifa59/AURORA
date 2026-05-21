import { OpenChatButton } from "@/components/landing/open-chat-button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function RestaurantHero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-stone-950 px-6 text-center">

      {/* Fondo: gradiente cálido tipo cena con velas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,158,11,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(180,83,9,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_20%_90%,rgba(120,53,15,0.10),transparent)]" />

      {/* Patrón de puntos sutil */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Pill superior */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium tracking-widest text-amber-400 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          Abierto hoy · 13:00 – 23:00
        </div>

        {/* Nombre */}
        <h1 className="text-balance text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl">
          Bistro{" "}
          <span
            className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent"
          >
            Aurora
          </span>
        </h1>

        {/* Separador ornamental */}
        <div className="my-6 flex items-center gap-3 text-amber-600/60">
          <div className="h-px w-16 bg-current" />
          <span className="text-sm tracking-[0.5em] uppercase">Ciudad de México</span>
          <div className="h-px w-16 bg-current" />
        </div>

        {/* Tagline */}
        <p className="mx-auto max-w-xl text-balance text-lg font-light leading-relaxed text-stone-300">
          Una experiencia gastronómica donde la cocina de autor se encuentra
          con los sabores más profundos de México.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-3.5 text-base font-semibold text-stone-950 shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-400 hover:shadow-amber-400/30 hover:scale-105 active:scale-95"
          >
            Reservar mesa
            <ArrowRight className="h-4 w-4" />
          </Link>
          <OpenChatButton
            label="Preguntarle al asistente IA"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-base font-medium text-white backdrop-blur transition-all hover:bg-white/10"
          />
        </div>

        {/* Hint chat */}
        <p className="mt-5 text-xs text-stone-500">
          ¿Tienes dudas? El asistente responde al instante — día y noche.
        </p>
      </div>

      {/* Degradado inferior para transición suave */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent" />

      {/* Flecha de scroll */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-stone-500 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Descubrir</span>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
