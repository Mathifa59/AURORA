"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Rule = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  active: boolean;
};

const DAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export function AvailabilityManager({ initial }: { initial: Rule[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const grouped: Record<number, Rule[]> = {};
  for (let i = 0; i < 7; i++) grouped[i] = [];
  initial.forEach((r) => grouped[r.dayOfWeek].push(r));

  async function addRule(day: number) {
    setBusy(`add-${day}`);
    try {
      await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "18:00",
          active: true,
        }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function updateRule(id: string, patch: Partial<Rule>) {
    setBusy(id);
    try {
      await fetch(`/api/availability/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function removeRule(id: string) {
    setBusy(id);
    try {
      await fetch(`/api/availability/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  // Re-order: Mon..Sun
  const order = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="card-elevated overflow-hidden">
      <div className="divide-y divide-border">
        {order.map((day) => (
          <div key={day} className="flex flex-col md:flex-row md:items-start gap-4 p-5">
            <div className="md:w-32 shrink-0">
              <p className="font-semibold">{DAYS[day]}</p>
              <p className="text-xs text-muted-foreground">
                {grouped[day].length === 0 ? "Cerrado" : `${grouped[day].length} franja(s)`}
              </p>
            </div>
            <div className="flex-1 space-y-2">
              {grouped[day].map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background p-2"
                >
                  <Input
                    type="time"
                    value={r.startTime}
                    onChange={(e) => updateRule(r.id, { startTime: e.target.value })}
                    className="w-28"
                  />
                  <span className="text-muted-foreground">→</span>
                  <Input
                    type="time"
                    value={r.endTime}
                    onChange={(e) => updateRule(r.id, { endTime: e.target.value })}
                    className="w-28"
                  />
                  <label className="ml-auto inline-flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={r.active}
                      onChange={(e) => updateRule(r.id, { active: e.target.checked })}
                    />
                    Activo
                  </label>
                  <button
                    onClick={() => removeRule(r.id)}
                    disabled={busy === r.id}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => addRule(day)}
                loading={busy === `add-${day}`}
              >
                <Plus className="h-3.5 w-3.5" />
                Añadir franja
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
