/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

// Error interface for Supabase responses
interface SupabaseError {
  message: string;
  code?: string;
}

// Generic response interface
interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}

// Types for your food delivery service
export interface User {
  id: string;
  email: string;
  phone?: string;
  user_type: 'customer' | 'restaurant' | 'rider' | 'drone_operator' | 'admin';
  profile: {
    full_name: string;
    address?: string;
    coordinates?: { lat: number; lng: number };
  };
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine_type: string[];
  address: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  delivery_time: string;
  delivery_fee: number;
  minimum_order: number;
  is_active: boolean;
  owner_id: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
  preparation_time: number;
}

export interface Order {
  id: string;
  customer_id: string;
  restaurant_id: string;
  items: OrderItem[];
  total_amount: number;
  delivery_fee: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'picked_up'
    | 'in_transit'
    | 'delivered'
    | 'cancelled';
  delivery_type: 'drone' | 'rider';
  delivery_address: string;
  delivery_coordinates: { lat: number; lng: number };
  estimated_delivery_time: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  special_instructions?: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  delivery_type: 'drone' | 'rider';
  vehicle_id: string;
  operator_id: string;
  status:
    | 'assigned'
    | 'en_route_pickup'
    | 'at_restaurant'
    | 'picked_up'
    | 'en_route_delivery'
    | 'delivered';
  pickup_time?: string;
  delivery_time?: string;
  current_location?: { lat: number; lng: number };
  estimated_arrival: string;
}

