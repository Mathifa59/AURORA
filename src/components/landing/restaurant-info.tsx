import { Clock, Mail, MapPin, Phone } from "lucide-react";

const schedule = [
  { day: "Lunes",     hours: null },
  { day: "Martes",    hours: "13:00 – 16:00 · 19:00 – 23:00" },
  { day: "Miércoles", hours: "13:00 – 16:00 · 19:00 – 23:00" },
  { day: "Jueves",    hours: "13:00 – 16:00 · 19:00 – 23:00" },
  { day: "Viernes",   hours: "13:00 – 16:00 · 19:00 – 23:00" },
  { day: "Sábado",    hours: "13:00 – 16:00 · 19:00 – 23:30" },
  { day: "Domingo",   hours: "11:00 – 16:00 (Brunch) · 19:00 – 22:00" },
];

export function RestaurantInfo() {
  return (
    <section className="bg-stone-50 px-6 py-24">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-amber-600 uppercase">
            Visítanos
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Horarios y ubicación
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

          {/* Horarios */}
          <div id="horarios" className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">Horario semanal</h3>
            </div>

            <div className="space-y-3">
              {schedule.map(({ day, hours }) => (
                <div
                  key={day}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${
                    !hours
                      ? "bg-stone-50 text-stone-400"
                      : "bg-amber-50/50 text-stone-700"
                  }`}
                >
                  <span className={`font-medium ${!hours ? "text-stone-400" : "text-stone-900"}`}>
                    {day}
                  </span>
                  <span className={!hours ? "italic" : "text-stone-600"}>
                    {hours ?? "Cerrado"}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-stone-400">
              * Horarios sujetos a cambio en días festivos. Te recomendamos confirmar tu reserva.
            </p>
          </div>

          {/* Ubicación y contacto */}
          <div id="ubicacion" className="flex flex-col gap-6">

            {/* Mapa placeholder */}
            <div className="relative overflow-hidden rounded-2xl bg-stone-900 shadow-sm" style={{ height: 220 }}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(245,158,11,0.12),transparent)]" />
              {/* Grid decorativo tipo mapa */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 shadow-lg shadow-amber-500/40">
                  <MapPin className="h-6 w-6 text-stone-950" />
                </div>
                <p className="text-sm font-semibold text-white">Bistro Aurora</p>
                <p className="text-xs text-stone-400">Av. Paseo de la Reforma 123</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Ver en Google Maps →
                </a>
              </div>
            </div>

            {/* Datos de contacto */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-100 space-y-4">
              <h3 className="text-lg font-bold text-stone-900">Contacto</h3>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900 group-hover:text-amber-600 transition-colors">
                    Av. Paseo de la Reforma 123
                  </p>
                  <p className="text-sm text-stone-500">
                    Col. Juárez, Cuauhtémoc, CDMX
                  </p>
                </div>
              </a>

              <a href="tel:+525555555555" className="flex items-center gap-3 group">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-stone-900 group-hover:text-amber-600 transition-colors">
                  +52 55 5555 5555
                </span>
              </a>

              <a href="mailto:hola@bistroaurora.mx" className="flex items-center gap-3 group">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-stone-900 group-hover:text-amber-600 transition-colors">
                  hola@bistroaurora.mx
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
