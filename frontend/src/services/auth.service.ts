// src/services/auth.service.ts
import { createSupabaseClient } from '@/lib/supabase';
import type { User, SignupData } from '@/types/user';
import type { AuthResponse, AuthError } from '@supabase/supabase-js';

export class AuthService {
  private supabase = createSupabaseClient();

  async signUp(data: SignupData): Promise<{
    user: User | null;
    error: AuthError | Error | null;
    requiresEmailConfirmation?: boolean;
  }> {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            phone: data.phone,
            role: data.role,
          }
        }
      });

      if (authError) {
        return { user: null, error: authError };
      }

      if (!authData.user) {
        return { 
          user: null, 
          error: new Error('User creation failed - no user returned') 
        };
      }

      // Create user profile in custom users table
      const userProfile: Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login'> = {
        email: data.email,
        full_name: data.full_name,
        phone: data.phone || null,
        avatar_url: null,
        role: data.role,
        default_address: data.default_address || null,
        city: data.city || null,
        state: data.state || null,
        postal_code: data.postal_code || null,
        country: data.country,
        is_active: true,
        email_verified: false,
        phone_verified: false,
        notification_preferences: {
          email_notifications: true,
          sms_notifications: false,
          push_notifications: true,
          marketing_emails: false,
        },
        delivery_preferences: {
          preferred_delivery_method: 'auto',
          contactless_delivery: false,
          delivery_instructions: null,
        },
      };

      const { data: profileData, error: profileError } = await this.supabase
        .from('users')
        .insert([{ 
          id: authData.user.id,
          ...userProfile
        }])
        .select()
        .single();

      if (profileError) {
        // If profile creation fails, clean up auth user  
        console.error('Profile creation failed:', profileError);
        return { user: null, error: profileError };
      }

      return { 
        user: profileData,
        error: null,
        requiresEmailConfirmation: !authData.user.email_confirmed_at 
      };
      
    } catch (error) {
      return { 
        user: null, 
        error: error as Error 
      };
    }
  }

  async signIn(email: string, password: string): Promise<{
    user: User | null;
    error: AuthError | Error | null;
  }> {
    try {
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { user: null, error: authError };
      }

      if (!authData.user) {
        return { user: null, error: new Error('Sign in failed - no user returned') };
      }

      // Get user profile
      const { data: profile, error: profileError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        return { user: null, error: profileError };
      }

      // Update last login
      await this.supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', authData.user.id);

      return { user: profile, error: null };
      
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  async getCurrentUser(): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data: { user: authUser }, error: authError } = await this.supabase.auth.getUser();
      
      if (authError || !authUser) {
        return { user: null, error: authError };
      }

      const { data: profile, error: profileError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        return { user: null, error: profileError };
      }

      return { user: profile, error: null };
      
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }
}
