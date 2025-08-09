import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  CreateDeliveryDto,
  UpdateDeliveryDto,
  DeliveryQueryDto,
} from './dto/delivery.dto';
import {
  Delivery,
  DeliveryType,
  DeliveryStatus,
} from './interfaces/delivery.interface';
import {
  calculateDistance,
  calculateDeliveryFee,
} from '../common/utils/delivery.utils';

@Injectable()
export class DeliveryService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createDelivery(
    createDeliveryDto: CreateDeliveryDto,
  ): Promise<Delivery> {
    const {
      orderId,
      type,
      pickupLocation,
      deliveryLocation,
      vehicleId,
      riderId,
      specialInstructions,
    } = createDeliveryDto;

    // Calculate distance and delivery fee
    const distanceKm = calculateDistance(
      pickupLocation.latitude,
      pickupLocation.longitude,
      deliveryLocation.latitude,
      deliveryLocation.longitude,
    );

    const deliveryFee = calculateDeliveryFee(distanceKm, type);

    // Validate delivery constraints
    if (type === DeliveryType.DRONE) {
      if (distanceKm > 5) {
        throw new BadRequestException(
          'Drone delivery is only available for distances up to 5km',
        );
      }
      if (!vehicleId) {
        throw new BadRequestException(
          'Vehicle ID is required for drone delivery',
        );
      }
    }

    // Calculate estimated times
    const avgSpeed = type === DeliveryType.DRONE ? 30 : 20; // km/h
    const pickupTime = 15; // minutes
    const estimatedDeliveryTime = new Date(
      Date.now() + (pickupTime + (distanceKm / avgSpeed) * 60) * 60000,
    ).toISOString();

    const { data, error } = await this.supabaseService.client
      .from('deliveries')
      .insert({
        order_id: orderId,
        type,
        status: DeliveryStatus.ASSIGNED,
        vehicle_id: vehicleId,
        rider_id: riderId,
        pickup_location: pickupLocation,
        delivery_location: deliveryLocation,
        distance_km: distanceKm,
        delivery_fee: deliveryFee,
        estimated_delivery_time: estimatedDeliveryTime,
        special_instructions: specialInstructions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create delivery: ${error.message}`);
    }

    return data;
  }

  async getDeliveryById(id: string): Promise<Delivery> {
    const { data, error } = await this.supabaseService.client
      .from('deliveries')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Delivery not found');
    }

    return data;
  }

  async updateDelivery(
    id: string,
    updateDeliveryDto: UpdateDeliveryDto,
  ): Promise<Delivery> {
    const { data, error } = await this.supabaseService.client
      .from('deliveries')
      .update({
        ...updateDeliveryDto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Delivery not found or failed to update');
    }

    return data;
  }

  async updateDeliveryStatus(
    id: string,
    status: DeliveryStatus,
    location?: { latitude: number; longitude: number },
  ): Promise<Delivery> {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Set actual times based on status
    if (status === DeliveryStatus.PICKED_UP) {
      updateData.actual_pickup_time = new Date().toISOString();
    } else if (status === DeliveryStatus.DELIVERED) {
      updateData.actual_delivery_time = new Date().toISOString();
    }

    if (location) {
      updateData.current_location = location;
    }

    const { data, error } = await this.supabaseService.client
      .from('deliveries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Delivery not found or failed to update');
    }

    return data;
  }

  async getDeliveries(query: DeliveryQueryDto): Promise<{
    deliveries: Delivery[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, status, type, riderId } = query;
    const offset = (page - 1) * limit;

    let queryBuilder = this.supabaseService.client
      .from('deliveries')
      .select('*', { count: 'exact' });

    if (status) {
      queryBuilder = queryBuilder.eq('status', status);
    }

    if (type) {
      queryBuilder = queryBuilder.eq('type', type);
    }

    if (riderId) {
      queryBuilder = queryBuilder.eq('rider_id', riderId);
    }

    const { data, error, count } = await queryBuilder
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch deliveries: ${error.message}`);
    }

    return {
      deliveries: data || [],
      total: count || 0,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async getDeliveryByOrderId(orderId: string): Promise<Delivery> {
    const { data, error } = await this.supabaseService.client
      .from('deliveries')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Delivery not found for this order');
    }

    return data;
  }

  async getActiveDeliveries(): Promise<Delivery[]> {
    const { data, error } = await this.supabaseService.client
      .from('deliveries')
      .select('*')
      .in('status', [
        DeliveryStatus.ASSIGNED,
        DeliveryStatus.EN_ROUTE_PICKUP,
        DeliveryStatus.AT_RESTAURANT,
        DeliveryStatus.PICKED_UP,
        DeliveryStatus.EN_ROUTE_DELIVERY,
      ]);

    if (error) {
      throw new Error(`Failed to fetch active deliveries: ${error.message}`);
    }

    return data || [];
  }

  async assignOptimalDelivery(
    orderId: string,
    pickupLocation: { latitude: number; longitude: number },
    deliveryLocation: { latitude: number; longitude: number },
    orderWeight: number,
  ): Promise<Delivery> {
    const distance = calculateDistance(
      pickupLocation.latitude,
      pickupLocation.longitude,
      deliveryLocation.latitude,
      deliveryLocation.longitude,
    );

    // Determine optimal delivery type
    const isDroneEligible = distance <= 5 && orderWeight <= 2; // 5km max, 2kg max for drone

    let deliveryType = DeliveryType.RIDER;
    let vehicleId: string | undefined;
    let riderId: string | undefined;

    if (isDroneEligible) {
      // Find available drone
      const { data: availableDrone } = await this.supabaseService.client
        .from('vehicles')
        .select('id')
        .eq('type', 'drone')
        .eq('is_available', true)
        .gte('battery_level', 50)
        .limit(1)
        .single();

      if (availableDrone) {
        deliveryType = DeliveryType.DRONE;
        vehicleId = availableDrone.id;
      }
    }

    if (!vehicleId) {
      // Find available rider
      const { data: availableRider } = await this.supabaseService.client
        .from('riders')
        .select('id')
        .eq('is_available', true)
        .limit(1)
        .single();

      if (availableRider) {
        riderId = availableRider.id;
      } else {
        throw new BadRequestException('No available delivery personnel');
      }
    }

    return this.createDelivery({
      orderId,
      type: deliveryType,
      pickupLocation: {
        latitude: pickupLocation.latitude,
        longitude: pickupLocation.longitude,
        address: '', // This should be fetched from restaurant data
      },
      deliveryLocation: {
        latitude: deliveryLocation.latitude,
        longitude: deliveryLocation.longitude,
        address: '', // This should be fetched from user address
      },
      vehicleId,
      riderId,
    });
  }

  // Simplified version that delegates to the main implementation
  async simplifiedAssignDelivery(orderId: string): Promise<any> {
    // Get order details first
    const { data: order } = await this.supabaseService.client
      .from('orders')
      .select('*, delivery_address(*)')
      .eq('id', orderId)
      .single();

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    // Use the main implementation with default pickup location
    return this.assignOptimalDelivery(
      orderId,
      { latitude: 40.7128, longitude: -74.006 }, // Default pickup (NYC)
      {
        latitude: order.delivery_address.latitude,
        longitude: order.delivery_address.longitude,
      },
      order.total_weight || 1, // Default to 1kg if not specified
    );
  }

  async startTracking(orderId: string): Promise<void> {
    // Implementation for starting real-time tracking
    const { error } = await this.supabaseService.client
      .from('deliveries')
      .update({
        tracking_started_at: new Date().toISOString(),
        status: DeliveryStatus.EN_ROUTE_DELIVERY,
      })
      .eq('order_id', orderId);

    if (error) {
      throw new Error(`Failed to start tracking: ${error.message}`);
    }
  }

  async completeDelivery(orderId: string): Promise<void> {
    // Implementation for completing delivery
    const { error } = await this.supabaseService.client
      .from('deliveries')
      .update({
        status: DeliveryStatus.DELIVERED,
        delivered_at: new Date().toISOString(),
      })
      .eq('order_id', orderId);

    if (error) {
      throw new Error(`Failed to complete delivery: ${error.message}`);
    }
  }

  async cancelDelivery(orderId: string): Promise<void> {
    // Implementation for canceling delivery
    const { error } = await this.supabaseService.client
      .from('deliveries')
      .update({
        status: DeliveryStatus.FAILED,
        cancelled_at: new Date().toISOString(),
      })
      .eq('order_id', orderId);

    if (error) {
      throw new Error(`Failed to cancel delivery: ${error.message}`);
    }
  }
}
