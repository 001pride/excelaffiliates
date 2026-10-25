import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// The site must keep working even if Supabase isn't configured yet (local
// clone with no .env, or the env vars missing on Vercel) — every call site
// checks `isSupabaseConfigured` and falls back to the static defaults in
// src/data/, so a missing backend degrades gracefully instead of white-screening.
export const isSupabaseConfigured = Boolean(url && key);

export const supabase = isSupabaseConfigured
  ? createClient(url as string, key as string)
  : null;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase isn't configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing). " +
      "The site will use its built-in static content instead. See SUPABASE_SETUP.md."
  );
}
