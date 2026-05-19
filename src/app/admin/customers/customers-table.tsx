"use client";

import { formatDateTime } from "@/lib/utils";
import { Mail, Phone, Search } from "lucide-react";
import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  createdAt: string;
  _count: { reservations: number };
  reservations: Array<{
    startsAt: string;
    service: { name: string };
  }>;
};

export function CustomersTable({ locale }: { locale: string }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    fetch(`/api/customers${q ? `?q=${encodeURIComponent(q)}` : ""}`, {
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((d) => { setCustomers(d.customers); setLoading(false); })
      .catch(() => {});
    return () => ctrl.abort();
  }, [q]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, teléfono o email..."
          className="input pl-9"
        />
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Contacto</th>
                <th className="px-5 py-3 font-medium">Reservas</th>
                <th className="px-5 py-3 font-medium">Próxima cita</th>
                <th className="px-5 py-3 font-medium">Desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                    Cargando...
                  </td>
                </tr>
              )}
              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="space-y-0.5">
                      {c.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" /> {c.phone}
                        </div>
                      )}
                      {c.email && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" /> {c.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="badge bg-primary/10 text-primary ring-primary/20">
                      {c._count.reservations}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {c.reservations[0]
                      ? `${c.reservations[0].service.name} · ${formatDateTime(new Date(c.reservations[0].startsAt), locale)}`
                      : "—"}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString(locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
