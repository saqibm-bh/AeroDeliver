// src/hooks/useSignup.ts
import { useState } from 'react';
import { SignupData } from '@/types/auth';
import { authService } from '@/services/auth';

interface UseSignupResult {
  signup: (data: SignupData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  message?: string | null;
}

export function useSignup(): UseSignupResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const result = await authService.signUp(data);
      setSuccess(true);
      setMessage(result.message || 'Account created successfully!');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signup,
    isLoading,
    error,
    success,
    message,
  };
}
