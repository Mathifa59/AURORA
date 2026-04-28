import { ChatWidget } from "@/components/chat/chat-widget";
import { OpenChatButton } from "@/components/landing/open-chat-button";
import {
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background grid + gradient */}
      <div className="absolute inset-0 -z-10 grid-bg" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b from-indigo-50 via-white to-transparent" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-300/30 via-violet-300/30 to-fuchsia-300/30 blur-3xl" />

      <Nav />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">Reservalo</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Funciones
          </a>
          <a href="#flow" className="text-muted-foreground hover:text-foreground transition-colors">
            Cómo funciona
          </a>
          <Link
            href="/admin/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Panel admin
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="btn-ghost text-sm">
            Iniciar sesión
          </Link>
          <Link href="/admin/dashboard" className="btn-primary text-sm">
            Empezar
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Agente IA que reserva por ti, 24/7
      </div>

      <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
        Tu recepcionista virtual,
        <br />
        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          siempre disponible.
        </span>
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
        Un sistema de reservas con agente IA que conversa con tus clientes, valida
        disponibilidad y agenda citas — sin sobrebooking, sin fricciones.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/admin/dashboard" className="btn-primary h-12 px-6 text-base">
          Ver el panel
          <ArrowRight className="h-4 w-4" />
        </Link>
        <OpenChatButton />
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Click en la burbuja inferior derecha para empezar a chatear con el agente IA.
      </p>

      {/* Mock dashboard preview */}
      <div className="mt-16">
        <DashboardMock />
      </div>
    </section>
  );
}

function DashboardMock() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="absolute -inset-x-20 -inset-y-10 -z-10 rounded-[3rem] bg-gradient-to-b from-indigo-500/10 to-fuchsia-500/0 blur-3xl" />
      <div className="card-elevated overflow-hidden border-2 border-border/60">
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <div className="ml-3 text-xs text-muted-foreground">reservalo.app/admin</div>
        </div>
        <div className="grid grid-cols-3 gap-0">
          <div className="col-span-1 border-r border-border/60 bg-muted/20 p-5">
            <div className="space-y-3">
              {["Dashboard", "Reservas", "Calendario", "Servicios", "Disponibilidad"].map(
                (item, i) => (
                  <div
                    key={item}
                    className={`rounded-md px-3 py-2 text-sm ${
                      i === 0 ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="col-span-2 p-6 text-left">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Reservas hoy", value: "24", trend: "+12%" },
                { label: "Confirmadas", value: "18", trend: "+8%" },
                { label: "Ingresos", value: "$4.2k", trend: "+18%" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-xl font-semibold">{s.value}</p>
                  <p className="text-xs text-emerald-600">{s.trend}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">
                Próximas reservas
              </p>
              <div className="space-y-2">
                {[
                  { name: "María López", svc: "Cena · 8pm", color: "bg-indigo-500" },
                  { name: "Juan Pérez", svc: "Corte · 6pm", color: "bg-violet-500" },
                  { name: "Ana García", svc: "Consulta · 5pm", color: "bg-fuchsia-500" },
                ].map((r) => (
                  <div
                    key={r.name}
                    className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2"
                  >
                    <div className={`h-2 w-2 rounded-full ${r.color}`} />
                    <span className="text-sm font-medium">{r.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{r.svc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Features() {
  const features = [
    {
      icon: Bot,
      title: "Agente IA conversacional",
      desc: "Habla con tus clientes en lenguaje natural. Pregunta lo que falta, propone horarios y cierra la reserva.",
    },
    {
      icon: Calendar,
      title: "Motor de disponibilidad",
      desc: "Reglas semanales, duración por servicio, capacidad simultánea y bloqueo automático contra sobrebooking.",
    },
    {
      icon: Shield,
      title: "Multi-tenant nativo",
      desc: "Arquitectura SaaS desde el día uno: cada negocio aislado por business_id, listo para escalar.",
    },
    {
      icon: Zap,
      title: "Integra WhatsApp",
      desc: "Webhook preparado para WhatsApp Cloud API. El mismo agente, en el canal que prefiera el cliente.",
    },
    {
      icon: CheckCircle2,
      title: "Estados completos",
      desc: "Pendiente, confirmada, cancelada, atendida y no-show. Logs completos del agente para auditoría.",
    },
    {
      icon: Sparkles,
      title: "UI moderna",
      desc: "Inspirada en Stripe y Notion. Calendario tipo Google Calendar y panel admin que enamora.",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Todo lo que necesita un negocio que reserva.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Un producto pulido, no un script. Construido como SaaS desde el inicio.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: 1,
      title: "Cliente abre el chat",
      desc: "El widget flotante invita a conversar. Sin formularios fríos.",
    },
    {
      n: 2,
      title: "El agente conversa",
      desc: "Pregunta qué necesita, propone huecos y recopila los datos faltantes.",
    },
    {
      n: 3,
      title: "Crea la reserva",
      desc: "Validación atómica contra el motor: cero sobrebooking, registro auditable.",
    },
  ];

  return (
    <section id="flow" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Cómo funciona
        </h2>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="relative">
            <div className="text-6xl font-bold text-primary/20">0{s.n}</div>
            <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-12 text-center text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M30%2030m-1%200a1%201%200%201%200%202%200a1%201%200%201%200%20-2%200%22%20fill%3D%22%23fff%22%20fill-opacity%3D%220.1%22%2F%3E%3C%2Fsvg%3E')] opacity-30" />
        <h2 className="relative text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Listo en 5 minutos.
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-white/90">
          Configura servicios, horarios, conecta el agente y empieza a recibir
          reservas mientras duermes.
        </p>
        <Link
          href="/admin/dashboard"
          className="relative mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:scale-105"
        >
          Abrir el panel
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
            <Sparkles className="h-3 w-3" />
          </div>
          <span>Reservalo</span>
        </div>
        <p>© {new Date().getFullYear()} — Construido con Next.js, Prisma y OpenAI.</p>
      </div>
    </footer>
  );
}
