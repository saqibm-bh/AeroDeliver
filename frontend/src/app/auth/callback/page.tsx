'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

// Role-based routing configuration
const ROLE_REDIRECTS = {
  customer: '/dashboard',
  store_owner: '/stores/dashboard',
  rider: '/riders/dashboard',
  delivery_manager: '/delivery/dashboard',
  admin: '/admin/dashboard',
  // Default fallback
  default: '/dashboard'
};

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Get query parameters
        const errorParam = searchParams.get('error');
        const messageParam = searchParams.get('message');
        const nextParam = searchParams.get('next');
        const refreshToken = searchParams.get('refresh_token');
        const accessToken = searchParams.get('access_token');
        const type = searchParams.get('type');

        // Handle error cases
        if (errorParam) {
          setError(`Authentication error: ${errorParam}`);
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        if (messageParam) {
          if (messageParam.includes('confirm') || messageParam.includes('verify')) {
            setStatus('Email verification successful! Please sign in to continue.');
          } else {
            setStatus(messageParam);
          }
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        // No auth tokens - usually email verification flow
        if (!refreshToken && !accessToken) {
          if (type === 'recovery') {
            setStatus('Password reset link sent. Please check your email.');
          } else if (type === 'signup') {
            setStatus('Signup successful! Please check your email for verification.');
          } else {
            setStatus('Processing authentication...');
          }
          setTimeout(() => router.push('/login'), 2500);
          return;
        }

        // We have tokens - determine user role and redirect to appropriate dashboard
        setStatus('Authentication successful! Preparing your dashboard...');
        
        try {
          // Verify token with backend - this is where we'd get user role
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/verify`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to verify authentication');
          }
          
          const data = await response.json();
          const userRole = data.user?.role || 'customer';
          
          // Redirect based on role
          const redirectTo = nextParam || ROLE_REDIRECTS[userRole] || ROLE_REDIRECTS.default;
          setIsRedirecting(true);
          setTimeout(() => router.push(redirectTo), 1000);
          
        } catch (err) {
          console.error('Auth verification error:', err);
          setError('Failed to verify your authentication. Please try logging in again.');
          setTimeout(() => router.push('/login'), 2000);
        }
      } catch (err) {
        console.error('Authentication callback error:', err);
        setError('An unexpected error occurred during authentication');
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    processAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
      <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/20 max-w-md w-full">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-white">AeroDeliver Auth</h1>
          
          {error ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
                {error}
              </div>
              <Link href="/login" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                Return to login
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              <p className="text-white">{status}</p>
              {isRedirecting && (
                <div className="w-5 h-5 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin ml-2" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
