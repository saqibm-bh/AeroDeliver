import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Client-side Supabase client (for React components)
export const createSupabaseClient = () => createClientComponentClient();

// Types for our database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'customer' | 'admin' | 'rider' | 'store_owner'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'customer' | 'admin' | 'rider' | 'store_owner'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'customer' | 'admin' | 'rider' | 'store_owner'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
