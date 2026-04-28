"use client";

import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { formatMoney } from "@/lib/utils";
import { Clock, Plus, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Service = {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  capacity: number;
  priceCents: number;
  color: string;
  active: boolean;
};

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#ef4444"];

export function ServicesManager({
  initial,
  currency,
  locale,
}: {
  initial: Service[];
  currency: string;
  locale: string;
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    durationMinutes: 30,
    capacity: 1,
    priceCents: 0,
    color: COLORS[0],
  });

  async function create() {
    setBusyId("__new__");
    try {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setCreating(false);
      setForm({
        name: "",
        description: "",
        durationMinutes: 30,
        capacity: 1,
        priceCents: 0,
        color: COLORS[0],
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Desactivar este servicio?")) return;
    setBusyId(id);
    try {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function toggleActive(s: Service) {
    setBusyId(s.id);
    try {
      await fetch(`/api/services/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !s.active }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreating((v) => !v)} variant={creating ? "secondary" : "primary"}>
          <Plus className="h-4 w-4" /> {creating ? "Cancelar" : "Nuevo servicio"}
        </Button>
      </div>

      {creating && (
        <div className="card-elevated p-6 animate-slide-up">
          <h3 className="font-semibold mb-4">Nuevo servicio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Corte de cabello"
              />
            </div>
            <div>
              <Label htmlFor="dur">Duración (min)</Label>
              <Input
                id="dur"
                type="number"
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm({ ...form, durationMinutes: parseInt(e.target.value) || 30 })
                }
              />
            </div>
            <div>
              <Label htmlFor="cap">Capacidad simultánea</Label>
              <Input
                id="cap"
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label htmlFor="price">Precio (centavos)</Label>
              <Input
                id="price"
                type="number"
                value={form.priceCents}
                onChange={(e) => setForm({ ...form, priceCents: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="desc">Descripción</Label>
              <Textarea
                id="desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Color</Label>
              <div className="flex gap-2 mt-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    className={`h-8 w-8 rounded-full transition-all ${
                      form.color === c ? "ring-2 ring-offset-2 ring-foreground scale-110" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreating(false)}>
              Cancelar
            </Button>
            <Button onClick={create} loading={busyId === "__new__"} disabled={!form.name}>
              Crear servicio
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {initial.map((s) => (
          <div
            key={s.id}
            className={`card-elevated p-5 transition-all ${!s.active && "opacity-60"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-lg shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <div>
                  <h4 className="font-semibold">{s.name}</h4>
                  {s.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {s.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => remove(s.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {s.durationMinutes} min
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" /> {s.capacity}
              </span>
              <span className="ml-auto font-semibold text-foreground">
                {formatMoney(s.priceCents, currency, locale)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">
                {s.active ? "Activo" : "Inactivo"}
              </span>
              <button
                onClick={() => toggleActive(s)}
                disabled={busyId === s.id}
                className="text-xs font-medium text-primary hover:underline"
              >
                {s.active ? "Desactivar" : "Reactivar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
