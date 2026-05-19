# AURA — Sistema de Reservas con Agente IA
## Estado del proyecto · Mayo 2026

---

## ¿Qué es esto?

Un sistema de reservas **SaaS-ready** con agente IA conversacional. Los clientes reservan hablando (como WhatsApp), el staff gestiona todo desde un panel admin moderno. Construido con Next.js 14, Prisma, Supabase y Gemini.

---

## Stack confirmado en producción

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 App Router · React 18 · Tailwind CSS |
| Backend | Next.js API Routes · Zod (validación) |
| Base de datos | PostgreSQL via **Supabase AURA** |
| ORM | Prisma 5 |
| IA | **Google Gemini 2.5 Flash** (free tier) via OpenAI compat API |
| Hosting | Local dev · pendiente deploy Vercel |

---

## Infraestructura activa

```
Supabase AURA
  Proyecto:  dzcfrvcljvrmmpzcgkjr
  Region:    us-east-1
  Plan:      Free

Gemini API
  Modelo:    gemini-2.5-flash
  Plan:      Free tier

Dev server:  http://localhost:3000
```

---

## Lo que está 100% construido y funcionando

### Base de datos (10 tablas multi-tenant)
- ✅ `Business` — núcleo del tenant (nombre, zona horaria, moneda, branding)
- ✅ `User` — staff/admin con roles, vinculado a Supabase Auth
- ✅ `Service` — qué se reserva (duración, capacidad, precio, color)
- ✅ `AvailabilityRule` — horarios de apertura por día de la semana
- ✅ `Reservation` — con estados completos y campo `source` (web / IA / WhatsApp / admin)
- ✅ `Customer` — único por `(businessId, phone)`, se crea/actualiza automáticamente
- ✅ `Conversation` + `Message` — historial completo del chat persistido
- ✅ `AgentLog` — cada tool call del agente con input, output, duración y status

### Motor de reservas
- ✅ `getAvailableSlots()` — genera huecos por regla semanal, filtrando ocupados
- ✅ `isSlotAvailable()` — validación atómica por capacidad y solapamiento (anti-sobrebooking real)
- ✅ `suggestNextSlots()` — para cuando el cliente no tiene fecha definida
- ✅ `createReservation()` / `cancelReservation()` / `updateReservation()` / `updateReservationStatus()`
- ✅ Zona horaria del negocio como fuente de verdad (`zonedTimeToUtc`)

### Agente IA (Gemini 2.5 Flash)
- ✅ Flujo conversacional multi-turn (hasta 5 rondas de tool calls)
- ✅ System prompt en español neutro, consciente de fecha/hora del negocio
- ✅ 4 tools con function calling real:
  - `listarServicios` — devuelve catálogo activo con precios
  - `consultarDisponibilidad` — slots de un día o sugerencias próximas
  - `crearReserva` — con validación anti-sobrebooking y upsert del cliente
  - `cancelarReserva` — por teléfono o ID
- ✅ Historial de conversación cargado del DB en cada turno (memoria persistente)
- ✅ Tenant-scoped: el `businessId` lo inyecta el runtime, el modelo nunca lo controla

### API REST
- ✅ `POST /api/chat` — endpoint del agente
- ✅ `GET/POST /api/reservations` — listar / crear
- ✅ `GET/PATCH/DELETE /api/reservations/[id]` — detalle / cambiar estado / cancelar
- ✅ `GET/POST /api/services` — listar / crear
- ✅ `PATCH/DELETE /api/services/[id]`
- ✅ `GET/POST /api/availability` — reglas + slots por fecha
- ✅ `PATCH/DELETE /api/availability/[id]`
- ✅ `GET /api/webhooks/whatsapp` — verify handshake
- ✅ `POST /api/webhooks/whatsapp` — procesa mensajes entrantes (reusa el agente)

### Panel Admin (`/admin/*`)
- ✅ **Dashboard** — stats del día (reservas, confirmadas, ingresos, clientes) + lista de próximas citas
- ✅ **Calendario** — vista semanal tipo Google Calendar, eventos posicionados por hora real, navegar semanas
- ✅ **Reservas** — tabla con búsqueda, filtros por estado, acciones rápidas (confirmar / atendida / cancelar)
- ✅ **Servicios** — CRUD completo con selector de color, duración, capacidad y precio
- ✅ **Disponibilidad** — CRUD de horarios semanales por día, múltiples franjas
- ✅ **Conversaciones** — historial de chats del agente con roles diferenciados (👤 usuario / 🤖 asistente / 🔧 tool)

### Chat Widget (cliente)
- ✅ Widget flotante tipo Intercom, posicionado en toda la app pública
- ✅ Indicador de online, typing animation, historial local (localStorage)
- ✅ "Nueva conversación" para resetear sesión
- ✅ Persiste `sessionId` entre recargas de página

### Landing pública
- ✅ Hero con mock del dashboard, gradientes, grid bg
- ✅ Sección de features (6 cards)
- ✅ Sección "cómo funciona" (3 pasos)
- ✅ CTA con degradado
- ✅ Página de login (`/login`) con Supabase Auth

---

## Lo que está pendiente

### 🔴 Crítico (bloquea uso real)

