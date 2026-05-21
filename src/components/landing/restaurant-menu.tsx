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
    bg: "from-indigo-500/10 to-violet-500/5",
    badge: "Más popular",
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
    bg: "from-violet-500/10 to-purple-500/5",
    badge: null,
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
    bg: "from-pink-500/10 to-rose-500/5",
    badge: "Fin de semana",
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
    bg: "from-amber-500/10 to-orange-500/5",
    badge: "Exclusivo",
  },
];

export function RestaurantMenu() {
  return (
    <section id="experiencias" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-amber-600 uppercase">
            Experiencias
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Elige tu mesa
          </h2>
          <p className="mt-4 text-lg text-stone-500">
            Cada reserva es una experiencia diseñada. Selecciona la que mejor
            se adapte a tu ocasión.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {experiences.map((exp) => (
            <div
              key={exp.name}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/60"
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

              {/* Color top bar */}
              <div
                className={`h-1.5 w-full bg-gradient-to-r ${exp.bg}`}
                style={{ background: `linear-gradient(90deg, ${exp.color}40, ${exp.color}10)` }}
              />

              <div className="flex flex-1 flex-col p-6">
                {/* Icon */}
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: exp.color + "20" }}
                >
                  <span className="text-xl" style={{ color: exp.color }}>
                    {exp.name.includes("2") ? "🕯️" :
                     exp.name.includes("4") ? "🥂" :
                     exp.name.includes("Brunch") ? "🥞" : "⭐"}
                  </span>
                </div>

                {/* Text */}
                <div className="mt-4 flex-1">
                  <p className="text-xs font-medium tracking-wide" style={{ color: exp.color }}>
                    {exp.tagline}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-stone-900">{exp.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">
                    {exp.description}
                  </p>
                </div>

                {/* Meta */}
                <div className="mt-5 flex items-center gap-4 border-t border-stone-100 pt-4 text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {exp.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
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

        {/* CTA bajo las cards */}
        <div className="mt-12 text-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-stone-700 hover:scale-105 active:scale-95"
          >
            Ver disponibilidad y reservar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
