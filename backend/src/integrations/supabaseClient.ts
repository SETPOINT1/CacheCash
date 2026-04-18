import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";
import { Database } from "../types/supabaseDatabase";

let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new AppError("Supabase credentials are not configured", 500);
  }

  if (!supabaseClient) {
    supabaseClient = createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseClient;
}
