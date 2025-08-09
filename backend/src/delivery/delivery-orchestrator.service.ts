import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { DronesService } from '../drones/drones.service';
import { RidersService } from '../riders/riders.service';
import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';
import { VehicleType } from '../riders/interfaces/rider.interface';
import { calculateDistance } from '../common/utils/delivery.utils';

export interface OrderDetails {
  id: string;
  pickupLocation: [number, number];
  deliveryLocation: [number, number];
  totalWeight: number;
  maxDimension: number;
  isFragile: boolean;
  requiresSignature: boolean;
  isUrgent: boolean;
  totalValue: number;
  notes?: string;
  urgency?: 'high' | 'medium' | 'low';
}

export interface DeliveryRequirements {
  isDroneEligible: boolean;
  maxDistance: number;
  weatherSuitability: WeatherCondition;
  timeConstraints: {
    urgent: boolean;
    deadline?: Date;
  };
}

export interface DeliveryDecision {
  method: 'drone' | 'rider';
  assigneeId: string;
  estimatedTime: number;
  estimatedCost: number;
  confidence: number;
  reasons: string[];
}

export interface WeatherCondition {
  windSpeed: number; // km/h
  precipitation: boolean;
  visibility: number; // meters
  temperature: number; // Celsius
}

export interface DroneOption {
  id: string;
  type: 'drone';
  droneType: string;
  maxPayload: number;
  maxRange: number;
  batteryLevel: number;
  currentLocation: [number, number];
  estimatedTime: number;
  cost: number;
}

export interface RiderOption {
  id: string;
  type: 'rider';
  vehicleType: VehicleType;
  maxRadius: number;
  rating: number;
  currentLocation: [number, number];
  estimatedTime: number;
  cost: number;
}

