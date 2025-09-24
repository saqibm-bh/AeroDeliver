export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  terms: boolean;
}

export interface SignupFormData extends SignupData {
  // Additional form-specific fields can go here
}

export type UserRole = 'customer' | 'store_owner' | 'rider' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone?: string;
}

export interface SignupResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
  needsVerification?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}
