"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

export default function SignupTestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        setSupabase(createClientComponentClient());
      } catch (error) {
        setError(`Failed to initialize Supabase: ${error}`);
      }
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      setError("Supabase client not initialized");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
  const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("Signup successful! Check your email for confirmation.");
        console.log("Signup data:", data);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestAuth = async () => {
    if (!supabase) {
      setError("Supabase client not initialized");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
  const { data: { session } } = await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();
  setMessage(`Session: ${session ? 'Active' : 'None'}\nUser: ${user ? user.email : 'None'}`);
  console.log("Auth state:", { session, user });
    } catch (err) {
      setError("Error checking auth state");
      console.error("Auth check error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Signup Test Page
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test User Signup
          </h2>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter password"
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Auth State Test
          </h2>
          
          <button
            onClick={handleTestAuth}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Checking..." : "Check Auth State"}
          </button>
        </div>

        {message && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <pre className="text-green-800 dark:text-green-200 text-sm whitespace-pre-wrap">
              {message}
            </pre>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-800 dark:text-red-200 text-sm">
              {error}
            </p>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Debug Info
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            This page is for testing the signup functionality and auth state.
            Use it to verify that user registration is working correctly.
          </p>
        </div>
      </div>
    </div>
  );
}
