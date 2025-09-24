"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function DeliveryDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Delivery Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Delivery management dashboard coming soon...
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Main Dashboard
        </button>
      </div>
    </div>
  );
}
