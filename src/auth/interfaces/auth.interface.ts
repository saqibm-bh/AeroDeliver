export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    userType: string;
    emailVerified: boolean;
    profile?: {
      address?: string;
      coordinates?: { lat: number; lng: number };
    };
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface TokenPayload {
  sub: string; // user id
  email: string;
  userType: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string; // user id
  tokenId: string;
  iat?: number;
  exp?: number;
}
