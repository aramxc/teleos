import { createClient } from "@supabase/supabase-js";

/**
 * Creates and returns a Supabase client
 * @param {Object} options - Configuration options
 * @param {boolean} options.admin - Whether to use admin privileges (service role key)
 * @returns {Object} Supabase client instance
 */
export function getSupabaseClient({ admin = false } = {}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Choose the appropriate key based on whether admin access is requested
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl) {
    console.error(`Missing NEXT_PUBLIC_SUPABASE_URL environment variable`);
    throw new Error(`Missing NEXT_PUBLIC_SUPABASE_URL environment variable`);
  }
  if (!supabaseKey) {
    console.error(`Missing SUPABASE_KEY environment variable`);
    throw new Error(`Missing SUPABASE_KEY environment variable`);
  }

  const clientOptions = admin
    ? {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    : {};

  return createClient(supabaseUrl, supabaseKey, clientOptions);
}

/**
 * Returns a Supabase client with admin privileges (using service role key)
 * @returns {Object} Supabase admin client instance
 */
export function getSupabaseAdmin() {
  return getSupabaseClient({ admin: true });
}
