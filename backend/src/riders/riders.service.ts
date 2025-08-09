import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  CreateRiderDto,
  UpdateRiderDto,
  RiderQueryDto,
  RiderAssignmentDto,
  RiderPerformanceDto,
} from './dto/rider.dto';
import {
  Rider,
  RiderStatus,
  VehicleType,
  RiderAssignment,
  RiderPerformanceMetrics,
} from './interfaces/rider.interface';
import { calculateDistance } from '../common/utils/delivery.utils';

@Injectable()
export class RidersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createRider(createRiderDto: CreateRiderDto): Promise<Rider> {
    const { data, error } = await this.supabaseService.client
      .from('riders')
      .insert({
        full_name: createRiderDto.fullName,
        email: createRiderDto.email,
        phone: createRiderDto.phone,
        license_number: createRiderDto.licenseNumber,
        vehicle_type: createRiderDto.vehicleType,
        vehicle_registration: createRiderDto.vehicleRegistration,
        current_location: createRiderDto.currentLocation,
        status: createRiderDto.status,
        max_delivery_radius: createRiderDto.maxDeliveryRadius || 10,
        rating: createRiderDto.rating || 5.0,
        total_deliveries: 0,
        joined_date: new Date().toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create rider: ${error.message}`);
    }

    return this.mapDatabaseToRider(data);
  }

  async findAll(query: RiderQueryDto): Promise<{
    riders: Rider[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      status,
      vehicleType,
      nearLocation,
      radius,
      minRating,
      page = 1,
      limit = 10,
    } = query;
    const offset = (page - 1) * limit;

    let queryBuilder = this.supabaseService.client
      .from('riders')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    if (status) {
      queryBuilder = queryBuilder.eq('status', status);
    }

    if (vehicleType) {
      queryBuilder = queryBuilder.eq('vehicle_type', vehicleType);
    }

    if (minRating) {
      queryBuilder = queryBuilder.gte('rating', minRating);
    }

    const { data, error, count } = await queryBuilder
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch riders: ${error.message}`);
    }

    let riders = (data || []).map(this.mapDatabaseToRider);

    // Filter by location if provided
    if (nearLocation && radius) {
      riders = riders.filter((rider) => {
        if (!rider.currentLocation) return false;
        const distance = calculateDistance(
          nearLocation[0],
          nearLocation[1],
          rider.currentLocation[0],
          rider.currentLocation[1],
        );
        return distance <= radius;
      });
    }

    return {
      riders,
      total: count || 0,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async findOne(id: string): Promise<Rider> {
    const { data, error } = await this.supabaseService.client
      .from('riders')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      throw new NotFoundException('Rider not found');
    }

    return this.mapDatabaseToRider(data);
  }

  async update(id: string, updateRiderDto: UpdateRiderDto): Promise<Rider> {
    const { data, error } = await this.supabaseService.client
      .from('riders')
      .update({
        full_name: updateRiderDto.fullName,
        phone: updateRiderDto.phone,
        status: updateRiderDto.status,
        current_location: updateRiderDto.currentLocation,
        max_delivery_radius: updateRiderDto.maxDeliveryRadius,
        vehicle_registration: updateRiderDto.vehicleRegistration,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Rider not found or failed to update');
    }

    return this.mapDatabaseToRider(data);
  }

  async updateLocation(id: string, location: [number, number]): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('riders')
      .update({
        current_location: location,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update rider location: ${error.message}`);
    }
  }

  async updateStatus(id: string, status: RiderStatus): Promise<Rider> {
    const { data, error } = await this.supabaseService.client
      .from('riders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Rider not found or failed to update status');
    }

    return this.mapDatabaseToRider(data);
  }

  async findAvailableRiders(
    location: [number, number],
    maxDistance: number = 10,
    vehicleType?: VehicleType,
  ): Promise<Rider[]> {
    let query = this.supabaseService.client
      .from('riders')
      .select('*')
      .eq('status', RiderStatus.AVAILABLE)
      .eq('is_active', true);

    if (vehicleType) {
      query = query.eq('vehicle_type', vehicleType);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch available riders: ${error.message}`);
    }

    const availableRiders = (data || [])
      .map(this.mapDatabaseToRider)
      .filter((rider) => {
        if (!rider.currentLocation) return false;
        const distance = calculateDistance(
          location[0],
          location[1],
          rider.currentLocation[0],
          rider.currentLocation[1],
        );
        return distance <= Math.min(maxDistance, rider.maxDeliveryRadius || 10);
      })
      .sort((a, b) => {
        if (!a.currentLocation || !b.currentLocation) return 0;
        const distA = calculateDistance(
          location[0],
          location[1],
          a.currentLocation[0],
          a.currentLocation[1],
        );
        const distB = calculateDistance(
          location[0],
          location[1],
          b.currentLocation[0],
          b.currentLocation[1],
        );
        return distA - distB;
      });

    return availableRiders;
  }

