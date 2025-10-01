"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient, User, Session } from "@supabase/supabase-js";

export default function SupabaseDebugPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Checking...");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [testResults, setTestResults] = useState<Array<{ test: string; status: string; data: unknown }>>([]);
  const [loading, setLoading] = useState(false);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const client = createClientComponentClient();
        setSupabase(client);
        (async () => {
          // Inline versions to avoid external deps in effect
          try {
            const { error } = await client.from('users').select('count').limit(1);
            setConnectionStatus(error ? `Error: ${error.message}` : 'Connected successfully');
          } catch (err) {
            setConnectionStatus(`Connection failed: ${err}`);
          }
          try {
            const { data: { session } } = await client.auth.getSession();
            const { data: { user } } = await client.auth.getUser();
            setSession(session);
            setUser(user);
          } catch (err) {
            console.error('Error getting auth state:', err);
          }
        })();
      } catch (error) {
        setConnectionStatus(`Failed to initialize Supabase: ${error}`);
      }
    }
  }, []);

  const checkSupabaseConnection = async (client: SupabaseClient | null = supabase) => {
    if (!client) {
      setConnectionStatus("Supabase client not initialized");
      return;
    }
    try {
      const { error } = await client.from('users').select('count').limit(1);
      if (error) {
        setConnectionStatus(`Error: ${error.message}`);
      } else {
        setConnectionStatus("Connected successfully");
      }
    } catch (err) {
      setConnectionStatus(`Connection failed: ${err}`);
    }
  };

  const getAuthState = async (client: SupabaseClient | null = supabase) => {
    if (!client) return;
    try {
      const { data: { session } } = await client.auth.getSession();
      const { data: { user } } = await client.auth.getUser();
      setSession(session);
      setUser(user);
    } catch (err) {
      console.error("Error getting auth state:", err);
    }
  };

  const runDatabaseTest = async () => {
    if (!supabase) {
      setTestResults([{ test: "Database tests", status: "Supabase client not available", data: null }]);
      return;
    }

    setLoading(true);
  const results: Array<{ test: string; status: string; data: unknown }> = [];

    try {
      // Test 1: Check users table
  results.push({ test: "Users table access", status: "Running...", data: null });
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, role')
        .limit(5);
      
      results[0] = {
        test: "Users table access",
        status: usersError ? `Error: ${usersError.message}` : `Success (${users?.length || 0} records)`,
        data: users
      };

      // Test 2: Check orders table
  results.push({ test: "Orders table access", status: "Running...", data: null });
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, status')
        .limit(5);
      
      results[1] = {
        test: "Orders table access",
        status: ordersError ? `Error: ${ordersError.message}` : `Success (${orders?.length || 0} records)`,
        data: orders
      };

      // Test 3: Check products table
  results.push({ test: "Products table access", status: "Running...", data: null });
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, price')
        .limit(5);
      
      results[2] = {
        test: "Products table access",
        status: productsError ? `Error: ${productsError.message}` : `Success (${products?.length || 0} records)`,
        data: products
      };

    } catch (err) {
      results.push({
        test: "Database tests",
        status: `Unexpected error: ${err}`,
        data: null
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  const testAuthFlow = async () => {
    if (!supabase) {
      setTestResults(prev => [...prev, {
        test: "Auth listener test",
        status: "Supabase client not available",
        data: null
      }]);
      return;
    }

    setLoading(true);
    
    try {
      // Test auth listeners
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth state changed:", event, session);
      });

      // Cleanup
      setTimeout(() => {
        subscription.unsubscribe();
      }, 1000);

      setTestResults(prev => [...prev, {
        test: "Auth listener test",
        status: "Auth listener set up successfully",
        data: null
      }]);

    } catch (err) {
      setTestResults(prev => [...prev, {
        test: "Auth listener test",
        status: `Error: ${err}`,
        data: null
      }]);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Supabase Debug Page
        </h1>
        
        {/* Connection Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Connection Status
          </h2>
          <div className={`p-3 rounded-md ${
            connectionStatus.includes("Error") || connectionStatus.includes("failed")
              ? "bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200"
              : connectionStatus === "Connected successfully"
              ? "bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200"
              : "bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
          }`}>
            {connectionStatus}
          </div>
        </div>

        {/* Auth State */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Authentication State
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">User</h3>
              <pre className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded overflow-auto max-h-32">
                {user ? JSON.stringify(user, null, 2) : "No user"}
              </pre>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Session</h3>
              <pre className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded overflow-auto max-h-32">
                {session ? JSON.stringify(session, null, 2) : "No session"}
              </pre>
            </div>
          </div>
        </div>

        {/* Test Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Actions
          </h2>
          <div className="space-x-4">
            <button
              onClick={runDatabaseTest}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Running..." : "Test Database Access"}
            </button>
            <button
              onClick={testAuthFlow}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Test Auth Flow
            </button>
            <button
              onClick={() => {
                setTestResults([]);
                if (supabase) {
                  checkSupabaseConnection();
                  getAuthState();
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Test Results
            </h2>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {result.test}
                    </h3>
                    <span className={`text-sm px-2 py-1 rounded ${
                      result.status.includes("Error")
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        : result.status.includes("Success")
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  {result.data && (
                    <pre className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded overflow-auto max-h-48">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
