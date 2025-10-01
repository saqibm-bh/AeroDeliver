export const dynamic = 'force-dynamic';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardCard, MetricCard } from '@/components/dashboard/DashboardComponents';
import { 
  Users, 
  Store, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Activity,
  Star,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }
  
  await supabase.auth.getUser();

  // Mock data - replace with actual API calls
  const platformMetrics = {
    totalUsers: 12547,
    totalStores: 234,
    totalRiders: 156,
    totalOrders: 45621,
    todayOrders: 234,
    totalRevenue: 458230,
    monthlyRevenue: 125000,
    averageDeliveryTime: 28
  };

  const recentActivity = [
    { id: 1, type: 'order', description: 'New order #ORD-1234 placed', time: '2 min ago', status: 'success' },
    { id: 2, type: 'store', description: 'Pizza Palace joined the platform', time: '15 min ago', status: 'info' },
    { id: 3, type: 'rider', description: 'Rider John D. completed delivery', time: '23 min ago', status: 'success' },
    { id: 4, type: 'user', description: 'New customer registered', time: '1 hour ago', status: 'info' },
    { id: 5, type: 'alert', description: 'System maintenance scheduled', time: '2 hours ago', status: 'warning' }
  ];

  const topStores = [
    { name: 'Pizza Palace', orders: 234, revenue: 12450, rating: 4.8 },
    { name: 'Burger House', orders: 189, revenue: 9876, rating: 4.6 },
    { name: 'Sushi Zen', orders: 156, revenue: 15670, rating: 4.9 },
    { name: 'Taco Bell', orders: 143, revenue: 7890, rating: 4.4 }
  ];

  const fleetStatus = [
    { status: 'active', count: 89, color: 'text-green-600' },
    { status: 'busy', count: 45, color: 'text-yellow-600' },
    { status: 'offline', count: 22, color: 'text-gray-600' }
  ];

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor platform performance and manage operations
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/admin/reports"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Activity className="w-4 h-4 mr-2" />
              View Reports
            </Link>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={platformMetrics.totalUsers.toLocaleString()}
            description="Registered users"
            trend={{ value: 12, label: 'vs last month', isPositive: true }}
            icon={<Users className="w-6 h-6 text-primary" />}
          />
          <MetricCard
            title="Active Stores"
            value={platformMetrics.totalStores}
            description="Restaurants & stores"
            trend={{ value: 8, label: 'vs last month', isPositive: true }}
            icon={<Store className="w-6 h-6 text-primary" />}
          />
          <MetricCard
            title="Delivery Fleet"
            value={platformMetrics.totalRiders}
            description="Active riders"
            trend={{ value: 15, label: 'vs last month', isPositive: true }}
            icon={<Truck className="w-6 h-6 text-primary" />}
          />
          <MetricCard
            title="Total Orders"
            value={platformMetrics.totalOrders.toLocaleString()}
            description="All time orders"
            icon={<Package className="w-6 h-6 text-primary" />}
          />
        </div>

        {/* Revenue & Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Today's Orders"
            value={platformMetrics.todayOrders}
            description="Orders placed today"
            trend={{ value: 18, label: 'vs yesterday', isPositive: true }}
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          />
          <MetricCard
            title="Monthly Revenue"
            value={`$${platformMetrics.monthlyRevenue.toLocaleString()}`}
            description="This month's earnings"
            trend={{ value: 22, label: 'vs last month', isPositive: true }}
            icon={<DollarSign className="w-6 h-6 text-green-600" />}
          />
          <MetricCard
            title="Avg Delivery Time"
            value={`${platformMetrics.averageDeliveryTime} min`}
            description="Platform average"
            trend={{ value: 5, label: 'improvement', isPositive: true }}
            icon={<Clock className="w-6 h-6 text-blue-600" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <DashboardCard 
            title="Recent Activity"
            action={
              <Link 
                href="/admin/activity" 
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View all
              </Link>
            }
          >
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Top Performing Stores */}
          <DashboardCard 
            title="Top Performing Stores"
            action={
              <Link 
                href="/admin/stores" 
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View all
              </Link>
            }
          >
            <div className="space-y-4">
              {topStores.map((store, index) => (
                <div key={store.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{store.name}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{store.orders} orders</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-muted-foreground">{store.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      ${store.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Fleet Status */}
        <DashboardCard title="Fleet Status">
          <div className="grid grid-cols-3 gap-6">
            {fleetStatus.map((status) => (
              <div key={status.status} className="text-center">
                <div className={`text-2xl font-bold ${status.color}`}>
                  {status.count}
                </div>
                <div className="text-sm text-muted-foreground capitalize">
                  {status.status} Riders
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
