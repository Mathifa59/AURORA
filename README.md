# Reservalo — Sistema de reservas con agente IA

Producto SaaS de reservas con agente IA conversacional. Construido con arquitectura limpia, multi-tenant nativo, y diseño moderno tipo Stripe/Notion.

> No es una demo. Es una base lista para producción que un solo desarrollador puede convertir en SaaS comercial en cuestión de semanas.

## Stack

- **Frontend** — Next.js 14 (App Router) · React 18 · Tailwind CSS · Lucide
- **Backend** — Next.js API Routes · Server Components · Zod
- **DB** — PostgreSQL (vía Supabase) + Prisma ORM
- **Auth** — Supabase Auth (cliente listo para integrar)
- **IA** — OpenAI (function calling, modelo configurable)

## Arquitectura

```
src/
├── app/                       # Next.js App Router
│   ├── page.tsx              # Landing pública con chat widget
│   ├── admin/                # Panel admin (dashboard, calendario, reservas, ...)
│   └── api/                  # API REST + webhooks
│       ├── chat/             # Endpoint del agente IA
│       ├── reservations/     # CRUD de reservas
│       ├── services/         # CRUD de servicios
│       ├── availability/     # Reglas de horarios
│       └── webhooks/whatsapp # Webhook listo para WhatsApp Cloud API
│
├── server/                   # Capa de dominio (separación de capas)
│   ├── reservations/service.ts   # Motor: create/cancel/update/list
│   ├── availability/service.ts   # Cálculo de slots, anti-sobrebooking
│   ├── services/service.ts       # CRUD de servicios
│   └── ai/
│       ├── agent.ts          # Loop del agente con function calling
│       ├── tools.ts          # Definiciones JSON-Schema + handlers
│       └── prompts.ts        # System prompt parametrizado
│
├── lib/                      # Adaptadores
│   ├── prisma.ts            # Cliente con singleton
│   ├── supabase/{client,server}.ts
│   ├── openai.ts
│   ├── tenant.ts            # Resolución del business actual (multi-tenant)
│   └── utils.ts             # Date/time helpers, formato, cn()
│
└── components/
    ├── ui/                  # Primitives (Button, Card, Input, Badge)
    ├── chat/chat-widget.tsx # Widget flotante tipo Intercom
    └── admin/sidebar.tsx
```

### Flujo de capas

```
HTTP → API Route (validación zod) → Server Service (negocio) → Prisma → Postgres
                                       ↑
                              AI Agent (tools) ←─── /api/chat
```

Cada capa tiene una sola responsabilidad. Las API routes nunca llaman a Prisma directamente — pasan por `server/*/service.ts`. Cada operación es **tenant-scoped** vía `businessId` resuelto en `lib/tenant.ts`.

## Multi-tenant

Todas las tablas tienen `businessId` (excepto `Business` mismo). El cliente actual se resuelve en `getCurrentBusiness()` — hoy por slug en env, mañana por subdomain o sesión.

Tablas principales:

- `Business` — tenant
- `User` — staff/admin enlazado al `auth.users` de Supabase
- `Service` — qué se reserva (duración, capacidad, precio)
- `AvailabilityRule` — horarios semanales por día
- `Reservation` — con estados PENDING / CONFIRMED / ATTENDED / CANCELLED / NO_SHOW
- `Customer` — desnormalizado pero único por `(businessId, phone)`
- `Conversation` + `Message` — historial completo del chat
- `AgentLog` — toda llamada de tool con input/output/duración para auditoría

## Agente IA

`/api/chat` ejecuta `runAgentTurn()`:

1. Persiste mensaje del usuario en la `Conversation` por `sessionId`
2. Carga historial reciente y construye `messages` para OpenAI
3. Llama a `chat.completions` con `tools` (function calling)
4. Si el modelo invoca tools, ejecuta cada una con scope de tenant, persiste el resultado y vuelve a llamar al modelo (hasta `MAX_TOOL_TURNS=5`)
5. Persiste y devuelve la respuesta final

### Tools expuestas

