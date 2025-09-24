export const dynamic = 'force-dynamic';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardCard, MetricCard } from '@/components/dashboard/DashboardComponents';
import { 
  Truck, 
  DollarSign, 
  Clock, 
  MapPin,
  Navigation,
  Battery,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Star,
  Route,
  Package
} from 'lucide-react';
import Link from 'next/link';

export default async function RiderDashboard() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }
  
  const { data: { user } } = await supabase.auth.getUser();

  // Mock data - replace with actual API calls
  const riderMetrics = {
    todayDeliveries: 12,
    todayEarnings: 187.50,
    weeklyEarnings: 1245.00,
    averageRating: 4.8,
    totalDeliveries: 847,
    deliveryTime: 23,
    completionRate: 98.5,
    activeOrders: 3
  };

  const activeDeliveries = [
    { 
      id: 'DEL-001', 
      restaurant: 'Pizza Palace', 
      customer: 'John D.', 
      address: '123 Main St', 
      estimatedTime: '15 min',
      status: 'picked_up',
      earnings: 12.50 
    },
    { 
      id: 'DEL-002', 
      restaurant: 'Burger House', 
      customer: 'Sarah M.', 
      address: '456 Oak Ave', 
      estimatedTime: '8 min',
      status: 'en_route',
      earnings: 15.75 
    },
    { 
      id: 'DEL-003', 
      restaurant: 'Sushi Zen', 
      customer: 'Mike R.', 
      address: '789 Pine St', 
      estimatedTime: '25 min',
      status: 'assigned',
      earnings: 18.25 
    }
  ];

  const recentDeliveries = [
    { id: 'DEL-098', restaurant: 'Taco Bell', customer: 'Lisa K.', earnings: 14.50, time: '45 min ago', rating: 5 },
    { id: 'DEL-097', restaurant: 'KFC', customer: 'Tom S.', earnings: 11.25, time: '1h 15m ago', rating: 4 },
    { id: 'DEL-096', restaurant: 'Subway', customer: 'Anna P.', earnings: 9.75, time: '2h 30m ago', rating: 5 },
    { id: 'DEL-095', restaurant: 'Dominos', customer: 'Chris B.', earnings: 16.00, time: '3h 10m ago', rating: 4 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'en_route': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'delivered': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <Package className="w-4 h-4" />;
      case 'picked_up': return <Truck className="w-4 h-4" />;
      case 'en_route': return <Navigation className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout userRole="rider">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Rider Dashboard</h1>
            <p className="text-muted-foreground">
              Track your deliveries, earnings, and performance metrics.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-3 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-lg">
              <Battery className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Online</span>
            </div>
            <Link
              href="/riders/route-optimization"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Route className="w-4 h-4 mr-2" />
              Optimize Route
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Today's Deliveries"
            value={riderMetrics.todayDeliveries}
            description="Completed today"
            trend={{ value: 20, label: 'vs yesterday', isPositive: true }}
            icon={<Truck className="w-6 h-6 text-primary" />}
          />
          <MetricCard
            title="Today's Earnings"
            value={`$${riderMetrics.todayEarnings}`}
            description="Earned today"
            trend={{ value: 15, label: 'vs yesterday', isPositive: true }}
            icon={<DollarSign className="w-6 h-6 text-primary" />}
          />
          <MetricCard
            title="Weekly Earnings"
            value={`$${riderMetrics.weeklyEarnings.toLocaleString()}`}
            description="This week's total"
            trend={{ value: 12, label: 'vs last week', isPositive: true }}
            icon={<TrendingUp className="w-6 h-6 text-primary" />}
          />
          <MetricCard
            title="Average Rating"
            value={riderMetrics.averageRating}
            description={`${riderMetrics.totalDeliveries} deliveries`}
            icon={<Star className="w-6 h-6 text-primary" />}
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Avg Delivery Time"
            value={`${riderMetrics.deliveryTime} min`}
            description="Per delivery"
            icon={<Clock className="w-6 h-6 text-blue-600" />}
          />
          <MetricCard
            title="Completion Rate"
            value={`${riderMetrics.completionRate}%`}
            description="Success rate"
            icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          />
          <MetricCard
            title="Active Orders"
            value={riderMetrics.activeOrders}
            description="In progress"
            icon={<Package className="w-6 h-6 text-orange-600" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Deliveries */}
          <DashboardCard 
            title="Active Deliveries"
            action={
              <Link 
                href="/riders/deliveries" 
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View all
              </Link>
            }
          >
            <div className="space-y-4">
              {activeDeliveries.map((delivery) => (
                <div key={delivery.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 ${getStatusColor(delivery.status)}`}>
                        {getStatusIcon(delivery.status)}
                        <span>{delivery.status.replace('_', ' ')}</span>
                      </span>
                      <span className="text-sm font-medium text-foreground">{delivery.id}</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">+${delivery.earnings}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{delivery.restaurant}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {delivery.customer} • {delivery.address}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">ETA: {delivery.estimatedTime}</span>
                      </div>
                      <Link
                        href={`/riders/deliveries/${delivery.id}`}
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Recent Deliveries */}
          <DashboardCard 
            title="Recent Deliveries"
            action={
              <Link 
                href="/riders/history" 
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View history
              </Link>
            }
          >
            <div className="space-y-4">
              {recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{delivery.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {delivery.restaurant} → {delivery.customer}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">+${delivery.earnings}</p>
                      <p className="text-xs text-muted-foreground">{delivery.time}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-foreground">{delivery.rating}</span>
                    </div>
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
              href="/riders/deliveries"
              className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
            >
              <Truck className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground mt-2">My Deliveries</span>
            </Link>
            <Link
              href="/riders/earnings"
              className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
            >
              <DollarSign className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground mt-2">Earnings</span>
            </Link>
            <Link
              href="/riders/route-optimization"
              className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
            >
              <Route className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground mt-2">Route Planner</span>
            </Link>
            <Link
              href="/riders/profile"
              className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
            >
              <Star className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground mt-2">My Profile</span>
            </Link>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
