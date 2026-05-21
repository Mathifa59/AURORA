import Link from "next/link";

const NAV = [
  { href: "#experiencias", label: "Experiencias" },
  { href: "#horarios",     label: "Horarios" },
  { href: "#ubicacion",    label: "Ubicación" },
  { href: "/book",         label: "Reservar mesa" },
  { href: "/mis-reservas", label: "Mis reservas" },
];

export function RestaurantFooter() {
  return (
    <footer className="bg-stone-950">
      {/* Línea decorativa superior */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">

          {/* Brand */}
          <div className="sm:col-span-1">
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold tracking-widest text-white uppercase">
                Bistro
              </span>
              <span className="text-sm tracking-[0.4em] text-amber-400 uppercase">
                Aurora
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-stone-500">
              Cocina de autor en el corazón de la Ciudad de México. Una
              experiencia gastronómica diseñada para recordarse.
            </p>
            <div className="mt-6 flex items-center gap-1 text-xs text-stone-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Abierto hoy · Hasta las 23:00</span>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="mb-4 text-xs font-semibold tracking-[0.2em] text-stone-400 uppercase">
              Navegar
            </h4>
            <ul className="space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-stone-500 transition-colors hover:text-amber-400"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="mb-4 text-xs font-semibold tracking-[0.2em] text-stone-400 uppercase">
              Contacto
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-500">
              <li>
                <a href="tel:+525555555555" className="hover:text-amber-400 transition-colors">
                  +52 55 5555 5555
                </a>
              </li>
              <li>
                <a href="mailto:hola@bistroaurora.mx" className="hover:text-amber-400 transition-colors">
                  hola@bistroaurora.mx
                </a>
              </li>
              <li className="text-stone-600">
                Av. Paseo de la Reforma 123<br />
                Col. Juárez, CDMX
              </li>
            </ul>

            {/* Admin link discreto */}
            <div className="mt-6 border-t border-stone-800 pt-4">
              <Link
                href="/login"
                className="text-xs text-stone-700 hover:text-stone-500 transition-colors"
              >
                Acceso administración →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-8 sm:flex-row">
          <p className="text-xs text-stone-700">
            © {new Date().getFullYear()} Bistro Aurora · Todos los derechos reservados
          </p>
          <p className="text-xs text-stone-800">
            Reservas gestionadas con tecnología IA
          </p>
        </div>
      </div>
    </footer>
  );
}
