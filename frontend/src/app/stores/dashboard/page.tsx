export const dynamic = 'force-dynamic';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardCard, MetricCard } from '@/components/dashboard/DashboardComponents';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Eye,
  ShoppingCart,
  Star,
  Plus,
  Edit,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default async function StoreOwnerDashboard() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }
  
  await supabase.auth.getUser();

  // Mock data - replace with actual API calls
  const storeMetrics = {
    todaysOrders: 23,
    todaysRevenue: 1247,
    monthlyRevenue: 18650,
    averageOrderValue: 54.21,
    totalProducts: 87,
    lowStockItems: 5,
    storeRating: 4.7,
    totalReviews: 234
  };

  const recentOrders = [
    { id: 'ORD-001', customer: 'John D.', items: 3, total: 45.50, status: 'preparing', time: '5 min ago' },
    { id: 'ORD-002', customer: 'Sarah M.', items: 2, total: 32.00, status: 'ready', time: '12 min ago' },
    { id: 'ORD-003', customer: 'Mike R.', items: 1, total: 18.99, status: 'delivered', time: '25 min ago' },
    { id: 'ORD-004', customer: 'Lisa K.', items: 4, total: 67.30, status: 'confirmed', time: '35 min ago' }
  ];

  const topProducts = [
    { name: 'Margherita Pizza', orders: 34, revenue: 578 },
    { name: 'Caesar Salad', orders: 28, revenue: 364 },
    { name: 'Garlic Bread', orders: 25, revenue: 187.50 },
    { name: 'Pepperoni Pizza', orders: 22, revenue: 418 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'preparing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'delivered': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <DashboardLayout userRole="store_owner">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Store Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s what&apos;s happening with your store today.
            </p>
          </div>
          <Link
            href="/stores/products/new"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Today's Orders"
            value={storeMetrics.todaysOrders}
            description="New orders today"
            trend={{ value: 15, label: 'vs yesterday', isPositive: true }}
            icon={<ShoppingCart className="w-6 h-6 text-primary" />}
          />
          <MetricCard
            title="Today's Revenue"
            value={`$${storeMetrics.todaysRevenue.toLocaleString()}`}
            description="Revenue today"
            trend={{ value: 8, label: 'vs yesterday', isPositive: true }}
            icon={<DollarSign className="w-6 h-6 text-primary" />}
          />
          <MetricCard
            title="Monthly Revenue"
            value={`$${storeMetrics.monthlyRevenue.toLocaleString()}`}
            description="This month's total"
            trend={{ value: 22, label: 'vs last month', isPositive: true }}
            icon={<TrendingUp className="w-6 h-6 text-primary" />}
          />
          <MetricCard
            title="Avg Order Value"
            value={`$${storeMetrics.averageOrderValue}`}
            description="Per order average"
            icon={<BarChart3 className="w-6 h-6 text-primary" />}
          />
        </div>

        {/* Store Performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Products"
            value={storeMetrics.totalProducts}
            description="In your catalog"
            icon={<Package className="w-6 h-6 text-blue-600" />}
          />
          <MetricCard
            title="Low Stock Alert"
            value={storeMetrics.lowStockItems}
            description="Items need restocking"
            icon={<Package className="w-6 h-6 text-orange-600" />}
          />
          <MetricCard
            title="Store Rating"
            value={storeMetrics.storeRating}
            description={`${storeMetrics.totalReviews} reviews`}
            icon={<Star className="w-6 h-6 text-yellow-600" />}
          />
          <MetricCard
            title="Profile Views"
            value="1.2k"
            description="This month"
            icon={<Eye className="w-6 h-6 text-purple-600" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <DashboardCard 
            title="Recent Orders"
            action={
              <Link 
                href="/stores/orders" 
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View all
              </Link>
            }
          >
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.customer} • {order.items} items</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">${order.total}</p>
                      <p className="text-xs text-muted-foreground">{order.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Top Products */}
          <DashboardCard 
            title="Top Selling Products"
            action={
              <Link 
                href="/stores/analytics" 
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View analytics
              </Link>
            }
          >
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      ${product.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Quick Actions */}
        <DashboardCard title="Quick Actions">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/stores/products"
              className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
            >
              <Package className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground mt-2">Manage Products</span>
            </Link>
            <Link
              href="/stores/orders"
              className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
            >
              <ShoppingCart className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground mt-2">View Orders</span>
            </Link>
            <Link
              href="/stores/profile"
              className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
            >
              <Edit className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground mt-2">Edit Store</span>
            </Link>
            <Link
              href="/stores/analytics"
              className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
            >
              <BarChart3 className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground mt-2">Analytics</span>
            </Link>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
