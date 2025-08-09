import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RidersService } from '../riders/riders.service';
import { DronesService } from '../drones/drones.service';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  CreateRiderDto,
  UpdateRiderDto,
} from './dto/fleet.dto';
import {
  Vehicle,
  Rider,
  VehicleStatus,
  RiderStatus,
} from './interfaces/fleet.interface';

@Injectable()
export class FleetService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly ridersService: RidersService,
    private readonly dronesService: DronesService,
  ) {}

  // Vehicle Management
  async createVehicle(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const { data, error } = await this.supabaseService.client
      .from('vehicles')
      .insert({
        ...createVehicleDto,
        status: VehicleStatus.AVAILABLE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create vehicle: ${error.message}`);
    }

    return data;
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    const { data, error } = await this.supabaseService.client
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch vehicles: ${error.message}`);
    }

    return data || [];
  }

  async getVehicleById(id: string): Promise<Vehicle> {
    const { data, error } = await this.supabaseService.client
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Vehicle not found');
    }

    return data;
  }

  async updateVehicle(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const { data, error } = await this.supabaseService.client
      .from('vehicles')
      .update({
        ...updateVehicleDto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Vehicle not found or failed to update');
    }

    return data;
  }

  async deleteVehicle(id: string): Promise<void> {
    // Check if vehicle is currently assigned to any active delivery
    const { data: activeDeliveries } = await this.supabaseService.client
      .from('deliveries')
      .select('id')
      .eq('vehicle_id', id)
      .in('status', [
        'assigned',
        'en_route_pickup',
        'picked_up',
        'en_route_delivery',
      ]);

    if (activeDeliveries && activeDeliveries.length > 0) {
      throw new BadRequestException(
        'Cannot delete vehicle with active deliveries',
      );
    }

    const { error } = await this.supabaseService.client
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete vehicle: ${error.message}`);
    }
  }

  async getAvailableVehicles(): Promise<Vehicle[]> {
    const { data, error } = await this.supabaseService.client
      .from('vehicles')
      .select('*')
      .eq('status', VehicleStatus.AVAILABLE)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch available vehicles: ${error.message}`);
    }

    return data || [];
  }

  // Rider Management
  async createRider(createRiderDto: CreateRiderDto): Promise<Rider> {
    const { data, error } = await this.supabaseService.client
      .from('riders')
      .insert({
        ...createRiderDto,
        status: RiderStatus.OFFLINE,
        rating: 5.0,
        total_deliveries: 0,
        online_hours: 0,
        earnings: 0,
        joined_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create rider: ${error.message}`);
    }

    return data;
  }

  async getAllRiders(): Promise<Rider[]> {
    const { data, error } = await this.supabaseService.client
      .from('riders')
      .select('*')
      .order('joined_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch riders: ${error.message}`);
    }

    return data || [];
  }

  async getRiderById(id: string): Promise<Rider> {
    const { data, error } = await this.supabaseService.client
      .from('riders')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Rider not found');
    }

    return data;
  }

  async updateRider(
    id: string,
    updateRiderDto: UpdateRiderDto,
  ): Promise<Rider> {
    const { data, error } = await this.supabaseService.client
      .from('riders')
      .update({
        ...updateRiderDto,
        last_active_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Rider not found or failed to update');
    }

    return data;
  }

  async getAvailableRiders(): Promise<Rider[]> {
    const { data, error } = await this.supabaseService.client
      .from('riders')
      .select('*')
      .eq('status', RiderStatus.AVAILABLE)
      .order('rating', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch available riders: ${error.message}`);
    }

    return data || [];
  }

  async assignVehicleToRider(
    riderId: string,
    vehicleId: string,
  ): Promise<void> {
    // Check if vehicle is available
    const vehicle = await this.getVehicleById(vehicleId);
    if (vehicle.status !== VehicleStatus.AVAILABLE) {
      throw new BadRequestException('Vehicle is not available for assignment');
    }

    // Check if rider exists and is available
    const rider = await this.getRiderById(riderId);
    if (rider.vehicleId) {
      throw new BadRequestException('Rider already has a vehicle assigned');
    }

    // Update vehicle to assign to rider
    await this.updateVehicle(vehicleId, {
      assignedRiderId: riderId,
      status: VehicleStatus.IN_USE,
    });

    // Update rider to assign vehicle
    await this.updateRider(riderId, {
      vehicleId,
    });
  }

  async unassignVehicleFromRider(riderId: string): Promise<void> {
    const rider = await this.getRiderById(riderId);

    if (!rider.vehicleId) {
      throw new BadRequestException('Rider does not have a vehicle assigned');
    }

    // Update vehicle to remove assignment
    await this.updateVehicle(rider.vehicleId, {
      assignedRiderId: undefined,
      status: VehicleStatus.AVAILABLE,
    });

    // Update rider to remove vehicle
    await this.updateRider(riderId, {
      vehicleId: undefined,
    });
  }

  async updateRiderLocation(
    riderId: string,
    location: { latitude: number; longitude: number },
  ): Promise<void> {
    await this.updateRider(riderId, {
      currentLocation: location,
    });
  }

  async updateVehicleLocation(
    vehicleId: string,
    location: { latitude: number; longitude: number },
  ): Promise<void> {
    await this.updateVehicle(vehicleId, {
      currentLocation: location,
    });
  }

  async getFleetStatistics(): Promise<any> {
    // Get vehicle statistics
    const { data: vehicles } = await this.supabaseService.client
      .from('vehicles')
      .select('status, type');

    // Get rider statistics
    const { data: riders } = await this.supabaseService.client
      .from('riders')
      .select('status');

    const vehicleStats = {
      total: vehicles?.length || 0,
      available:
        vehicles?.filter((v) => v.status === VehicleStatus.AVAILABLE).length ||
        0,
      inUse:
        vehicles?.filter((v) => v.status === VehicleStatus.IN_USE).length || 0,
      maintenance:
        vehicles?.filter((v) => v.status === VehicleStatus.MAINTENANCE)
          .length || 0,
      offline:
        vehicles?.filter((v) => v.status === VehicleStatus.OFFLINE).length || 0,
      byType: {
        drones: vehicles?.filter((v) => v.type === 'drone').length || 0,
        bikes: vehicles?.filter((v) => v.type === 'bike').length || 0,
        scooters: vehicles?.filter((v) => v.type === 'scooter').length || 0,
        cars: vehicles?.filter((v) => v.type === 'car').length || 0,
      },
    };

    const riderStats = {
      total: riders?.length || 0,
      available:
        riders?.filter((r) => r.status === RiderStatus.AVAILABLE).length || 0,
      onDelivery:
        riders?.filter((r) => r.status === RiderStatus.ON_DELIVERY).length || 0,
      offline:
        riders?.filter((r) => r.status === RiderStatus.OFFLINE).length || 0,
      onBreak:
        riders?.filter((r) => r.status === RiderStatus.BREAK).length || 0,
    };

    return {
      vehicles: vehicleStats,
      riders: riderStats,
    };
  }
}