  async assignRider(
    assignmentDto: RiderAssignmentDto,
  ): Promise<RiderAssignment> {
    // Check if rider is available
    const rider = await this.findOne(assignmentDto.riderId);
    if (rider.status !== RiderStatus.AVAILABLE) {
      throw new BadRequestException('Rider is not available for assignment');
    }

    // Create assignment record
    const { data, error } = await this.supabaseService.client
      .from('rider_assignments')
      .insert({
        rider_id: assignmentDto.riderId,
        order_id: assignmentDto.orderId,
        assigned_at: new Date().toISOString(),
        estimated_pickup_time: assignmentDto.estimatedPickupTime,
        estimated_delivery_time: assignmentDto.estimatedDeliveryTime,
        status: 'assigned',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to assign rider: ${error.message}`);
    }

    // Update rider status to busy
    await this.updateStatus(assignmentDto.riderId, RiderStatus.BUSY);

    return {
      id: data.id,
      riderId: data.rider_id,
      orderId: data.order_id,
      assignedAt: data.assigned_at,
      estimatedPickupTime: data.estimated_pickup_time,
      estimatedDeliveryTime: data.estimated_delivery_time,
      status: data.status,
    };
  }

  async completeDelivery(assignmentId: string): Promise<void> {
    // Update assignment status
    const { data: assignment, error: assignmentError } =
      await this.supabaseService.client
        .from('rider_assignments')
        .update({
          status: 'delivered',
          actual_delivery_time: new Date().toISOString(),
        })
        .eq('id', assignmentId)
        .select()
        .single();

    if (assignmentError || !assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Update rider status back to available
    await this.updateStatus(assignment.rider_id, RiderStatus.AVAILABLE);

    // Get current rider data to increment total deliveries
    const { data: riderData } = await this.supabaseService.client
      .from('riders')
      .select('total_deliveries')
      .eq('id', assignment.rider_id)
      .single();

    if (riderData) {
      const { error: riderError } = await this.supabaseService.client
        .from('riders')
        .update({
          total_deliveries: (riderData.total_deliveries || 0) + 1,
        })
        .eq('id', assignment.rider_id);

      if (riderError) {
        console.error('Failed to update rider delivery count:', riderError);
      }
    }
  }

  async getRiderPerformance(
    riderId: string,
    performanceDto: RiderPerformanceDto,
  ): Promise<RiderPerformanceMetrics> {
    const { data: assignments } = await this.supabaseService.client
      .from('rider_assignments')
      .select('*')
      .eq('rider_id', riderId)
      .gte('assigned_at', performanceDto.startDate)
      .lte('assigned_at', performanceDto.endDate);

    if (!assignments || assignments.length === 0) {
      return {
        riderId,
        totalDeliveries: 0,
        completedDeliveries: 0,
        averageDeliveryTime: 0,
        averageRating: 0,
        onTimeDeliveryRate: 0,
        totalDistance: 0,
        activeHours: 0,
        earnings: 0,
        periodStart: performanceDto.startDate,
        periodEnd: performanceDto.endDate,
      };
    }

    const completedDeliveries = assignments.filter(
      (a) => a.status === 'delivered',
    );
    const totalDeliveries = assignments.length;

    // Calculate average delivery time
    const deliveryTimes = completedDeliveries
      .filter((a) => a.estimated_delivery_time && a.actual_delivery_time)
      .map((a) => {
        const estimated = new Date(a.estimated_delivery_time).getTime();
        const actual = new Date(a.actual_delivery_time).getTime();
        return actual - estimated;
      });

    const averageDeliveryTime =
      deliveryTimes.length > 0
        ? deliveryTimes.reduce((sum, time) => sum + time, 0) /
          deliveryTimes.length /
          (1000 * 60) // in minutes
        : 0;

    // Calculate on-time delivery rate
    const onTimeDeliveries = deliveryTimes.filter((time) => time <= 0).length;
    const onTimeDeliveryRate =
      deliveryTimes.length > 0 ? onTimeDeliveries / deliveryTimes.length : 0;

    return {
      riderId,
      totalDeliveries,
      completedDeliveries: completedDeliveries.length,
      averageDeliveryTime,
      averageRating: 0, // Would need to calculate from reviews
      onTimeDeliveryRate,
      totalDistance: 0, // Would need to calculate from routes
      activeHours: 0, // Would need to track active time
      earnings: 0, // Would need to calculate from delivery fees
      periodStart: performanceDto.startDate,
      periodEnd: performanceDto.endDate,
    };
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('riders')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to deactivate rider: ${error.message}`);
    }
  }

  private mapDatabaseToRider(data: any): Rider {
    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      licenseNumber: data.license_number,
      vehicleType: data.vehicle_type,
      vehicleRegistration: data.vehicle_registration,
      currentLocation: data.current_location,
      status: data.status,
      maxDeliveryRadius: data.max_delivery_radius,
      rating: data.rating,
      totalDeliveries: data.total_deliveries,
      joinedDate: data.joined_date,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
