// src/lib/supabase-client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

let supabaseClient: ReturnType<typeof createClientComponentClient> | null = null;

export function getSupabaseClient(): ReturnType<typeof createClientComponentClient> | null {
  if (!supabaseClient && typeof window !== 'undefined') {
    supabaseClient = createClientComponentClient();
  }
  return supabaseClient;
}

export function resetSupabaseClient() {
  supabaseClient = null;
}
