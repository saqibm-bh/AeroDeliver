// src/hooks/use-signup.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { SignupData, User } from '@/types/user';
import { useToast } from './use-toast';

interface UseSignupReturn {
  signup: (data: SignupData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  user: User | null;
}

export function useSignup(): UseSignupReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  const router = useRouter();
  const { toast } = useToast();
  const authService = new AuthService();

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await authService.signUp(data);

      if (result.error) {
        const errorMessage = result.error.message || 'An error occurred during signup';
        setError(errorMessage);
        toast({
          title: "Signup Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (result.user) {
        setUser(result.user);
        
        if (result.requiresEmailConfirmation) {
          toast({
            title: "Check Your Email",
            description: "Please check your email to confirm your account before signing in.",
            variant: "default",
          });
          router.push('/login?message=Please check your email to confirm your account');
        } else {
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully.",
            variant: "default",
          });
          router.push('/dashboard');
        }
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signup,
    isLoading,
    error,
    user,
  };
}
