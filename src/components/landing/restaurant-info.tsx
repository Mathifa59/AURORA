import { Clock, Mail, MapPin, Phone } from "lucide-react";

const schedule = [
  { day: "Lunes",     lunch: null,           dinner: null,           closed: true },
  { day: "Martes",    lunch: "13:00–16:00",  dinner: "19:00–23:00",  closed: false },
  { day: "Miércoles", lunch: "13:00–16:00",  dinner: "19:00–23:00",  closed: false },
  { day: "Jueves",    lunch: "13:00–16:00",  dinner: "19:00–23:00",  closed: false },
  { day: "Viernes",   lunch: "13:00–16:00",  dinner: "19:00–23:00",  closed: false },
  { day: "Sábado",    lunch: "13:00–16:00",  dinner: "19:00–23:30",  closed: false },
  { day: "Domingo",   lunch: "11:00–16:00",  dinner: "19:00–22:00",  closed: false, note: "Brunch" },
];

export function RestaurantInfo() {
  return (
    <section className="bg-stone-50 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
          <p className="mb-2 text-xs font-semibold tracking-[0.3em] text-amber-600 uppercase sm:mb-3">
            Visítanos
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Horarios y ubicación
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">

          {/* ── Horarios ────────────────────────────── */}
          <div id="horarios" className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 sm:text-xl">Horario semanal</h3>
            </div>

            <div className="space-y-2">
              {schedule.map(({ day, lunch, dinner, closed, note }) => (
                <div
                  key={day}
                  className={`rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 ${
                    closed ? "bg-stone-50" : "bg-amber-50/40"
                  }`}
                >
                  {/* Móvil: apilado; desktop: fila */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-sm font-semibold min-w-[80px] sm:min-w-[90px] ${
                        closed ? "text-stone-400" : "text-stone-900"
                      }`}
                    >
                      {day}
                    </span>

                    {closed ? (
                      <span className="text-sm italic text-stone-400">Cerrado</span>
                    ) : (
                      <div className="flex flex-col items-end gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                        <span className="text-xs text-stone-600 sm:text-sm">
                          {lunch}
                          {note === "Brunch" && (
                            <span className="ml-1 rounded-full bg-pink-100 px-1.5 py-0.5 text-[10px] font-semibold text-pink-600">
                              Brunch
                            </span>
                          )}
                        </span>
                        <span className="hidden text-stone-300 sm:block">·</span>
                        <span className="text-xs text-stone-600 sm:text-sm">{dinner}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-stone-400">
              * Horarios sujetos a cambio en días festivos.
            </p>
          </div>

          {/* ── Ubicación y contacto ─────────────────── */}
          <div id="ubicacion" className="flex flex-col gap-4 sm:gap-6">

            {/* Mapa placeholder */}
            <div
              className="relative overflow-hidden rounded-2xl bg-stone-900 shadow-sm"
              style={{ minHeight: 200 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(245,158,11,0.12),transparent)]" />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 shadow-lg shadow-amber-500/40">
                  <MapPin className="h-6 w-6 text-stone-950" />
                </div>
                <p className="text-sm font-semibold text-white">Bistro Aurora</p>
                <p className="text-xs text-stone-400">Av. Paseo de la Reforma 123</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
                >
                  Ver en Google Maps →
                </a>
              </div>
            </div>

            {/* Contacto */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 sm:p-6">
              <h3 className="mb-4 text-lg font-bold text-stone-900">Contacto</h3>

              <div className="space-y-3">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 transition-colors group-hover:bg-amber-50 group-hover:text-amber-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-900 transition-colors group-hover:text-amber-600">
                      Av. Paseo de la Reforma 123
                    </p>
                    <p className="text-sm text-stone-500">Col. Juárez, Cuauhtémoc, CDMX</p>
                  </div>
                </a>

                <a href="tel:+525555555555" className="group flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 transition-colors group-hover:bg-amber-50 group-hover:text-amber-600">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-stone-900 transition-colors group-hover:text-amber-600">
                    +52 55 5555 5555
                  </span>
                </a>

                <a href="mailto:hola@bistroaurora.mx" className="group flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 transition-colors group-hover:bg-amber-50 group-hover:text-amber-600">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="truncate text-sm font-medium text-stone-900 transition-colors group-hover:text-amber-600">
                    hola@bistroaurora.mx
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
