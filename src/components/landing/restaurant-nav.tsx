"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "#experiencias", label: "Menú" },
  { href: "#horarios",     label: "Horarios" },
  { href: "#ubicacion",    label: "Ubicación" },
  { href: "/mis-reservas", label: "Mis reservas" },
];

export function RestaurantNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-stone-950/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-widest text-white uppercase">
              Bistro
            </span>
            <span className="text-xs tracking-[0.35em] text-amber-400 uppercase">
              Aurora
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm tracking-wide text-stone-300 transition-colors hover:text-amber-400"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/book"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-stone-950 transition-all hover:bg-amber-400 active:scale-95"
            >
              Reservar mesa
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-stone-950">
          <div className="flex items-center justify-between px-6 py-5">
            <span className="text-lg font-bold tracking-widest text-white uppercase">
              Bistro <span className="text-amber-400">Aurora</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-light tracking-widest text-stone-200 transition-colors hover:text-amber-400"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-full bg-amber-500 px-8 py-3 text-base font-semibold text-stone-950 transition hover:bg-amber-400"
            >
              Reservar mesa
            </Link>
          </nav>

          <p className="py-6 text-center text-xs tracking-widest text-stone-600 uppercase">
            Av. Reforma 123, Ciudad de México
          </p>
        </div>
      )}
    </>
  );
}
