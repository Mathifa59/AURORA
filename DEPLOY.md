# Deploy a Vercel — Guía rápida

## Requisitos previos
- Proyecto de Supabase activo (no pausado)
- Repositorio en GitHub ✅

---

## Pasos

### 1. Conectar a Vercel
1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa el repositorio `Mathifa59/AURORA`
3. Framework detectado automáticamente: **Next.js**

### 2. Variables de entorno en Vercel
En **Settings → Environment Variables**, agrega todas estas:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | `postgresql://postgres.[ref]:[pass]@aws-0-....pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | `postgresql://postgres.[ref]:[pass]@aws-0-....pooler.supabase.com:5432/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[ref].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_...` |
| `AI_PROVIDER` | `gemini` |
| `AI_API_KEY` | `AIzaSy...` |
| `AI_MODEL` | `gemini-2.5-flash` |
| `NEXT_PUBLIC_APP_URL` | `https://tu-dominio.vercel.app` |
| `DEFAULT_BUSINESS_SLUG` | `demo` |

> ⚠️ Tip: en Vercel puedes marcar Environment = Production + Preview + Development para no tener que agregarlas tres veces.

### 3. Build command (ya configurado en vercel.json)
```
npx prisma generate && next build
```

### 4. Deploy
Haz clic en **Deploy**. El primer build tarda ~2 minutos.

### 5. Post-deploy
Una vez desplegado, visita:
```
https://tu-app.vercel.app/api/health
```
Debe responder `{"status":"ok","db":"connected"}`.

Si ves `db: "disconnected"`, revisa que las variables de entorno estén correctas y que el proyecto de Supabase no esté pausado.

---

## Dominio personalizado (opcional)
Vercel → Settings → Domains → Add Domain.

## WhatsApp webhook (opcional)
Una vez desplegado, el webhook URL es:
```
https://tu-app.vercel.app/api/webhooks/whatsapp
```
Configúralo en Meta for Developers → WhatsApp → Configuration.

---

## Solución de problemas frecuentes

| Error | Causa probable | Solución |
|-------|---------------|----------|
| Build falla con `prisma generate` | `DATABASE_URL` no configurada | Verificar variables de entorno |
| `{"db":"disconnected"}` en `/api/health` | Supabase pausado | Restaurar en supabase.com/dashboard |
| 401 en `/admin/*` | Sesión expirada | Iniciar sesión en `/login` |
| Chat no responde | `AI_API_KEY` inválida | Regenerar en aistudio.google.com |
