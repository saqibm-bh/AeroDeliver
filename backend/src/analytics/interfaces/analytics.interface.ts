export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  ordersByPeriod: Array<{
    period: string;
    orders: number;
    revenue: number;
  }>;
}

export interface DeliveryAnalytics {
  totalDeliveries: number;
  averageDeliveryTime: number;
  deliveryByType: Record<string, number>;
  successRate: number;
  deliveryPerformance: Array<{
    period: string;
    deliveries: number;
    averageTime: number;
  }>;
}

export interface RestaurantAnalytics {
  restaurantId: string;
  restaurantName: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  popularItems: Array<{
    itemId: string;
    itemName: string;
    orderCount: number;
    revenue: number;
  }>;
  rating: number;
  performanceScore: number;
}

export interface VehicleAnalytics {
  vehicleId: string;
  vehicleType: string;
  totalDeliveries: number;
  averageDeliveryTime: number;
  batteryUsage: number;
  maintenanceRequests: number;
  utilizationRate: number;
}

export interface SystemAnalytics {
  overview: {
    totalUsers: number;
    totalRestaurants: number;
    totalOrders: number;
    totalRevenue: number;
    totalDeliveries: number;
  };
  performance: {
    averageOrderTime: number;
    averageDeliveryTime: number;
    customerSatisfaction: number;
    systemUptime: number;
  };
  trends: Array<{
    date: string;
    orders: number;
    revenue: number;
    newUsers: number;
  }>;
}
