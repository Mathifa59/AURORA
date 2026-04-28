"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/admin/dashboard");
      router.refresh();
    } catch (e: any) {
      setErr(e.message ?? "No pudimos iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 p-6">
      <div className="card-elevated w-full max-w-md p-8 animate-slide-up">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">Reservalo</span>
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight">Bienvenido</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Inicia sesión para entrar al panel.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {err && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200">
              {err}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Iniciar sesión
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link href="/admin/dashboard" className="font-medium text-primary hover:underline">
            Entrar como demo
          </Link>
        </p>
      </div>
    </div>
  );
}
