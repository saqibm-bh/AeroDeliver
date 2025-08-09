import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsBoolean,
  IsArray,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DroneStatus, DroneType } from '../interfaces/drone.interface';

export class CreateDroneDto {
  @ApiProperty({ description: 'The unique identifier of the drone model' })
  @IsString()
  modelId: string;

  @ApiProperty({ description: 'Serial number of the drone' })
  @IsString()
  serialNumber: string;

  @ApiProperty({ description: 'Name of the drone' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Type of the drone',
    enum: DroneType,
    example: DroneType.QUADCOPTER,
  })
  @IsEnum(DroneType)
  droneType: DroneType;

  @ApiProperty({ description: 'Maximum payload capacity in kg' })
  @IsNumber()
  @Min(0)
  maxPayloadCapacity: number;

  @ApiProperty({ description: 'Maximum flight range in kilometers' })
  @IsNumber()
  @Min(0)
  maxFlightRange: number;

  @ApiProperty({ description: 'Maximum flight time in minutes' })
  @IsNumber()
  @Min(0)
  maxFlightTime: number;

  @ApiProperty({ description: 'Battery capacity in percentage' })
  @IsNumber()
  @Min(0)
  @Max(100)
  batteryCapacity: number;

  @ApiPropertyOptional({
    description: 'Current location coordinates [latitude, longitude]',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  currentLocation?: [number, number];

  @ApiProperty({
    description: 'Status of the drone',
    enum: DroneStatus,
    example: DroneStatus.AVAILABLE,
  })
  @IsEnum(DroneStatus)
  status: DroneStatus;

  @ApiPropertyOptional({ description: 'Home base location ID' })
  @IsOptional()
  @IsString()
  homeBaseId?: string;

  @ApiPropertyOptional({ description: 'Notes about the drone' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateDroneDto {
  @ApiPropertyOptional({ description: 'Name of the drone' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Status of the drone',
    enum: DroneStatus,
  })
  @IsOptional()
  @IsEnum(DroneStatus)
  status?: DroneStatus;

  @ApiPropertyOptional({ description: 'Maximum payload capacity in kg' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPayloadCapacity?: number;

  @ApiPropertyOptional({ description: 'Maximum flight range in kilometers' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxFlightRange?: number;

  @ApiPropertyOptional({ description: 'Maximum flight time in minutes' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxFlightTime?: number;

  @ApiPropertyOptional({ description: 'Battery capacity in percentage' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  batteryCapacity?: number;

  @ApiPropertyOptional({
    description: 'Current location coordinates [latitude, longitude]',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  currentLocation?: [number, number];

  @ApiPropertyOptional({ description: 'Home base location ID' })
  @IsOptional()
  @IsString()
  homeBaseId?: string;

  @ApiPropertyOptional({ description: 'Notes about the drone' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class DroneQueryDto {
  @ApiPropertyOptional({ description: 'Status filter', enum: DroneStatus })
  @IsOptional()
  @IsEnum(DroneStatus)
  status?: DroneStatus;

  @ApiPropertyOptional({ description: 'Drone type filter', enum: DroneType })
  @IsOptional()
  @IsEnum(DroneType)
  droneType?: DroneType;

  @ApiPropertyOptional({ description: 'Minimum payload capacity filter in kg' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPayloadCapacity?: number;

  @ApiPropertyOptional({
    description: 'Location coordinates to find nearby drones [lat, lng]',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  nearLocation?: [number, number];

  @ApiPropertyOptional({
    description: 'Radius in kilometers to search for drones',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  radius?: number;

  @ApiPropertyOptional({ description: 'Minimum battery level required' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  minBatteryLevel?: number;

  @ApiPropertyOptional({ description: 'Home base ID filter' })
  @IsOptional()
  @IsString()
  homeBaseId?: string;
}

export class MaintenanceRecordDto {
  @ApiProperty({ description: 'Type of maintenance performed' })
  @IsString()
  maintenanceType: string;

  @ApiProperty({ description: 'Date of maintenance' })
  @IsDateString()
  maintenanceDate: string;

  @ApiProperty({ description: 'Description of maintenance performed' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Technician who performed the maintenance' })
  @IsString()
  technicianId: string;

  @ApiPropertyOptional({ description: 'Next scheduled maintenance date' })
  @IsOptional()
  @IsDateString()
  nextMaintenanceDate?: string;
}

export class DroneAssignmentDto {
  @ApiProperty({ description: 'Order ID to assign the drone to' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Drone ID to assign to the order' })
  @IsString()
  droneId: string;

  @ApiPropertyOptional({ description: 'Estimated pickup time' })
  @IsOptional()
  @IsDateString()
  estimatedPickupTime?: string;

  @ApiPropertyOptional({ description: 'Estimated delivery time' })
  @IsOptional()
  @IsDateString()
  estimatedDeliveryTime?: string;
}

export class NoFlyZoneDto {
  @ApiProperty({ description: 'Name of the no-fly zone' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Polygon coordinates defining the no-fly zone boundary',
  })
  @IsArray()
  boundary: [number, number][];

  @ApiPropertyOptional({
    description: 'Reason for the no-fly zone restriction',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ description: 'Start date for temporary no-fly zones' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for temporary no-fly zones' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Minimum altitude restriction in meters',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minAltitude?: number;
}

export class WeatherRestrictionDto {
  @ApiProperty({ description: 'Maximum wind speed for safe operation (km/h)' })
  @IsNumber()
  maxWindSpeed: number;

  @ApiProperty({
    description: 'Whether to allow operation during precipitation',
  })
  @IsBoolean()
  allowPrecipitation: boolean;

  @ApiProperty({
    description: 'Minimum visibility required for operation (meters)',
  })
  @IsNumber()
  minVisibility: number;

  @ApiPropertyOptional({
    description: 'Minimum temperature for operation (Celsius)',
  })
  @IsOptional()
  @IsNumber()
  minTemperature?: number;

  @ApiPropertyOptional({
    description: 'Maximum temperature for operation (Celsius)',
  })
  @IsOptional()
  @IsNumber()
  maxTemperature?: number;
}
