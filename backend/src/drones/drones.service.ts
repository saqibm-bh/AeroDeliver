import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  CreateDroneDto,
  UpdateDroneDto,
  DroneQueryDto,
  MaintenanceRecordDto,
  DroneAssignmentDto,
  NoFlyZoneDto,
  WeatherRestrictionDto,
} from './dto/drone.dto';
import {
  Drone,
  DroneType,
  DroneStatus,
  MaintenanceRecord,
  DroneAssignment,
  NoFlyZone,
  WeatherRestriction,
} from './interfaces/drone.interface';
import { calculateDistance } from '../common/utils/delivery.utils';

@Injectable()
export class DronesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createDrone(createDroneDto: CreateDroneDto): Promise<Drone> {
    const { data, error } = await this.supabaseService.client
      .from('drones')
      .insert({
        model_id: createDroneDto.modelId,
        serial_number: createDroneDto.serialNumber,
        name: createDroneDto.name,
        drone_type: createDroneDto.droneType,
        max_payload_capacity: createDroneDto.maxPayloadCapacity,
        max_flight_range: createDroneDto.maxFlightRange,
        max_flight_time: createDroneDto.maxFlightTime,
        battery_capacity: createDroneDto.batteryCapacity,
        current_location: createDroneDto.currentLocation,
        status: createDroneDto.status,
        home_base_id: createDroneDto.homeBaseId,
        notes: createDroneDto.notes,
      })
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(`Failed to create drone: ${error.message}`);
    }

    return this.mapDroneDbToEntity(data);
  }

  async getDroneById(id: string): Promise<Drone> {
    const { data, error } = await this.supabaseService.client
      .from('drones')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Drone with ID ${id} not found`);
    }

    return this.mapDroneDbToEntity(data);
  }

  async updateDrone(
    id: string,
    updateDroneDto: UpdateDroneDto,
  ): Promise<Drone> {
    const updateData: Partial<Record<string, unknown>> = {};

    if (updateDroneDto.name !== undefined)
      updateData.name = updateDroneDto.name;
    if (updateDroneDto.status !== undefined)
      updateData.status = updateDroneDto.status;
    if (updateDroneDto.maxPayloadCapacity !== undefined)
      updateData.max_payload_capacity = updateDroneDto.maxPayloadCapacity;
    if (updateDroneDto.maxFlightRange !== undefined)
      updateData.max_flight_range = updateDroneDto.maxFlightRange;
    if (updateDroneDto.maxFlightTime !== undefined)
      updateData.max_flight_time = updateDroneDto.maxFlightTime;
    if (updateDroneDto.batteryCapacity !== undefined)
      updateData.battery_capacity = updateDroneDto.batteryCapacity;
    if (updateDroneDto.currentLocation !== undefined)
      updateData.current_location = updateDroneDto.currentLocation;
    if (updateDroneDto.homeBaseId !== undefined)
      updateData.home_base_id = updateDroneDto.homeBaseId;
    if (updateDroneDto.notes !== undefined)
      updateData.notes = updateDroneDto.notes;

    const { data, error } = await this.supabaseService.client
      .from('drones')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      throw new NotFoundException(
        `Failed to update drone with ID ${id}: ${error?.message || 'Drone not found'}`,
      );
    }

    return this.mapDroneDbToEntity(data);
  }

  async deleteDrone(id: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('drones')
      .delete()
      .eq('id', id);

    if (error) {
      throw new BadRequestException(`Failed to delete drone: ${error.message}`);
    }
  }

  async queryDrones(queryDto: DroneQueryDto): Promise<Drone[]> {
    let query = this.supabaseService.client.from('drones').select('*');

    if (queryDto.status) {
      query = query.eq('status', queryDto.status);
    }
    if (queryDto.droneType) {
      query = query.eq('drone_type', queryDto.droneType);
    }
    if (queryDto.minPayloadCapacity) {
      query = query.gte('max_payload_capacity', queryDto.minPayloadCapacity);
    }
    if (queryDto.minBatteryLevel) {
      query = query.gte('battery_capacity', queryDto.minBatteryLevel);
    }
    if (queryDto.homeBaseId) {
      query = query.eq('home_base_id', queryDto.homeBaseId);
    }

    const response = await query;
    const data = response?.data;
    const error = response?.error;

    if (error) {
      throw new BadRequestException(`Failed to query drones: ${error.message}`);
    }

    let drones: Drone[] = Array.isArray(data)
      ? (data
          .map((d) => (d ? this.mapDroneDbToEntity(d) : null))
          .filter(Boolean) as Drone[])
      : [];

    if (
      Array.isArray(queryDto.nearLocation) &&
      queryDto.nearLocation.length === 2 &&
      typeof queryDto.radius === 'number' &&
      drones.length > 0
    ) {
      drones = drones.filter((drone) => {
        if (
          !drone.currentLocation ||
          !Array.isArray(drone.currentLocation) ||
          drone.currentLocation.length !== 2
        ) {
          return false;
        }
        if (!queryDto.nearLocation) return true;
        const distance = calculateDistance(
          drone.currentLocation[0],
          drone.currentLocation[1],
          queryDto.nearLocation[0],
          queryDto.nearLocation[1],
        );
        return (
          typeof queryDto.radius === 'number' && distance <= queryDto.radius
        );
      });
    }

    return drones;
  }

  async getAvailableDrones(): Promise<Drone[]> {
    const { data, error } = await this.supabaseService.client
      .from('drones')
      .select('*')
      .eq('status', DroneStatus.AVAILABLE);

    if (error) {
      throw new BadRequestException(
        `Failed to get available drones: ${error.message}`,
      );
    }

    return Array.isArray(data)
      ? data.map((d) => this.mapDroneDbToEntity(d))
      : [];
  }

  async updateDroneStatus(id: string, status: DroneStatus): Promise<Drone> {
    const { data, error } = await this.supabaseService.client
      .from('drones')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      throw new NotFoundException(
        `Failed to update drone status for ID ${id}: ${error?.message || 'Drone not found'}`,
      );
    }

    return this.mapDroneDbToEntity(data);
  }

  async updateDroneLocation(
    id: string,
    location: [number, number],
  ): Promise<Drone> {
    const { data, error } = await this.supabaseService.client
      .from('drones')
      .update({
        current_location: location,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      throw new NotFoundException(
        `Failed to update drone location for ID ${id}: ${error?.message || 'Drone not found'}`,
      );
    }

    return this.mapDroneDbToEntity(data);
  }

  async updateDroneBattery(id: string, batteryLevel: number): Promise<Drone> {
    if (batteryLevel < 0 || batteryLevel > 100) {
      throw new BadRequestException('Battery level must be between 0 and 100');
    }

    const { data, error } = await this.supabaseService.client
      .from('drones')
      .update({
        battery_capacity: batteryLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      throw new NotFoundException(
        `Failed to update drone battery for ID ${id}: ${error?.message || 'Drone not found'}`,
      );
    }

    return this.mapDroneDbToEntity(data);
  }

  // Maintenance records management
  async addMaintenanceRecord(
    droneId: string,
    recordDto: MaintenanceRecordDto,
  ): Promise<MaintenanceRecord> {
    await this.getDroneById(droneId);

    const { data, error } = await this.supabaseService.client
      .from('drone_maintenance')
      .insert({
        drone_id: droneId,
        maintenance_type: recordDto.maintenanceType,
        maintenance_date: recordDto.maintenanceDate,
        description: recordDto.description,
        technician_id: recordDto.technicianId,
        next_maintenance_date: recordDto.nextMaintenanceDate,
      })
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to add maintenance record: ${error.message}`,
      );
    }

    await this.updateDroneStatus(droneId, DroneStatus.MAINTENANCE);

    return {
      id: data.id,
      droneId: data.drone_id,
      maintenanceType: data.maintenance_type,
      maintenanceDate: new Date(data.maintenance_date),
      description: data.description,
      technicianId: data.technician_id,
      nextMaintenanceDate: data.next_maintenance_date
        ? new Date(data.next_maintenance_date)
        : undefined,
      createdAt: new Date(data.created_at),
    };
  }

  async getMaintenanceHistory(droneId: string): Promise<MaintenanceRecord[]> {
    const { data, error } = await this.supabaseService.client
      .from('drone_maintenance')
      .select('*')
      .eq('drone_id', droneId)
      .order('maintenance_date', { ascending: false });

    if (error) {
      throw new BadRequestException(
        `Failed to get maintenance history: ${error.message}`,
      );
    }

    return Array.isArray(data)
      ? data.map((record) => ({
          id: record.id,
          droneId: record.drone_id,
          maintenanceType: record.maintenance_type,
          maintenanceDate: new Date(record.maintenance_date),
          description: record.description,
          technicianId: record.technician_id,
          nextMaintenanceDate: record.next_maintenance_date
            ? new Date(record.next_maintenance_date)
            : undefined,
          createdAt: new Date(record.created_at),
        }))
      : [];
  }

  // Drone assignment functions
  /**
   * Assigns a drone to an order (previously assignDroneToOrder)
   * @param assignmentDto The assignment details
   * @returns DroneAssignment with the assignment details
   */
  async assignDrone(
    assignmentDto: DroneAssignmentDto,
  ): Promise<DroneAssignment> {
    // Check if drone exists and is available
    const drone = await this.getDroneById(assignmentDto.droneId);

    // Validate drone status
    if (drone.status !== DroneStatus.AVAILABLE) {
      throw new BadRequestException(
        `Drone ${assignmentDto.droneId} is not available for assignment (current status: ${drone.status})`,
      );
    }

    // Validate battery level
    if (drone.batteryCapacity < 30) {
      throw new BadRequestException(
        `Drone ${assignmentDto.droneId} has insufficient battery (${drone.batteryCapacity}%)`,
      );
    }

    // Fetch order details from the orders service or directly from DB to get pickup and delivery locations
    // For now, let's assume we have hardcoded or mocked route data
    const mockRoute: [number, number][] = [];
    let distance = 0;

    if (drone.currentLocation) {
      // In a real implementation, we would calculate the route from the drone's current location to pickup
      // and then to delivery location using a routing service
      mockRoute.push(drone.currentLocation);

      // Example: Add a mock pickup and delivery location (would come from the order in real implementation)
      const mockPickupLocation: [number, number] = [
        drone.currentLocation[0] + 0.01,
        drone.currentLocation[1] + 0.01,
      ];
      const mockDeliveryLocation: [number, number] = [
        drone.currentLocation[0] + 0.02,
        drone.currentLocation[1] + 0.02,
      ];

      mockRoute.push(mockPickupLocation);
      mockRoute.push(mockDeliveryLocation);

      // Calculate approximate distance
      distance =
        calculateDistance(
          drone.currentLocation[0],
          drone.currentLocation[1],
          mockPickupLocation[0],
          mockPickupLocation[1],
        ) +
        calculateDistance(
          mockPickupLocation[0],
          mockPickupLocation[1],
          mockDeliveryLocation[0],
          mockDeliveryLocation[1],
        );
    }

    // Create assignment record
    const { data, error } = await this.supabaseService.client
      .from('drone_assignments')
      .insert({
        drone_id: assignmentDto.droneId,
        order_id: assignmentDto.orderId,
        assigned_at: new Date().toISOString(),
        estimated_pickup_time: assignmentDto.estimatedPickupTime,
        estimated_delivery_time: assignmentDto.estimatedDeliveryTime,
        route: mockRoute.length > 0 ? mockRoute : undefined,
        distance: distance > 0 ? distance : undefined,
        status: 'assigned',
      })
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(`Failed to assign drone: ${error.message}`);
    }

    // Update drone status to IN_DELIVERY
    await this.updateDroneStatus(
      assignmentDto.droneId,
      DroneStatus.IN_DELIVERY,
    );

    // Map database record to DroneAssignment interface
    return {
      id: data.id,
      droneId: data.drone_id,
      orderId: data.order_id,
      assignedAt: new Date(data.assigned_at),
      estimatedPickupTime: data.estimated_pickup_time
        ? new Date(data.estimated_pickup_time)
        : undefined,
      estimatedDeliveryTime: data.estimated_delivery_time
        ? new Date(data.estimated_delivery_time)
        : undefined,
      status: data.status,
    };
  }

  // This method is deprecated, use assignDrone instead
  async assignDroneToOrder(
    assignmentDto: DroneAssignmentDto,
  ): Promise<DroneAssignment> {
    return this.assignDrone(assignmentDto);
  }

  async getDroneAssignments(droneId: string): Promise<DroneAssignment[]> {
    const { data, error } = await this.supabaseService.client
      .from('drone_assignments')
      .select('*')
      .eq('drone_id', droneId)
      .order('assigned_at', { ascending: false });

    if (error) {
      throw new BadRequestException(
        `Failed to get drone assignments: ${error.message}`,
      );
    }

    return Array.isArray(data)
      ? data.map((assignment) => ({
          id: assignment.id,
          droneId: assignment.drone_id,
          orderId: assignment.order_id,
          assignedAt: new Date(assignment.assigned_at),
          estimatedPickupTime: assignment.estimated_pickup_time
            ? new Date(assignment.estimated_pickup_time)
            : undefined,
          estimatedDeliveryTime: assignment.estimated_delivery_time
            ? new Date(assignment.estimated_delivery_time)
            : undefined,
          actualPickupTime: assignment.actual_pickup_time
            ? new Date(assignment.actual_pickup_time)
            : undefined,
          actualDeliveryTime: assignment.actual_delivery_time
            ? new Date(assignment.actual_delivery_time)
            : undefined,
          status: assignment.status,
          route: assignment.route,
        }))
      : [];
  }

  async getCurrentAssignment(droneId: string): Promise<DroneAssignment | null> {
    const { data, error } = await this.supabaseService.client
      .from('drone_assignments')
      .select('*')
      .eq('drone_id', droneId)
      .in('status', ['pending', 'in_progress'])
      .order('assigned_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      droneId: data.drone_id,
      orderId: data.order_id,
      assignedAt: new Date(data.assigned_at),
      estimatedPickupTime: data.estimated_pickup_time
        ? new Date(data.estimated_pickup_time)
        : undefined,
      estimatedDeliveryTime: data.estimated_delivery_time
        ? new Date(data.estimated_delivery_time)
        : undefined,
      actualPickupTime: data.actual_pickup_time
        ? new Date(data.actual_pickup_time)
        : undefined,
      actualDeliveryTime: data.actual_delivery_time
        ? new Date(data.actual_delivery_time)
        : undefined,
      status: data.status,
      route: data.route,
    };
  }

  async updateAssignmentStatus(
    assignmentId: string,
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled',
    actualPickupTime?: Date,
    actualDeliveryTime?: Date,
  ): Promise<DroneAssignment> {
    const updateData: Partial<Record<string, unknown>> = { status };
    if (actualPickupTime)
      updateData.actual_pickup_time = actualPickupTime.toISOString();
    if (actualDeliveryTime)
      updateData.actual_delivery_time = actualDeliveryTime.toISOString();

    const { data, error } = await this.supabaseService.client
      .from('drone_assignments')
      .update(updateData)
      .eq('id', assignmentId)
      .select('*')
      .single();

    if (error || !data) {
      throw new NotFoundException(
        `Failed to update assignment status: ${error?.message || 'Assignment not found'}`,
      );
    }

    if (status === 'completed' || status === 'cancelled') {
      await this.updateDroneStatus(data.drone_id, DroneStatus.AVAILABLE);
    } else if (status === 'in_progress') {
      await this.updateDroneStatus(data.drone_id, DroneStatus.IN_DELIVERY);
    }

    return {
      id: data.id,
      droneId: data.drone_id,
      orderId: data.order_id,
      assignedAt: new Date(data.assigned_at),
      estimatedPickupTime: data.estimated_pickup_time
        ? new Date(data.estimated_pickup_time)
        : undefined,
      estimatedDeliveryTime: data.estimated_delivery_time
        ? new Date(data.estimated_delivery_time)
        : undefined,
      actualPickupTime: data.actual_pickup_time
        ? new Date(data.actual_pickup_time)
        : undefined,
      actualDeliveryTime: data.actual_delivery_time
        ? new Date(data.actual_delivery_time)
        : undefined,
      status: data.status,
      route: data.route,
    };
  }

  // No-fly zones management
  async createNoFlyZone(zoneDto: NoFlyZoneDto): Promise<NoFlyZone> {
    const { data, error } = await this.supabaseService.client
      .from('no_fly_zones')
      .insert({
        name: zoneDto.name,
        boundary: zoneDto.boundary,
        reason: zoneDto.reason,
        start_date: zoneDto.startDate,
        end_date: zoneDto.endDate,
        min_altitude: zoneDto.minAltitude,
      })
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to create no-fly zone: ${error.message}`,
      );
    }

    return {
      id: data.id,
      name: data.name,
      boundary: data.boundary,
      reason: data.reason,
      startDate: data.start_date ? new Date(data.start_date) : undefined,
      endDate: data.end_date ? new Date(data.end_date) : undefined,
      minAltitude: data.min_altitude,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async getNoFlyZones(): Promise<NoFlyZone[]> {
    const { data, error } = await this.supabaseService.client
      .from('no_fly_zones')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(
        `Failed to get no-fly zones: ${error.message}`,
      );
    }

    return Array.isArray(data)
      ? data.map((zone) => ({
          id: zone.id,
          name: zone.name,
          boundary: zone.boundary,
          reason: zone.reason,
          startDate: zone.start_date ? new Date(zone.start_date) : undefined,
          endDate: zone.end_date ? new Date(zone.end_date) : undefined,
          minAltitude: zone.min_altitude,
          createdAt: new Date(zone.created_at),
          updatedAt: new Date(zone.updated_at),
        }))
      : [];
  }

  async getActiveNoFlyZones(): Promise<NoFlyZone[]> {
    const now = new Date().toISOString();
    const { data, error } = await this.supabaseService.client
      .from('no_fly_zones')
      .select('*')
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`);

    if (error) {
      throw new BadRequestException(
        `Failed to get active no-fly zones: ${error.message}`,
      );
    }

    return Array.isArray(data)
      ? data.map((zone) => ({
          id: zone.id,
          name: zone.name,
          boundary: zone.boundary,
          reason: zone.reason,
          startDate: zone.start_date ? new Date(zone.start_date) : undefined,
          endDate: zone.end_date ? new Date(zone.end_date) : undefined,
          minAltitude: zone.min_altitude,
          createdAt: new Date(zone.created_at),
          updatedAt: new Date(zone.updated_at),
        }))
      : [];
  }

  // Weather restrictions management
  async setWeatherRestriction(
    droneTypeId: string,
    restrictionDto: WeatherRestrictionDto,
  ): Promise<WeatherRestriction> {
    const { data, error } = await this.supabaseService.client
      .from('weather_restrictions')
      .upsert({
        drone_type_id: droneTypeId,
        max_wind_speed: restrictionDto.maxWindSpeed,
        allow_precipitation: restrictionDto.allowPrecipitation,
        min_visibility: restrictionDto.minVisibility,
        min_temperature: restrictionDto.minTemperature,
        max_temperature: restrictionDto.maxTemperature,
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to set weather restriction: ${error.message}`,
      );
    }

    return {
      id: data.id,
      droneTypeId: data.drone_type_id,
      maxWindSpeed: data.max_wind_speed,
      allowPrecipitation: data.allow_precipitation,
      minVisibility: data.min_visibility,
      minTemperature: data.min_temperature,
      maxTemperature: data.max_temperature,
      updatedAt: new Date(data.updated_at),
    };
  }

  async getWeatherRestrictions(): Promise<WeatherRestriction[]> {
    const { data, error } = await this.supabaseService.client
      .from('weather_restrictions')
      .select('*');

    if (error) {
      throw new BadRequestException(
        `Failed to get weather restrictions: ${error.message}`,
      );
    }

    return Array.isArray(data)
      ? data.map((restriction) => ({
          id: restriction.id,
          droneTypeId: restriction.drone_type_id,
          maxWindSpeed: restriction.max_wind_speed,
          allowPrecipitation: restriction.allow_precipitation,
          minVisibility: restriction.min_visibility,
          minTemperature: restriction.min_temperature,
          maxTemperature: restriction.max_temperature,
          updatedAt: new Date(restriction.updated_at),
        }))
      : [];
  }

  // Helper methods
  private mapDroneDbToEntity(data: unknown): Drone {
    if (!data || typeof data !== 'object') {
      throw new BadRequestException('Invalid drone data from database');
    }
    const {
      id = '',
      model_id = '',
      serial_number = '',
      name = '',
      drone_type = '',
      max_payload_capacity = 0,
      max_flight_range = 0,
      max_flight_time = 0,
      battery_capacity = 0,
      current_location,
      status = DroneStatus.AVAILABLE,
      home_base_id = '',
      created_at,
      updated_at,
      notes = '',
    } = data as Record<string, unknown>;
    return {
      id: typeof id === 'string' ? id : '',
      modelId: typeof model_id === 'string' ? model_id : '',
      serialNumber: typeof serial_number === 'string' ? serial_number : '',
      name: typeof name === 'string' ? name : '',
      droneType:
        typeof drone_type === 'string' &&
        Object.values(DroneType).includes(drone_type as DroneType)
          ? (drone_type as DroneType)
          : DroneType.QUADCOPTER,
      maxPayloadCapacity:
        typeof max_payload_capacity === 'number' ? max_payload_capacity : 0,
      maxFlightRange:
        typeof max_flight_range === 'number' ? max_flight_range : 0,
      maxFlightTime: typeof max_flight_time === 'number' ? max_flight_time : 0,
      batteryCapacity:
        typeof battery_capacity === 'number' ? battery_capacity : 0,
      currentLocation:
        Array.isArray(current_location) && current_location.length === 2
          ? [Number(current_location[0]), Number(current_location[1])]
          : undefined,
      status:
        typeof status === 'string' &&
        Object.values(DroneStatus).includes(status as DroneStatus)
          ? (status as DroneStatus)
          : DroneStatus.AVAILABLE,
      homeBaseId: typeof home_base_id === 'string' ? home_base_id : '',
      createdAt:
        typeof created_at === 'string' || typeof created_at === 'number'
          ? new Date(created_at)
          : new Date(),
      updatedAt:
        typeof updated_at === 'string' || typeof updated_at === 'number'
          ? new Date(updated_at)
          : new Date(),
      notes: typeof notes === 'string' ? notes : '',
    };
  }

  async findAvailableDrones(
    location: [number, number],
    maxDistance = 15,
    droneType?: DroneType,
  ): Promise<Drone[]> {
    // Get all available drones
    let query = this.supabaseService.client
      .from('drones')
      .select('*')
      .eq('status', DroneStatus.AVAILABLE)
      .gte('battery_capacity', 30); // Minimum 30% battery required

    if (droneType) {
      query = query.eq('drone_type', droneType);
    }

    const { data, error } = await query;

    if (error) {
      throw new BadRequestException(
        `Failed to fetch available drones: ${error.message}`,
      );
    }

    // Filter by location and distance if provided
    const mappedDrones = Array.isArray(data)
      ? data.map((d) => this.mapDroneDbToEntity(d))
      : [];

    const availableDrones = mappedDrones
      .filter((drone) => {
        if (!drone.currentLocation) return false;

        const distance = calculateDistance(
          location[0],
          location[1],
          drone.currentLocation[0],
          drone.currentLocation[1],
        );

        // Check if drone can reach the location considering its max range
        return distance <= Math.min(maxDistance, drone.maxFlightRange);
      })
      // Sort by distance (closest first)
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

    return availableDrones;
  }
}
