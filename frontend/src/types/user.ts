// src/types/user.ts
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  is_active: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  default_address?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country: string;
  notification_preferences: NotificationPreferences;
  delivery_preferences: DeliveryPreferences;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
}

export type UserRole = 
  | 'customer' 
  | 'store_owner' 
  | 'rider' 
  | 'admin';

export interface NotificationPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
}

export interface DeliveryPreferences {
  preferred_delivery_method: 'auto' | 'drone' | 'rider';
  contactless_delivery: boolean;
  delivery_instructions?: string | null;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  default_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}