export interface Vehicle {
  id: string;
  type: 'drone' | 'bike' | 'scooter';
  model: string;
  license_plate?: string;
  max_weight_capacity: number;
  max_distance_range: number;
  battery_level?: number;
  is_available: boolean;
  current_location?: { lat: number; lng: number };
  operator_id?: string;
}

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  public client: SupabaseClient;

  constructor(private config: ConfigService) {
    this.client = createClient(
      config.get<string>('SUPABASE_URL')!,
      config.get<string>('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  /**
   * Validates a Supabase Auth JWT and returns the user if valid.
   * Throws UnauthorizedException if invalid.
   */
  async validateUser(token: string): Promise<User> {
    try {
      interface UserResponse {
        user: { id: string; email: string; phone?: string } | null;
      }

      const { data: user, error } = (await this.client.auth.getUser(token)) as {
        data: UserResponse | null;
        error: { message: string } | null;
      };
      if (error || !user) {
        throw new UnauthorizedException('Invalid or missing Supabase token');
      }

      interface ProfileResponse {
        data: {
          user_type: User['user_type'];
          full_name: string;
          address?: string;
          coordinates?: { lat: number; lng: number };
        } | null;
        error: { message: string } | null;
      }

      const { data: profile, error: profileError } = (await this.client
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.user?.id)
        .single()) as ProfileResponse;

      if (profileError) {
        this.logger.warn(`Profile not found for user ${user.user?.id}`);
      }

      return {
        id: user.user?.id as string,
        email: user.user?.email as string,
        phone: user.user?.phone,
        user_type: profile?.user_type || 'customer',
        profile: {
          full_name: profile?.full_name || '',
          address: profile?.address,
          coordinates: profile?.coordinates,
        },
      };
    } catch (error) {
      this.logger.error('Token validation failed:', error);
      throw new UnauthorizedException('Invalid or expired Supabase token');
    }
  }

  // Restaurant Management
  async getRestaurants(filters?: {
    cuisine_type?: string;
    location?: { lat: number; lng: number; radius: number };
    is_active?: boolean;
  }): Promise<Restaurant[]> {
    let query = this.client.from('restaurants').select('*');

    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    if (filters?.cuisine_type) {
      query = query.contains('cuisine_type', [filters.cuisine_type]);
    }

    const response = await query;
    const responseData = response as SupabaseResponse<Restaurant[]>;
    if (responseData.error) {
      const errorMessage = responseData.error.message || 'Unknown error';
      throw new Error(`Failed to fetch restaurants: ${errorMessage}`);
    }
    return (responseData.data as Restaurant[]) || [];
  }

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    const response = await this.client
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();

    const errorObj = response.error as SupabaseError | null;
    if (errorObj && errorObj.code !== 'PGRST116') {
      const errorMessage = errorObj.message || 'Unknown error';
      throw new Error(`Failed to fetch restaurant: ${errorMessage}`);
    }
    return response.data as Restaurant | null;
  }

  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    const response = await this.client
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true);

    const responseData = response as SupabaseResponse<MenuItem[]>;
    if (responseData.error) {
      const errorMessage = responseData.error.message || 'Unknown error';
      throw new Error(`Failed to fetch menu items: ${errorMessage}`);
    }
    return (responseData.data as MenuItem[]) || [];
  }

  // Order Management
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const { data, error } = await this.client
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    if (error) throw new Error(`Failed to create order: ${error.message}`);
    return data as Order;
  }

  async getOrder(orderId: string): Promise<Order | null> {
    const { data, error } = (await this.client
      .from('orders')
      .select(
        `*,
        items:order_items(*),
        restaurant:restaurants(*),
        delivery:deliveries(*)`,
      )
      .eq('id', orderId)
      .single()) as { data: Order | null; error: any };

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
    return data;
  }

  async updateOrderStatus(
    orderId: string,
    status: Order['status'],
  ): Promise<void> {
    const { error } = await this.client
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error)
      throw new Error(`Failed to update order status: ${error.message}`);
  }

  async getUserOrders(userId: string, limit = 20): Promise<Order[]> {
    const { data, error } = (await this.client
      .from('orders')
      .select(
        `*,
        restaurant:restaurants(name, address),
        delivery:deliveries(status, estimated_arrival)`,
      )
      .eq('customer_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)) as { data: Order[]; error: any };

    if (error) throw new Error(`Failed to fetch user orders: ${error.message}`);
    return data || [];
  }

  // Delivery Management
  async assignDelivery(deliveryData: Partial<Delivery>): Promise<Delivery> {
    const { data, error } = (await this.client
      .from('deliveries')
      .insert(deliveryData)
      .select()
      .single()) as { data: Delivery; error: any };

    if (error) throw new Error(`Failed to assign delivery: ${error.message}`);
    return data;
  }

  async updateDeliveryStatus(
    deliveryId: string,
    status: Delivery['status'],
    location?: { lat: number; lng: number },
  ): Promise<void> {
    const updateData: Partial<Delivery> = { status };
    if (location) {
      updateData.current_location = location;
    }
    const { error } = await this.client
      .from('deliveries')
      .update(updateData)
      .eq('id', deliveryId);

    if (error)
      throw new Error(`Failed to update delivery status: ${error.message}`);
  }

  async getAvailableVehicles(
    type?: 'drone' | 'bike' | 'scooter',
  ): Promise<Vehicle[]> {
    let query = this.client
      .from('vehicles')
      .select('*')
      .eq('is_available', true);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = (await query) as { data: Vehicle[]; error: any };
    if (error) throw new Error(`Failed to fetch vehicles: ${error.message}`);
    return data || [];
  }

  // Real-time tracking
  subscribeToOrderUpdates(orderId: string, callback: (payload: any) => void) {
    return this.client
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        callback,
      )
      .subscribe();
  }

  subscribeToDeliveryUpdates(
    deliveryId: string,
    callback: (payload: any) => void,
  ) {
    return this.client
      .channel(`delivery-${deliveryId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deliveries',
          filter: `id=eq.${deliveryId}`,
        },
        callback,
      )
      .subscribe();
  }

  // Analytics and Reporting
  async getRestaurantAnalytics(
    restaurantId: string,
    dateRange: { start: string; end: string },
  ): Promise<unknown> {
    const { data, error } = await this.client.rpc('get_restaurant_analytics', {
      restaurant_id: restaurantId,
      start_date: dateRange.start,
      end_date: dateRange.end,
    });

    if (error) throw new Error(`Failed to fetch analytics: ${error.message}`);
    return data;
  }

  async getDeliveryMetrics(dateRange: {
    start: string;
    end: string;
  }): Promise<unknown> {
    const { data, error } = await this.client.rpc('get_delivery_metrics', {
      start_date: dateRange.start,
      end_date: dateRange.end,
    });

    if (error)
      throw new Error(`Failed to fetch delivery metrics: ${error.message}`);
    return data;
  }

  // Helper method for distance calculation
  calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number },
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLng = this.toRad(point2.lng - point1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) *
        Math.cos(this.toRad(point2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  // Determine optimal delivery method based on distance and availability
  async getOptimalDeliveryMethod(
    restaurantLocation: { lat: number; lng: number },
    deliveryLocation: { lat: number; lng: number },
    orderWeight: number,
  ): Promise<{ type: 'drone' | 'rider'; reason: string }> {
    const distance = this.calculateDistance(
      restaurantLocation,
      deliveryLocation,
    );

    // Get available vehicles
    const [drones, riders] = await Promise.all([
      this.getAvailableVehicles('drone'),
      this.getAvailableVehicles('bike'),
    ]);

    // Drone delivery criteria
    if (distance <= 5 && orderWeight <= 2 && drones.length > 0) {
      return {
        type: 'drone',
        reason: 'Short distance, light weight, drone available',
      };
    }

    // Default to rider delivery
    if (riders.length > 0) {
      return { type: 'rider', reason: 'Rider available for delivery' };
    }

    // Fallback to drone if no riders available
    if (drones.length > 0) {
      return { type: 'drone', reason: 'No riders available, using drone' };
    }

    throw new Error('No delivery vehicles available');
  }
}