@Injectable()
export class DeliveryOrchestratorService {
  private readonly logger = new Logger(DeliveryOrchestratorService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly dronesService: DronesService,
    private readonly ridersService: RidersService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async assignOptimalDelivery(orderId: string): Promise<DeliveryDecision> {
    try {
      // Get order details
      const order = await this.getOrderDetails(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      // Analyze delivery requirements
      const requirements = await this.analyzeDeliveryRequirements(order);

      // Get available delivery options
      const droneOptions = await this.getAvailableDrones(
        order.deliveryLocation,
      );
      const riderOptions = await this.getAvailableRiders(
        order.deliveryLocation,
      );

      // Make delivery decision
      const decision = this.makeDeliveryDecision(
        order,
        requirements,
        droneOptions,
        riderOptions,
      );

      // Execute assignment
      await this.executeDeliveryAssignment(orderId, decision);

      this.logger.log(
        `Order ${orderId} assigned to ${decision.method}: ${decision.assigneeId}`,
      );
      return decision;
    } catch (error) {
      this.logger.error(
        `Failed to assign delivery for order ${orderId}:`,
        error,
      );
      throw error;
    }
  }

  private async getOrderDetails(orderId: string): Promise<OrderDetails | null> {
    // Use type casting to help TypeScript with the Supabase response
    interface OrderResponse {
      id: string;
      order_items: Array<{
        products: {
          weight?: number;
          max_dimension?: number;
          is_fragile?: boolean;
          requires_signature?: boolean;
        };
        quantity?: number;
      }>;
      pickup_location?: number[];
      delivery_address?: {
        latitude?: number;
        longitude?: number;
      };
      is_urgent?: boolean;
      total_amount?: number;
      notes?: string;
      priority?: 'high' | 'medium' | 'low';
    }

    const result = await this.supabaseService.client
      .from('orders')
      .select(
        `
        *,
        order_items(*, products(*)),
        delivery_address(*)
        `,
      )
      .eq('id', orderId)
      .single();

    if (result.error || !result.data) {
      return null;
    }

    const data = result.data as unknown;

    // Safely cast the response to our expected structure
    const order = data as OrderResponse;

    // Calculate total weight and dimensions
    let totalWeight = 0;
    let maxDimension = 0;
    let isFragile = false;
    let requiresSignature = false;

    const orderItems = order.order_items || [];
    if (Array.isArray(orderItems)) {
      for (const item of orderItems) {
        const product = item.products || {};
        const productWeight = Number(product.weight || 0.5);
        const itemQuantity = Number(item.quantity || 1);
        const productMaxDimension = Number(product.max_dimension || 20);

        totalWeight += productWeight * itemQuantity;
        maxDimension = Math.max(maxDimension, productMaxDimension);

        if (product.is_fragile) isFragile = true;
        if (product.requires_signature) requiresSignature = true;
      }
    }

    // Extract coordinates in a type-safe way
    let pickupLat = 40.7128;
    let pickupLng = -74.006; // Default NYC
    let deliveryLat = 40.7128;
    let deliveryLng = -74.006; // Default NYC

    if (
      order.pickup_location &&
      Array.isArray(order.pickup_location) &&
      order.pickup_location.length >= 2
    ) {
      pickupLat = Number(order.pickup_location[0]);
      pickupLng = Number(order.pickup_location[1]);
    }

    if (order.delivery_address) {
      deliveryLat = Number(order.delivery_address.latitude || 40.7128);
      deliveryLng = Number(order.delivery_address.longitude || -74.006);
    }

    const orderDetails: OrderDetails = {
      id: String(order.id || ''),
      totalWeight,
      maxDimension,
      isFragile,
      requiresSignature,
      isUrgent: Boolean(order.is_urgent),
      totalValue: Number(order.total_amount || 0),
      notes: String(order.notes || ''),
      urgency:
        order.priority === 'high'
          ? 'high'
          : order.priority === 'medium'
            ? 'medium'
            : 'low',
      pickupLocation: [pickupLat, pickupLng],
      deliveryLocation: [deliveryLat, deliveryLng],
    };

    return orderDetails;
  }

  // Using the interface defined at the module level

  private async analyzeDeliveryRequirements(
    order: OrderDetails,
  ): Promise<DeliveryRequirements> {
    // Check basic drone eligibility
    const isDroneEligible = this.checkDroneEligibility(order);

    // Calculate distance
    const maxDistance = calculateDistance(
      order.pickupLocation[0],
      order.pickupLocation[1],
      order.deliveryLocation[0],
      order.deliveryLocation[1],
    );

    // Get weather conditions
    const weatherSuitability = await this.getWeatherConditions();

    // Analyze time constraints
    const timeConstraints = {
      urgent: order.isUrgent || order.urgency === 'high',
      deadline:
        order.urgency === 'high'
          ? new Date(Date.now() + 60 * 60 * 1000) // 1 hour for high urgency
          : order.urgency === 'medium'
            ? new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours for medium
            : new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours for low
    };

    return {
      isDroneEligible,
      maxDistance,
      weatherSuitability,
      timeConstraints,
    };
  }

  private checkDroneEligibility(order: OrderDetails): boolean {
    const reasons: string[] = [];

    // Weight check (max 5kg for most drones)
    if (order.totalWeight > 5) {
      reasons.push(`Weight exceeds limit: ${order.totalWeight}kg > 5kg`);
      return false;
    }

    // Size check (max 30cm dimension)
    if (order.maxDimension > 30) {
      reasons.push(`Size exceeds limit: ${order.maxDimension}cm > 30cm`);
      return false;
    }

    // Fragile items require careful handling
    if (order.isFragile) {
      reasons.push('Fragile items need special handling');
      return false;
    }

    // High-value items need signature
    if (order.requiresSignature || order.totalValue > 500) {
      reasons.push('Requires signature or high-value item');
      return false;
    }

    return true;
  }

  private async getAvailableDrones(
    location: [number, number],
  ): Promise<DroneOption[]> {
    try {
      const drones = await this.dronesService.findAvailableDrones(location, 15); // 15km radius
      return drones.map(
        (drone): DroneOption => ({
          id: drone.id,
          type: 'drone',
          droneType: drone.droneType,
          maxPayload: drone.maxPayloadCapacity,
          maxRange: drone.maxFlightRange,
          batteryLevel: drone.batteryCapacity,
          currentLocation: drone.currentLocation || [0, 0],
          estimatedTime: this.calculateDroneDeliveryTime(drone, location),
          cost: this.calculateDroneCost(drone, location),
        }),
      );
    } catch (error) {
      this.logger.warn('Failed to get available drones:', error);
      return [];
    }
  }

  private async getAvailableRiders(
    location: [number, number],
  ): Promise<RiderOption[]> {
    try {
      const riders = await this.ridersService.findAvailableRiders(location, 20); // 20km radius
      return riders.map(
        (rider): RiderOption => ({
          id: rider.id,
          type: 'rider',
          vehicleType: rider.vehicleType,
          maxRadius: rider.maxDeliveryRadius || 20,
          rating: rider.rating || 4.0,
          currentLocation: rider.currentLocation || [0, 0],
          estimatedTime: this.calculateRiderDeliveryTime(rider, location),
          cost: this.calculateRiderCost(rider, location),
        }),
      );
    } catch (error) {
      this.logger.warn('Failed to get available riders:', error);
      return [];
    }
  }

  private makeDeliveryDecision(
    order: OrderDetails,
    requirements: DeliveryRequirements,
    droneOptions: DroneOption[],
    riderOptions: RiderOption[],
  ): DeliveryDecision {
    const decisions: Array<{
      method: 'drone' | 'rider';
      assigneeId: string;
      score: number;
      estimatedTime: number;
      estimatedCost: number;
      reasons: string[];
    }> = [];

    // Evaluate drone options
    if (
      requirements.isDroneEligible &&
      this.isWeatherSuitableForDrones(requirements.weatherSuitability)
    ) {
      for (const drone of droneOptions) {
        const score = this.calculateDroneScore(drone, order, requirements);
        decisions.push({
          method: 'drone',
          assigneeId: drone.id,
          score,
          estimatedTime: drone.estimatedTime,
          estimatedCost: drone.cost,
          reasons: ['Fast delivery', 'Eco-friendly', 'No traffic delays'],
        });
      }
    }

    // Evaluate rider options
    for (const rider of riderOptions) {
      const score = this.calculateRiderScore(rider, order);
      decisions.push({
        method: 'rider',
        assigneeId: rider.id,
        score,
        estimatedTime: rider.estimatedTime,
        estimatedCost: rider.cost,
        reasons: [
          'Reliable',
          'Can handle complex deliveries',
          'Weather independent',
        ],
      });
    }

    if (decisions.length === 0) {
      throw new Error('No available delivery options found');
    }

    // Select best option
    const bestDecision = decisions.reduce((best, current) =>
      current.score > best.score ? current : best,
    );

    return {
      method: bestDecision.method,
      assigneeId: bestDecision.assigneeId,
      estimatedTime: bestDecision.estimatedTime,
      estimatedCost: bestDecision.estimatedCost,
      confidence: Math.min(bestDecision.score / 100, 1),
      reasons: bestDecision.reasons,
    };
  }

  private calculateDroneScore(
    drone: DroneOption,
    order: OrderDetails,
    requirements: DeliveryRequirements,
  ): number {
    let score = 50; // Base score

    // Distance factor
    const distance = calculateDistance(
      drone.currentLocation[0],
      drone.currentLocation[1],
      order.deliveryLocation[0],
      order.deliveryLocation[1],
    );

    if (distance <= 5) score += 30;
    else if (distance <= 10) score += 20;
    else if (distance <= 15) score += 10;

    // Battery level
    if (drone.batteryLevel > 80) score += 20;
    else if (drone.batteryLevel > 60) score += 10;
    else if (drone.batteryLevel < 40) score -= 20;

    // Payload capacity
    const payloadUtilization = order.totalWeight / drone.maxPayload;
    if (payloadUtilization < 0.5) score += 10;
    else if (payloadUtilization > 0.9) score -= 10;

    // Weather conditions
    if (!this.isWeatherSuitableForDrones(requirements.weatherSuitability)) {
      score -= 50;
    }

    // Urgency bonus for drones (faster)
    if (order.urgency) score += 15;

    return Math.max(0, score);
  }

  private calculateRiderScore(rider: RiderOption, order: OrderDetails): number {
    let score = 60; // Base score (slightly higher than drones for reliability)

    // Distance factor
    const distance = calculateDistance(
      rider.currentLocation[0],
      rider.currentLocation[1],
      order.deliveryLocation[0],
      order.deliveryLocation[1],
    );

    if (distance <= 5) score += 25;
    else if (distance <= 10) score += 15;
    else if (distance <= 20) score += 5;

    // Rider rating
    if (rider.rating >= 4.8) score += 20;
    else if (rider.rating >= 4.5) score += 10;
    else if (rider.rating < 4.0) score -= 10;

    // Vehicle type suitability
    if (rider.vehicleType === VehicleType.MOTORCYCLE && order.totalWeight > 2) {
      score += 15; // Motorcycles good for heavier items
    }
    if (rider.vehicleType === VehicleType.BICYCLE && order.totalWeight < 1) {
      score += 10; // Bicycles good for light items
    }

    // Special requirements bonus
    if (order.requiresSignature || order.isFragile || order.totalValue > 500) {
      score += 25; // Riders better for special handling
    }

    // Traffic considerations
    if (this.isRushHour()) {
      score -= 10; // Riders affected by traffic
    }

    return Math.max(0, score);
  }

  private executeDeliveryAssignment(
    orderId: string,
    decision: DeliveryDecision,
  ): Promise<void> {
    // Remove unused parameter
    const _unused = decision; // To satisfy linter temporarily
    return this.performDeliveryAssignment(orderId, _unused);
  }

  private async performDeliveryAssignment(
    orderId: string,
    decision: DeliveryDecision,
  ): Promise<void> {
    try {
      if (decision.method === 'drone') {
        await this.dronesService.assignDrone({
          orderId,
          droneId: decision.assigneeId,
          estimatedPickupTime: new Date(
            Date.now() + 15 * 60 * 1000,
          ).toISOString(), // 15 min
          estimatedDeliveryTime: new Date(
            Date.now() + decision.estimatedTime * 60 * 1000,
          ).toISOString(),
        });
      } else {
        await this.ridersService.assignRider({
          orderId,
          riderId: decision.assigneeId,
          estimatedPickupTime: new Date(
            Date.now() + 20 * 60 * 1000,
          ).toISOString(), // 20 min
          estimatedDeliveryTime: new Date(
            Date.now() + decision.estimatedTime * 60 * 1000,
          ).toISOString(),
        });
      }

      // Update order status
      await this.supabaseService.client
        .from('orders')
        .update({
          status: 'assigned',
          delivery_method: decision.method,
          assigned_at: new Date().toISOString(),
          estimated_delivery_time: new Date(
            Date.now() + decision.estimatedTime * 60 * 1000,
          ).toISOString(),
        })
        .eq('id', orderId);

      // Send notification
      await this.notificationsService.sendDeliveryAssignment(orderId, decision);
    } catch (error) {
      this.logger.error(`Failed to execute delivery assignment:`, error);
      throw error;
    }
  }

  // Helper methods
  private calculateDroneDeliveryTime(
    drone: any,
    location: [number, number],
  ): number {
    const droneObj = drone as { currentLocation?: [number, number] };
    const droneLocation: [number, number] = Array.isArray(
      droneObj.currentLocation,
    )
      ? [
          Number(droneObj.currentLocation[0] || 0),
          Number(droneObj.currentLocation[1] || 0),
        ]
      : [0, 0];

    const distance = calculateDistance(
      droneLocation[0],
      droneLocation[1],
      location[0],
      location[1],
    );

    // Assume 40 km/h average speed for drones + 10 min prep time
    return Math.round((distance / 40) * 60 + 10);
  }

  private calculateRiderDeliveryTime(
    rider: any,
    location: [number, number],
  ): number {
    const riderObj = rider as {
      currentLocation?: [number, number];
      vehicleType?: VehicleType;
    };
    const riderLocation: [number, number] = Array.isArray(
      riderObj.currentLocation,
    )
      ? [
          Number(riderObj.currentLocation[0] || 0),
          Number(riderObj.currentLocation[1] || 0),
        ]
      : [0, 0];

    const distance = calculateDistance(
      riderLocation[0],
      riderLocation[1],
      location[0],
      location[1],
    );

    // Different speeds based on vehicle type + 15 min prep time
    const speeds = {
      [VehicleType.BICYCLE]: 15, // km/h
      [VehicleType.MOTORCYCLE]: 35, // km/h
      [VehicleType.SCOOTER]: 25, // km/h
      [VehicleType.CAR]: 30, // km/h (accounting for traffic)
      [VehicleType.VAN]: 25, // km/h
    };

    const vehicleType = riderObj.vehicleType || VehicleType.BICYCLE;
    const speed = speeds[vehicleType] || 25;
    return Math.round((distance / speed) * 60 + 15);
  }

  private calculateDroneCost(drone: any, location: [number, number]): number {
    const droneObj = drone as { currentLocation?: [number, number] };
    const droneLocation: [number, number] = Array.isArray(
      droneObj.currentLocation,
    )
      ? [
          Number(droneObj.currentLocation[0] || 0),
          Number(droneObj.currentLocation[1] || 0),
        ]
      : [0, 0];

    const distance = calculateDistance(
      droneLocation[0],
      droneLocation[1],
      location[0],
      location[1],
    );

    // Base cost + distance cost for drones
    return 3.99 + distance * 0.5;
  }

  private calculateRiderCost(rider: any, location: [number, number]): number {
    const riderObj = rider as { currentLocation?: [number, number] };
    const riderLocation: [number, number] = Array.isArray(
      riderObj.currentLocation,
    )
      ? [
          Number(riderObj.currentLocation[0] || 0),
          Number(riderObj.currentLocation[1] || 0),
        ]
      : [0, 0];

    const distance = calculateDistance(
      riderLocation[0],
      riderLocation[1],
      location[0],
      location[1],
    );

    // Base cost + distance cost for riders
    return 2.99 + distance * 0.8;
  }

  private getWeatherConditions(): Promise<WeatherCondition> {
    // Mock weather service - in production, integrate with actual weather API
    return Promise.resolve({
      windSpeed: 15, // km/h
      precipitation: false,
      visibility: 10000, // meters
      temperature: 22, // Celsius
    });
  }

  private isWeatherSuitableForDrones(weather: WeatherCondition): boolean {
    return (
      weather.windSpeed < 25 && // Less than 25 km/h wind
      !weather.precipitation && // No rain/snow
      weather.visibility > 1000 && // Good visibility
      weather.temperature > 0 &&
      weather.temperature < 40 // Reasonable temperature
    );
  }

  private isRushHour(): boolean {
    const hour = new Date().getHours();
    return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  }

  private getTrafficLevel(): Promise<'low' | 'medium' | 'high'> {
    // Mock traffic service - in production, integrate with actual traffic API
    if (this.isRushHour()) return Promise.resolve('high');
    return Promise.resolve('medium');
  }
}
