// src/services/auth.ts
import { getSupabaseClient } from '@/lib/supabase-client';
import { SignupData } from '@/types/auth';

export class AuthService {
  private supabase = getSupabaseClient();

  async signUp(data: SignupData) {
    if (!this.supabase) throw new Error('Supabase client not initialized');

    try {
      // Create auth user - the database trigger will handle profile creation
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: data.firstName + ' ' + data.lastName,
            phone: data.phone,
            role: data.role,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      return { 
        user: authData.user, 
        session: authData.session,
        message: 'Account created successfully! Please check your email to verify your account.'
      };

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      console.error('Signup error:', error);
      throw new Error(message);
    }
  }

  async signIn(email: string, password: string) {
    if (!this.supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    if (!this.supabase) throw new Error('Supabase client not initialized');
    
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    if (!this.supabase) return null;
    
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }
}

export const authService = new AuthService();
