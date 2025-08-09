export interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
}
