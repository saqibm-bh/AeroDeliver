// src/lib/supabase-client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

let supabaseClient: any = null;

export function getSupabaseClient() {
  if (!supabaseClient && typeof window !== 'undefined') {
    supabaseClient = createClientComponentClient();
  }
  return supabaseClient;
}

export function resetSupabaseClient() {
  supabaseClient = null;
}
