"use client";

import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useState } from "react";

interface FormData {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

interface Props {
  loading: boolean;
  error: string | null;
  onSubmit: (data: { name: string; phone: string; email?: string; notes?: string }) => void;
}

export function StepForm({ loading, error, onSubmit }: Props) {
  const [form, setForm] = useState<FormData>({ name: "", phone: "", email: "", notes: "" });

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      notes: form.notes.trim() || undefined,
    });
  }

  const valid = form.name.trim().length >= 2 && form.phone.trim().length >= 6;

  return (
    <div>
      <h2 className="text-xl font-semibold">Tus datos</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Solo los necesarios para confirmar tu cita.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="name">Nombre completo *</Label>
          <Input
            id="name"
            required
            minLength={2}
            value={form.name}
            onChange={set("name")}
            placeholder="María López"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone">Teléfono *</Label>
          <Input
            id="phone"
            required
            minLength={6}
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+52 55 1234 5678"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email <span className="text-muted-foreground">(opcional)</span></Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="maria@ejemplo.com"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="notes">Notas <span className="text-muted-foreground">(opcional)</span></Label>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={set("notes")}
            placeholder="Alergias, requerimientos especiales..."
            rows={2}
            className="mt-1"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} disabled={!valid} className="w-full">
          Confirmar reserva
        </Button>
      </form>
    </div>
  );
}
