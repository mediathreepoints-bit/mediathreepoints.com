import { createClient } from "@supabase/supabase-js";

const runtimeConfig =
  typeof window !== "undefined" ? window.__THREEPOINTS_SUPABASE__ || {} : {};
const envConfig = import.meta.env || {};
export const supabaseUrl = String(
  runtimeConfig.url || envConfig.VITE_SUPABASE_URL || "",
).trim();
export const supabaseAnonKey = String(
  runtimeConfig.anonKey || envConfig.VITE_SUPABASE_ANON_KEY || "",
).trim();
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabaseHost = (() => {
  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return "";
  }
})();
export const supabase =
  supabaseConfigured && typeof window !== "undefined"
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

export async function createAssetUrl(path) {
  if (!path) return "";
  if (/^https:\/\//i.test(path)) return path;
  if (!supabase) return "";
  const { data, error } = await supabase.storage
    .from("tour-assets")
    .createSignedUrl(path, 3600);
  if (error) return "";
  return data?.signedUrl || "";
}
