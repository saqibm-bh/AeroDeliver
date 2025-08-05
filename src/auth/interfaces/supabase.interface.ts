export interface UserProfile {
  user_id: string;
  email: string;
  full_name: string;
  phone?: string;
  user_type: 'customer' | 'restaurant' | 'rider' | 'drone_operator' | 'admin';
  email_verified?: boolean;
  address?: string;
  coordinates?: { lat: number; lng: number };
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseAuthUser {
  id: string;
  email: string;
  phone?: string;
  email_confirmed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseAuthResponse {
  data: {
    user: SupabaseAuthUser | null;
    session: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      token_type: string;
    } | null;
  };
  error: {
    message: string;
    code?: string;
  } | null;
}

export interface SupabaseDataResponse<T> {
  data: T | null;
  error: {
    message: string;
    code?: string;
  } | null;
}
