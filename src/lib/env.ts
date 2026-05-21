/**
 * Validates that all required environment variables are present.
 * Called at server startup — throws with a clear message if something is missing.
 *
 * Usage: import "@/lib/env" in src/lib/prisma.ts or any server-side entry point.
 */

type EnvVar = {
  key: string;
  description: string;
  public?: boolean;
};

const REQUIRED: EnvVar[] = [
  {
    key: "DATABASE_URL",
    description: "URL de conexión a PostgreSQL (Supabase transaction pooler, puerto 6543)",
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_URL",
    description: "URL pública del proyecto Supabase",
    public: true,
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    description: "Clave anónima de Supabase (sb_publishable_*)",
    public: true,
  },
  {
    key: "AI_API_KEY",
    description: "Clave de API del proveedor IA (Gemini o OpenAI)",
  },
  {
    key: "DEFAULT_BUSINESS_SLUG",
    description: "Slug del negocio por defecto (ej. 'demo')",
  },
];

const OPTIONAL: EnvVar[] = [
  { key: "DIRECT_URL",              description: "URL directa para migraciones de Prisma" },
  { key: "SUPABASE_SERVICE_ROLE_KEY", description: "Service role key de Supabase" },
  { key: "AI_PROVIDER",             description: "Proveedor IA: 'gemini' | 'openai'" },
  { key: "AI_MODEL",                description: "Modelo IA (ej. gemini-2.5-flash)" },
  { key: "NEXT_PUBLIC_APP_URL",     description: "URL pública de la app", public: true },
  { key: "WHATSAPP_VERIFY_TOKEN",   description: "Token de verificación del webhook de WhatsApp" },
  { key: "WHATSAPP_PHONE_NUMBER_ID", description: "ID del número de WhatsApp Business" },
  { key: "WHATSAPP_ACCESS_TOKEN",   description: "Access token de WhatsApp Cloud API" },
];

function validateEnv() {
  // Only validate on server side
  if (typeof window !== "undefined") return;

  const missing: EnvVar[] = [];

  for (const envVar of REQUIRED) {
    const value = process.env[envVar.key];
    if (!value || value.trim() === "") {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    const lines = missing.map(
      (v) => `  ❌ ${v.key}\n     → ${v.description}`
    );
    throw new Error(
      `\n\n🚨 Variables de entorno faltantes:\n\n${lines.join("\n\n")}\n\n` +
      `Copia el archivo .env.example a .env y rellena los valores.\n` +
      `Guía: PROJECT_STATUS.md → sección "Configuración inicial"\n`
    );
  }

  // Warn about missing optional vars (no throw)
  const missingOptional = OPTIONAL.filter(
    (v) => !process.env[v.key] || process.env[v.key]!.trim() === ""
  );
  if (missingOptional.length > 0 && process.env.NODE_ENV !== "test") {
    const names = missingOptional.map((v) => v.key).join(", ");
    console.warn(`[env] Variables opcionales no configuradas: ${names}`);
  }
}

validateEnv();

export {};
