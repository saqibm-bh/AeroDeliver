export const dynamic = 'force-dynamic';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// Dashboard components
function DashboardCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default async function CustomerDashboard() {
  // Initialize supabase server client
  const supabase = createServerComponentClient({ cookies });
  
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  
  // Mock data for orders (to be replaced with actual API calls)
  const orders = [
    {
      id: 'ORD-001',
      date: '2025-09-06',
      status: 'delivered',
      total: 24.99
    },
    {
      id: 'ORD-002',
      date: '2025-09-05',
      status: 'in_transit',
      total: 32.50
    },
    {
      id: 'ORD-003',
      date: '2025-09-03',
      status: 'processing',
      total: 18.75
    }
  ];

  // Filter active orders
  const activeOrders = orders.filter(order => 
    !['delivered', 'cancelled'].includes(order.status)
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Welcome back, {user?.email}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Active Orders">
          <div className="text-3xl font-semibold text-blue-600">
            {activeOrders.length}
          </div>
          <p className="text-gray-500 dark:text-gray-400">orders in progress</p>
        </DashboardCard>
        
        <DashboardCard title="Total Orders">
          <div className="text-3xl font-semibold text-green-600">
            {orders.length}
          </div>
          <p className="text-gray-500 dark:text-gray-400">lifetime orders</p>
        </DashboardCard>
        
        <DashboardCard title="Account Status">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Active</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {user?.email}
          </p>
        </DashboardCard>
      </div>
      
      <DashboardCard title="Recent Orders" className="mb-8">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="py-3 text-left">Order ID</th>
                  <th className="py-3 text-left">Date</th>
                  <th className="py-3 text-left">Status</th>
                  <th className="py-3 text-left">Total</th>
                  <th className="py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b dark:border-gray-700">
                    <td className="py-3">{order.id}</td>
                    <td className="py-3">{order.date}</td>
                    <td className="py-3">
                      <span 
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === "delivered" 
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" 
                            : order.status === "in_transit"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3">${order.total.toFixed(2)}</td>
                    <td className="py-3">
                      <Link 
                        href={`/customer/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No orders yet</p>
            <Link 
              href="/stores"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </DashboardCard>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Quick Actions">
          <div className="space-y-3">
            <Link 
              href="/stores"
              className="block w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="font-medium">Browse Restaurants</div>
              <div className="text-sm text-gray-500">Find nearby food options</div>
            </Link>
            <Link 
              href="/customer/addresses"
              className="block w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="font-medium">Manage Addresses</div>
              <div className="text-sm text-gray-500">Add or edit delivery locations</div>
            </Link>
            <Link 
              href="/customer/profile"
              className="block w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="font-medium">Edit Profile</div>
              <div className="text-sm text-gray-500">Update your account information</div>
            </Link>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Support">
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="font-medium text-blue-900 dark:text-blue-100">Need Help?</div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                Contact our support team
              </div>
              <Link href="/support" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm font-medium">
                Get Support
              </Link>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="font-medium text-green-900 dark:text-green-100">Track Order</div>
              <div className="text-sm text-green-700 dark:text-green-300 mb-2">
                Real-time delivery tracking
              </div>
              <Link href="/customer/track" className="text-green-600 hover:text-green-800 dark:text-green-400 text-sm font-medium">
                Track Now
              </Link>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
