"use client";

import React from "react";

export default function DebugIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Debug Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Development debugging tools will be available here.
        </p>
        <div className="mt-8 space-y-4">
          <a 
            href="/debug/profile" 
            className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Profile Debug
          </a>
          <a 
            href="/debug/analytics" 
            className="block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Analytics Debug
          </a>
          <a 
            href="/debug/delivery" 
            className="block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Delivery Debug
          </a>
        </div>
      </div>
    </div>
  );
}
