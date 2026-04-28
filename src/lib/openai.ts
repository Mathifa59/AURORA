import OpenAI from "openai";

/**
 * AI provider abstraction.
 *
 * We use the OpenAI SDK as the wire format because Google Gemini exposes an
 * OpenAI-compatible REST endpoint, so we can support either provider just by
 * swapping the baseURL + apiKey + model. Function calling works identically.
 *
 * Configure via env:
 *   AI_PROVIDER  = "openai" | "gemini"   (default: "openai")
 *   AI_API_KEY   = the API key for the chosen provider
 *   AI_MODEL     = model id (defaults below)
 *
 * For backwards compatibility we also accept OPENAI_API_KEY / OPENAI_MODEL.
 */

const PROVIDER = (process.env.AI_PROVIDER ?? "openai").toLowerCase();

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";

const apiKey =
  process.env.AI_API_KEY ??
  (PROVIDER === "gemini" ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY) ??
  "";

if (!apiKey) {
  console.warn(
    `[ai] No API key found for provider "${PROVIDER}". The agent will not work.`
  );
}

const defaultModel = PROVIDER === "gemini" ? "gemini-2.5-flash" : "gpt-4o-mini";

export const openai = new OpenAI({
  apiKey,
  baseURL: PROVIDER === "gemini" ? GEMINI_BASE_URL : undefined,
});

export const OPENAI_MODEL =
  process.env.AI_MODEL ?? process.env.OPENAI_MODEL ?? defaultModel;

export const AI_PROVIDER = PROVIDER;
