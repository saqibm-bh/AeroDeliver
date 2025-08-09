import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsObject,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  VehicleType,
  VehicleStatus,
  RiderStatus,
} from '../interfaces/fleet.interface';

class LocationDto {
  @ApiProperty({ description: 'Latitude' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude' })
  @IsNumber()
  longitude: number;
}

export class CreateVehicleDto {
  @ApiProperty({ description: 'Vehicle type', enum: VehicleType })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ description: 'Vehicle model' })
  @IsString()
  model: string;

  @ApiProperty({ description: 'Vehicle brand' })
  @IsString()
  brand: string;

  @ApiProperty({ description: 'Vehicle plate number', required: false })
  @IsOptional()
  @IsString()
  plateNumber?: string;

  @ApiProperty({ description: 'Battery level (0-100)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  batteryLevel?: number;

  @ApiProperty({ description: 'Maximum capacity in grams' })
  @IsNumber()
  @Min(1)
  maxCapacity: number;

  @ApiProperty({ description: 'Current location', required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  currentLocation?: LocationDto;
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @ApiProperty({
    description: 'Vehicle status',
    enum: VehicleStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @ApiProperty({ description: 'Assigned rider ID', required: false })
  @IsOptional()
  @IsString()
  assignedRiderId?: string;

  @ApiProperty({ description: 'Last maintenance date', required: false })
  @IsOptional()
  @IsString()
  lastMaintenanceDate?: string;

  @ApiProperty({ description: 'Next maintenance date', required: false })
  @IsOptional()
  @IsString()
  nextMaintenanceDate?: string;
}

export class CreateRiderDto {
  @ApiProperty({ description: 'User ID reference' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Current location', required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  currentLocation?: LocationDto;
}

export class UpdateRiderDto extends PartialType(CreateRiderDto) {
  @ApiProperty({
    description: 'Rider status',
    enum: RiderStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(RiderStatus)
  status?: RiderStatus;

  @ApiProperty({ description: 'Assigned vehicle ID', required: false })
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @ApiProperty({ description: 'Rider rating', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ description: 'Total deliveries completed', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalDeliveries?: number;

  @ApiProperty({ description: 'Total online hours', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  onlineHours?: number;

  @ApiProperty({ description: 'Total earnings', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  earnings?: number;
}
