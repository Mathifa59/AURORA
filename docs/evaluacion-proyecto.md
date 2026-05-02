# Evaluación del proyecto — Reservalo (SISTEMA)

> Fecha: 1 de mayo de 2026

SaaS multi-tenant de reservas con agente IA conversacional.
Stack: Next.js 14 (App Router) · React 18 · Tailwind CSS · Prisma · PostgreSQL/Supabase · OpenAI function calling.

---

## Lo que ya está implementado

### Base de datos (`prisma/schema.prisma`)

Modelos completos y bien indexados, todos `tenant-scoped`:

| Modelo | Descripción |
|--------|-------------|
| `Business` | Tenant central con zona horaria, locale, moneda y color de marca |
| `User` | Staff/admin con roles `ADMIN` / `STAFF`, ligado a Supabase Auth vía `authId` |
| `Service` | Qué se reserva — duración, capacidad simultánea, precio |
| `AvailabilityRule` | Horarios semanales por día (0=Dom … 6=Sáb) |
| `Customer` | Único por `(businessId, phone)`, desnormalizado para velocidad |
| `Reservation` | 5 estados (`PENDING / CONFIRMED / ATTENDED / CANCELLED / NO_SHOW`), 4 fuentes (`WEB / AI_AGENT / WHATSAPP / ADMIN`) |
| `Conversation` + `Message` | Historial completo del chat, multi-canal |
| `AgentLog` | Auditoría de cada tool call con input, output, duración y status |

Seed funcional (`prisma/seed.ts`) — Bistro Aurora demo con servicios, horarios y 6 reservas distribuidas.

---

### Capa de dominio (`src/server/`)

Separación limpia: las API routes nunca llaman a Prisma directamente.

- **`reservations/service.ts`** — create / cancel / update / list
- **`availability/service.ts`** — cálculo de slots libres con anti-sobrebooking por overlap de `partySize`
- **`services/service.ts`** — CRUD de servicios
- **`ai/agent.ts`** — loop con `MAX_TOOL_TURNS=5`, persiste mensajes, reintenta tras cada tool call
- **`ai/tools.ts`** — 4 tools con JSON Schema + handlers, `businessId` inyectado en runtime (cero inyección cross-tenant)
- **`ai/prompts.ts`** — system prompt parametrizado por tenant

### Tools del agente IA

| Tool | Descripción |
|------|-------------|
| `listarServicios` | Lista servicios activos con duración, precio y capacidad |
| `consultarDisponibilidad` | Slots libres de un día o sugerencias próximas |
| `crearReserva` | Crea con validación atómica anti-sobrebooking |
| `cancelarReserva` | Cancela por teléfono o reservaId |

---

### API REST (`src/app/api/`)

| Endpoint | Operaciones |
|----------|-------------|
| `/api/chat` | POST — loop del agente IA |
| `/api/reservations` | GET (lista) · POST (crear) |
| `/api/reservations/[id]` | GET · PATCH · DELETE |
| `/api/services` | GET · POST |
| `/api/services/[id]` | GET · PATCH · DELETE |
| `/api/availability` | GET · POST |
| `/api/availability/[id]` | GET · PATCH · DELETE |
| `/api/webhooks/whatsapp` | GET (verify handshake) · POST (mensajes entrantes) |

---

### Panel admin (`src/app/admin/`)

| Ruta | Estado |
|------|--------|
| `/admin/dashboard` | Métricas generales |
| `/admin/calendar` | Vista de calendario con reservas |
| `/admin/reservations` | Tabla con filtros y estados |
| `/admin/services` | Gestión de servicios (crear/editar/desactivar) |
| `/admin/availability` | Configuración de horarios por día |
| `/admin/conversations` | Historial de chats del agente |

Sidebar en `src/components/admin/sidebar.tsx`.

---

### Frontend público

- Landing en `src/app/page.tsx` con chat widget flotante tipo Intercom
- Login skeleton en `src/app/(auth)/login/page.tsx`
- UI primitives reutilizables: `Button`, `Card`, `Input`, `Badge`

---

### Infraestructura

