import { ArrowRight, Clock, Users } from "lucide-react";
import Link from "next/link";

const experiences = [
  {
    name: "Mesa para 2",
    tagline: "Velada íntima",
    description:
      "La mesa perfecta para dos. Servicio personalizado, ambiente íntimo y nuestra carta completa de temporada.",
    duration: 90,
    capacity: "2 personas",
    price: null,
    color: "#6366f1",
    badge: "Más popular",
    emoji: "🕯️",
  },
  {
    name: "Mesa para 4",
    tagline: "Entre amigos",
    description:
      "Comparte la experiencia Bistro Aurora con tu grupo. Ideal para celebraciones y reuniones especiales.",
    duration: 120,
    capacity: "4 personas",
    price: null,
    color: "#8b5cf6",
    badge: null,
    emoji: "🥂",
  },
  {
    name: "Brunch dominical",
    tagline: "Los domingos",
    description:
      "Nuestro brunch buffet con más de 30 platillos. Bebidas incluidas. Solo domingos de 11:00 a 14:00.",
    duration: 90,
    capacity: "Hasta 12",
    price: 650,
    color: "#ec4899",
    badge: "Fin de semana",
    emoji: "🥞",
  },
  {
    name: "Degustación del chef",
    tagline: "La experiencia máxima",
    description:
      "7 tiempos diseñados por el chef. Maridaje de vinos opcional. Cupo limitado a 4 mesas por noche.",
    duration: 150,
    capacity: "2 personas",
    price: 1800,
    color: "#f59e0b",
    badge: "Exclusivo",
    emoji: "⭐",
  },
];

export function RestaurantMenu() {
  return (
    <section id="experiencias" className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
          <p className="mb-2 text-xs font-semibold tracking-[0.3em] text-amber-600 uppercase sm:mb-3">
            Experiencias
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Elige tu mesa
          </h2>
          <p className="mt-3 text-base text-stone-500 sm:mt-4 sm:text-lg">
            Cada reserva es una experiencia diseñada. Selecciona la que mejor
            se adapte a tu ocasión.
          </p>
        </div>

        {/* Cards — 1 col móvil, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {experiences.map((exp) => (
            <div
              key={exp.name}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/60 active:scale-[0.99]"
            >
              {/* Badge */}
              {exp.badge && (
                <div
                  className="absolute right-3 top-3 z-10 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: exp.color }}
                >
                  {exp.badge}
                </div>
              )}

              {/* Barra de color superior */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: `linear-gradient(90deg, ${exp.color}50, ${exp.color}15)`,
                }}
              />

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                {/* Emoji icon */}
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                  style={{ backgroundColor: exp.color + "18" }}
                >
                  {exp.emoji}
                </div>

                {/* Texto */}
                <div className="mt-4 flex-1">
                  <p
                    className="text-xs font-semibold tracking-wide uppercase"
                    style={{ color: exp.color }}
                  >
                    {exp.tagline}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-stone-900">{exp.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">
                    {exp.description}
                  </p>
                </div>

                {/* Meta info */}
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-stone-100 pt-4 text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    {exp.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    {exp.capacity}
                  </span>
                  {exp.price && (
                    <span className="ml-auto font-semibold text-stone-700">
                      ${exp.price.toLocaleString("es-MX")} MXN
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA — full width en móvil */}
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/book"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-stone-700 hover:scale-105 active:scale-95 sm:w-auto"
          >
            Ver disponibilidad y reservar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