| # | Qué falta | Por qué es crítico |
|---|---|---|
| 1 | **Auth guard en `/admin/*`** | Hoy cualquier persona puede entrar al panel sin estar logueada. El middleware está pero no redirige. |
| 2 | **Signup de primer admin** | No hay forma de crear el usuario admin inicial desde la UI. Hay que hacerlo manualmente en Supabase. |
| 3 | **Página pública de reservas** (`/book`) | El cliente solo puede reservar por chat. Falta una vista con servicios + selección de fecha + formulario, como alternativa al chat para quienes prefieren un flujo tradicional. |

### 🟡 Importante (mejora la experiencia)

| # | Qué falta | Detalle |
|---|---|---|
| 4 | **Confirmación post-reserva** | Email o pantalla de "¡Reserva confirmada!" con resumen. Hoy el cliente solo ve el mensaje del chat. |
| 5 | **"Mis reservas" para el cliente** | Página donde el cliente busca sus reservas por teléfono para consultarlas o cancelarlas sin el chat. |
| 6 | **Detalle de reserva en admin** | Click en una fila → drawer/modal con toda la info, botones de cambio de estado, historial, notas. |
| 7 | **Página de configuración del negocio** | Editar nombre, zona horaria, moneda, color de marca desde el panel. Hoy solo editable desde el seed/DB. |
| 8 | **Navegación mobile admin** | El sidebar desaparece en móvil (está con `hidden md:flex`). Falta hamburger menu / bottom nav. |
| 9 | **Skeletons de carga** | Las páginas admin hacen fetch server-side, pero si la DB tarda se ve pantalla en blanco. Agregar `loading.tsx` con skeletons. |

### 🟢 Mejoras y bonus

| # | Qué falta | Detalle |
|---|---|---|
| 10 | **Notificaciones email** | Enviar confirmación al cliente cuando se crea/confirma una reserva. Integrar Resend (simple, gratuito en dev). |
| 11 | **Gestión de usuarios** | Invitar staff, cambiar roles (admin/staff), desactivar cuentas. |
| 12 | **Gráficas en dashboard** | Reservas por día (últimos 7/30 días), ingresos, servicios más populares. Integrar Recharts o Chart.js. |
| 13 | **Base de clientes** | Página `/admin/customers` con lista, búsqueda, historial de reservas por cliente. |
| 14 | **WhatsApp real** | El webhook está listo. Solo falta configurar credenciales Meta Developer (WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN). |
| 15 | **Deploy a Vercel** | El proyecto está listo para Vercel. Solo necesita las env vars en el dashboard y `git push`. |
| 16 | **Update Next.js** | La versión 14.2.18 tiene una vulnerabilidad de seguridad conocida. Actualizar a 14.2.29+ o migrar a Next.js 15. |
| 17 | **Multi-tenant completo** | Hoy el tenant se resuelve por `DEFAULT_BUSINESS_SLUG` en env. Para SaaS real: resolver por subdominio (`negocio.reservalo.app`) y agregar un dashboard de onboarding para nuevos negocios. |
| 18 | **Tests** | El motor de reservas (`server/reservations/`, `server/availability/`) está aislado y es testeable sin HTTP. Agregar Vitest con tests unitarios de los casos críticos (sobrebooking, slots fuera de horario, etc). |

---

## Arquitectura en una imagen

```
Cliente (browser / WhatsApp)
        │
        ▼
  Next.js App Router
  ┌─────────────────────────────────────────────┐
  │  /           Landing + Chat Widget          │
  │  /book        (pendiente) Reservar online   │
  │  /admin/*     Panel de gestión              │
  │  /api/chat    Agente IA (Gemini)            │
  │  /api/*       REST (reservas, servicios...) │
  │  /api/webhooks/whatsapp  (listo, sin creds) │
  └─────────────────────────────────────────────┘
        │                    │
        ▼                    ▼
  Prisma ORM          Gemini 2.5 Flash
  (Supabase AURA)    (function calling)
```

---

## Flujo del agente IA (validado)

```
Usuario: "Quiero reservar una cena para 2 mañana en la noche"
    ↓
Agente llama → consultarDisponibilidad(servicio="Cena para 2", fecha=mañana)
    ↓ devuelve slots 7:00 PM y 8:30 PM
Agente responde: "¿A las 7:00 o las 8:30 PM?"
    ↓
Usuario: "8:30 PM, soy Mathias, tel 55 1234 5678"
    ↓
Agente llama → crearReserva(servicio, fechaHora, nombre, telefono)
    ↓ validación anti-sobrebooking → persiste en Supabase
Agente responde: "¡Listo, Mathias! Reserva confirmada para el 1 de mayo a las 8:30 PM."
    ↓
Reserva visible en /admin/calendar y /admin/reservations
```

---

## Comandos útiles

```bash
# Desarrollo
npm run dev                    # servidor en http://localhost:3000

# Base de datos
npm run db:push               # aplicar schema a Supabase
npm run db:seed               # crear datos demo (Bistro Aurora)
npm run db:studio             # GUI de Prisma para inspeccionar datos

# Producción
npm run build                 # compilar
npm start                     # iniciar servidor en producción
```

---

## Próximo paso recomendado

**Implementar en este orden:**

1. 🔴 Auth guard (`middleware.ts` redirige `/admin/*` si no hay sesión)
2. 🔴 Signup del primer admin (o crearlo manualmente en Supabase Dashboard → Auth → Users)
3. 🔴 Página pública `/book` con formulario de reserva
4. 🟡 Email de confirmación (Resend, gratis hasta 3000/mes)
5. 🟢 Deploy Vercel

---

*Documento generado automáticamente · Proyecto AURA · Mayo 2026*