- **Multi-tenancy** vía `src/lib/tenant.ts` (hoy resuelve por `DEFAULT_BUSINESS_SLUG` en env)
- **Supabase** — client/server adapters listos en `src/lib/supabase/`
- **Middleware** — refresca cookie de sesión en cada request, pero **no gatea rutas todavía**
- **WhatsApp** — webhook listo, falta solo credenciales de Meta y envío saliente

---

## Lo que falta

### Crítico para producción

1. **Auth real en `/admin`**
   El middleware solo refresca la sesión. Hay que agregar `getUser()` + redirect a `/login`. La tabla `User` ya está lista.

2. **Resolución de tenant por host/subdomain**
   Actualmente toda la app sirve un solo negocio vía env var. Para multi-tenant real hay que cambiar `getCurrentBusiness()` para resolver por `request.headers.host`.

3. **Onboarding / signup de Business**
   No existe flujo para que un nuevo cliente cree su negocio. Sin esto no es un SaaS real.

---

### Funcionalidades importantes

4. **Notificaciones** (email/SMS al confirmar reserva)
   Ni siquiera existe `lib/notifications.ts`. Candidatos: Resend (email), Twilio (SMS/WhatsApp saliente).

5. **WhatsApp — mensajes salientes**
   El webhook recibe mensajes pero el agente no puede responder por WhatsApp. Falta integrar la API de envío de Meta.

6. **Edición de reserva desde admin**
   Hay tabla de reservas pero no hay modal ni página de edición individual.

7. **Gestión de Customers desde admin**
   El modelo `Customer` existe pero no hay ninguna UI para verlo ni editarlo.

8. **Gestión de Users / staff desde admin**
   No hay UI para invitar staff, asignar roles ni desactivar cuentas.

---

### Monetización / SaaS

9. **Stripe / billing**
   No hay modelo `Subscription` ni ningún flujo de pago. Sin esto no se puede cobrar.

10. **Planes y límites por tenant**
    No hay lógica de qué puede hacer cada plan (cuántas reservas, cuántos staff, cuántos servicios).

---

### Calidad e ingeniería

11. **Tests**
    Cero cobertura. `server/*` es puro y perfectamente testeable con Vitest + supertest.

12. **CI/CD**
    No hay `.github/workflows` ni pipeline de lint/build/deploy.

13. **Migraciones versionadas**
    El README usa `db:push` (esquema directo). Para producción hay que migrar a `prisma migrate dev/deploy`.

14. **Observabilidad**
    `AgentLog` se escribe correctamente pero no hay vista admin para inspeccionarlo. Tampoco hay alertas ni métricas de errores del agente.

15. **Rate limiting**
    `/api/chat` y el webhook de WhatsApp no tienen rate limiting. Con tráfico real hay riesgo de abuso de la API de OpenAI.

16. **i18n**
    Todo está hardcodeado en español. El campo `locale` existe en `Business` pero no se consume en ningún lugar.

---

## Mapa de prioridades

```
Prioridad 1 (bloqueante para vender)
├── Auth real en /admin
├── Onboarding de Business
└── Resolución multi-tenant por subdomain

Prioridad 2 (experiencia completa)
├── Notificaciones (email/SMS)
├── Edición de reservas en admin
├── WhatsApp saliente
└── Gestión de Customers y Users

Prioridad 3 (monetización)
├── Stripe + Subscription
└── Límites por plan

Prioridad 4 (calidad)
├── Tests (Vitest)
├── CI/CD
├── Migraciones versionadas
├── Rate limiting
└── Observabilidad del agente
```

---

## Resumen ejecutivo

La base técnica es sólida: dominio separado en capas, agente IA funcional end-to-end, schema bien diseñado y panel admin de lectura operativo. Una demo funciona hoy mismo con `npm run db:seed && npm run dev`.

Para convertirlo en un SaaS comercial real faltan los tres bloques clásicos: **auth real**, **onboarding multi-tenant** y **billing**. El resto (notificaciones, tests, CI) son mejoras sobre una base que ya funciona.

Estimación aproximada para llegar a un v1 comercializable: **3-4 semanas** de trabajo enfocado de un solo desarrollador.
