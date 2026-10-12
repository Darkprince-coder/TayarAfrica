/**
 * Supabase settings from the environment. When they are missing the site runs on the demo content
 * in data/demo and the in-memory inquiry store, so local work never needs the real project.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True when the public URL and key are set (the service key is checked separately, server-side). */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