| Tool | Descripción |
|------|-------------|
| `listarServicios` | Lista servicios activos con duración/precio/capacidad |
| `consultarDisponibilidad` | Slots de un día o sugerencias próximas |
| `crearReserva` | Crea con validación atómica anti-sobrebooking |
| `cancelarReserva` | Cancela por teléfono o reservaId |

El modelo nunca recibe el `businessId` como argumento — lo inyecta el runtime. Esto cierra la puerta a inyecciones cross-tenant desde el chat.

## Cómo correrlo

### 1. Requisitos

- Node 20+
- Cuenta en [Supabase](https://supabase.com) (gratis)
- API key de [OpenAI](https://platform.openai.com)

### 2. Configurar

```bash
cd SISTEMA
cp .env.example .env
```

Edita `.env`:

```env
DATABASE_URL="postgresql://postgres:...@db.xxx.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:...@db.xxx.supabase.co:5432/postgres?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o-mini"
DEFAULT_BUSINESS_SLUG="demo"
```

### 3. Instalar y poblar

```bash
npm install
npm run db:push        # crea tablas en Supabase
npm run db:generate    # genera Prisma Client
npm run db:seed        # crea negocio demo, servicios, reservas
```

### 4. Levantar

```bash
npm run dev
```

- Sitio público: http://localhost:3000
- Panel admin: http://localhost:3000/admin/dashboard
- Chat: click en la burbuja inferior derecha

## Datos de prueba

`npm run db:seed` crea:

- **Bistro Aurora** (slug `demo`) — restaurante de cocina de autor
- 4 servicios: Cena para 2, Cena para 4, Brunch dominical, Degustación del chef
- Horarios: Mar–Dom · 13:00–16:00 (comida) y 19:00–23:00 (cena), lunes cerrado
- 6 reservas distribuidas en los próximos 4 días con distintos estados

## Flujo end-to-end

1. Cliente entra a `/` → ve la landing y abre el chat.
2. Pregunta "¿qué tienen para esta noche para 2?" → el agente:
   - llama `listarServicios`
   - llama `consultarDisponibilidad` con la fecha de hoy
   - sugiere 2-3 huecos
3. Cliente elige hora y da nombre + teléfono → el agente llama `crearReserva`.
4. La reserva aparece de inmediato en `/admin/calendar` y `/admin/reservations`.
5. El staff confirma o marca atendida desde el panel.

## Bonus listos

- **WhatsApp** — `/api/webhooks/whatsapp` con verify handshake y reuso del mismo agent loop. Falta sólo configurar credenciales de Meta y registrar el webhook.
- **Logs del agente** — cada tool call queda en `AgentLog` con duración y status. Inspeccionables vía Prisma Studio (`npm run db:studio`) o futuras vistas admin.
- **Auditoría de conversaciones** — `/admin/conversations` muestra los últimos chats con sus mensajes.

## Decisiones técnicas

- **App Router con Server Components** para toda la lectura (más simple, sin estado cliente innecesario).
- **Prisma sobre Drizzle** — DX superior para iterar rápido en MVP; migrable después.
- **Sin RPCs ni Edge Functions de Supabase** — el motor vive en Next.js. Más fácil de testear, depurar y migrar.
- **Tools en español** porque el modelo razona mejor cuando los nombres coinciden con la lengua del prompt.
- **Capacidad por overlap** — `isSlotAvailable` cuenta `partySize` de reservas que se solapan, no por slot fijo, así soportamos reservas de duración variable.

## Próximos pasos sugeridos

1. **Auth en el panel admin** — middleware con `createSupabaseServerClient()` + tabla `User` ya está lista.
2. **Subdominios** — cambiar `getCurrentBusiness()` para resolver por `host`.
3. **Notificaciones** — wrapper en `lib/notifications.ts` (mock hoy, Resend/Twilio mañana).
4. **Testing** — Vitest + supertest sobre `server/*` (el motor es puro).
5. **Stripe** — `Subscription` por `Business` para monetizar como SaaS.

## Licencia

MIT — úsalo, fórkalo, véndelo.
