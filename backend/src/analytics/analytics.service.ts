import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AnalyticsQueryDto } from './dto/analytics.dto';
import { Analytics } from '../common/types';

@Injectable()
export class AnalyticsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getOverallAnalytics(query: AnalyticsQueryDto): Promise<Analytics> {
    const { startDate, endDate } = query;

    // Get overall orders analytics
    const { data: orders, error: ordersError } =
      await this.supabaseService.client
        .from('orders')
        .select('id, total_amount, created_at, status')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

    if (ordersError) {
      throw new Error(
        `Failed to fetch orders analytics: ${ordersError.message}`,
      );
    }

    const totalOrders = orders?.length || 0;
    const totalRevenue =
      orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      id: `analytics_${Date.now()}`,
      periodStart: startDate,
      periodEnd: endDate,
      totalOrders,
      totalRevenue,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      topProducts: [],
      deliveryMetrics: {
        totalDeliveries: 0,
        droneDeliveries: 0,
        riderDeliveries: 0,
        averageDeliveryTime: 0,
        deliverySuccessRate: 0,
      },
      customerMetrics: {
        newCustomers: 0,
        returningCustomers: 0,
        totalCustomers: 0,
      },
      createdAt: new Date().toISOString(),
    };
  }

  async getRestaurantAnalytics(
    restaurantId: string,
    query: AnalyticsQueryDto,
  ): Promise<Analytics['restaurantAnalytics']> {
    const { startDate, endDate } = query;

    const { data: orders, error: ordersError } =
      await this.supabaseService.client
        .from('orders')
        .select('id, total_amount, created_at')
        .eq('restaurant_id', restaurantId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

    if (ordersError) {
      throw new Error(
        `Failed to fetch restaurant analytics: ${ordersError.message}`,
      );
    }

    const totalOrders = orders?.length || 0;
    const totalRevenue =
      orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      topMenuItems: [],
      peakHours: [],
    };
  }

  async getUserAnalytics(
    userId: string,
    query: AnalyticsQueryDto,
  ): Promise<any> {
    const { startDate, endDate } = query;

    const { data: orders, error } = await this.supabaseService.client
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) {
      throw new Error(`Failed to fetch user analytics: ${error.message}`);
    }

    const totalOrders = orders?.length || 0;
    const totalSpent =
      orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    return {
      totalOrders,
      totalSpent,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      favoriteRestaurants: [],
      orderHistory: orders || [],
    };
  }

  async getDeliveryAnalytics(query: AnalyticsQueryDto): Promise<any> {
    const { startDate, endDate } = query;

    const { data: deliveries, error } = await this.supabaseService.client
      .from('deliveries')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) {
      throw new Error(`Failed to fetch delivery analytics: ${error.message}`);
    }

    const totalDeliveries = deliveries?.length || 0;
    const droneDeliveries =
      deliveries?.filter((d) => d.type === 'drone').length || 0;
    const riderDeliveries =
      deliveries?.filter((d) => d.type === 'rider').length || 0;
    const completedDeliveries =
      deliveries?.filter((d) => d.status === 'delivered').length || 0;

    const successRate =
      totalDeliveries > 0 ? (completedDeliveries / totalDeliveries) * 100 : 0;

    return {
      totalDeliveries,
      droneDeliveries,
      riderDeliveries,
      completedDeliveries,
      successRate: parseFloat(successRate.toFixed(2)),
    };
  }
}
