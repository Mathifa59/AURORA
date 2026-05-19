"use client";

import { Input, Label } from "@/components/ui/input";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { useState } from "react";

const TIMEZONES = [
  "America/Mexico_City",
  "America/Bogota",
  "America/Lima",
  "America/Santiago",
  "America/Buenos_Aires",
  "America/Caracas",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/Madrid",
  "Europe/London",
  "UTC",
];

const CURRENCIES = [
  { code: "MXN", label: "MXN — Peso mexicano" },
  { code: "COP", label: "COP — Peso colombiano" },
  { code: "PEN", label: "PEN — Sol peruano" },
  { code: "CLP", label: "CLP — Peso chileno" },
  { code: "ARS", label: "ARS — Peso argentino" },
  { code: "USD", label: "USD — Dólar americano" },
  { code: "EUR", label: "EUR — Euro" },
];

const LOCALES = [
  { code: "es-MX", label: "Español (México)" },
  { code: "es-CO", label: "Español (Colombia)" },
  { code: "es-PE", label: "Español (Perú)" },
  { code: "es-CL", label: "Español (Chile)" },
  { code: "es-AR", label: "Español (Argentina)" },
  { code: "es-ES", label: "Español (España)" },
  { code: "en-US", label: "English (US)" },
];

interface BusinessData {
  id: string;
  name: string;
  description: string;
  timezone: string;
  locale: string;
  currency: string;
  phone: string;
  email: string;
  address: string;
  brandColor: string;
}

interface Props {
  business: BusinessData;
}

export function SettingsForm({ business }: Props) {
  const [form, setForm] = useState<BusinessData>(business);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof BusinessData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/business`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          timezone: form.timezone,
          locale: form.locale,
          currency: form.currency,
          phone: form.phone || null,
          email: form.email || null,
          address: form.address || null,
          brandColor: form.brandColor,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al guardar.");
      }
      setSaved(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          General
        </h2>

        <div>
          <Label htmlFor="name">Nombre del negocio *</Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Input
            id="description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Una breve descripción para el agente IA"
          />
        </div>

        <div>
          <Label htmlFor="brandColor">Color de marca</Label>
          <div className="flex items-center gap-3 mt-1">
            <input
              id="brandColor"
              type="color"
              value={form.brandColor}
              onChange={(e) => set("brandColor", e.target.value)}
              className="h-9 w-16 cursor-pointer rounded-md border border-input"
            />
            <span className="text-sm text-muted-foreground font-mono">
              {form.brandColor}
            </span>
          </div>
        </div>
      </div>

      {/* Localización */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Localización
        </h2>

        <div>
          <Label htmlFor="timezone">Zona horaria</Label>
          <select
            id="timezone"
            value={form.timezone}
            onChange={(e) => set("timezone", e.target.value)}
            className="input mt-1"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="locale">Idioma / Región</Label>
            <select
              id="locale"
              value={form.locale}
              onChange={(e) => set("locale", e.target.value)}
              className="input mt-1"
            >
              {LOCALES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="currency">Moneda</Label>
            <select
              id="currency"
              value={form.currency}
              onChange={(e) => set("currency", e.target.value)}
              className="input mt-1"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Contacto
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+52 55 1234 5678"
            />
          </div>
          <div>
            <Label htmlFor="email">Correo de contacto</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="hola@negocio.com"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="Calle, colonia, ciudad"
          />
        </div>
      </div>

      {/* Actions */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            Guardado
          </span>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary h-9 px-5 gap-2 text-sm"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {loading ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
