import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
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
}
