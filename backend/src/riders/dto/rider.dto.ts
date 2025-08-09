import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsArray,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RiderStatus, VehicleType } from '../interfaces/rider.interface';

export class CreateRiderDto {
  @ApiProperty({ description: 'Full name of the rider' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Email address' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'License number' })
  @IsString()
  licenseNumber: string;

  @ApiProperty({
    description: 'Type of vehicle',
    enum: VehicleType,
    example: VehicleType.MOTORCYCLE,
  })
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @ApiProperty({ description: 'Vehicle registration number' })
  @IsString()
  vehicleRegistration: string;

  @ApiPropertyOptional({
    description: 'Current location coordinates [latitude, longitude]',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  currentLocation?: [number, number];

  @ApiProperty({
    description: 'Status of the rider',
    enum: RiderStatus,
    example: RiderStatus.AVAILABLE,
  })
  @IsEnum(RiderStatus)
  status: RiderStatus;

  @ApiPropertyOptional({ description: 'Maximum delivery radius in km' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDeliveryRadius?: number;

  @ApiPropertyOptional({ description: 'Rating out of 5' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;
}

export class UpdateRiderDto {
  @ApiPropertyOptional({ description: 'Full name of the rider' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Status of the rider',
    enum: RiderStatus,
  })
  @IsOptional()
  @IsEnum(RiderStatus)
  status?: RiderStatus;

  @ApiPropertyOptional({
    description: 'Current location coordinates [latitude, longitude]',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  currentLocation?: [number, number];

  @ApiPropertyOptional({ description: 'Maximum delivery radius in km' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDeliveryRadius?: number;

  @ApiPropertyOptional({ description: 'Vehicle registration number' })
  @IsOptional()
  @IsString()
  vehicleRegistration?: string;
}

export class RiderQueryDto {
  @ApiPropertyOptional({ description: 'Status filter', enum: RiderStatus })
  @IsOptional()
  @IsEnum(RiderStatus)
  status?: RiderStatus;

  @ApiPropertyOptional({
    description: 'Vehicle type filter',
    enum: VehicleType,
  })
  @IsOptional()
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;

  @ApiPropertyOptional({
    description: 'Location coordinates to find nearby riders [lat, lng]',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  nearLocation?: [number, number];

  @ApiPropertyOptional({
    description: 'Radius in kilometers to search for riders',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  radius?: number;

  @ApiPropertyOptional({ description: 'Minimum rating filter' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class RiderAssignmentDto {
  @ApiProperty({ description: 'Order ID to assign the rider to' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Rider ID to assign to the order' })
  @IsString()
  riderId: string;

  @ApiPropertyOptional({ description: 'Estimated pickup time' })
  @IsOptional()
  @IsDateString()
  estimatedPickupTime?: string;

  @ApiPropertyOptional({ description: 'Estimated delivery time' })
  @IsOptional()
  @IsDateString()
  estimatedDeliveryTime?: string;
}

export class RiderPerformanceDto {
  @ApiProperty({ description: 'Date range start' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Date range end' })
  @IsDateString()
  endDate: string;
}
