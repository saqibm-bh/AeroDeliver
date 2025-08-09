import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsObject,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryType, DeliveryStatus } from '../interfaces/delivery.interface';

class LocationDto {
  @ApiProperty({ description: 'Latitude' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude' })
  @IsNumber()
  longitude: number;

  @ApiProperty({ description: 'Address' })
  @IsString()
  address: string;
}

export class CreateDeliveryDto {
  @ApiProperty({ description: 'Order ID' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Delivery type', enum: DeliveryType })
  @IsEnum(DeliveryType)
  type: DeliveryType;

  @ApiProperty({ description: 'Pickup location', type: LocationDto })
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  pickupLocation: LocationDto;

  @ApiProperty({ description: 'Delivery location', type: LocationDto })
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  deliveryLocation: LocationDto;

  @ApiProperty({
    description: 'Vehicle ID (for drone delivery)',
    required: false,
  })
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @ApiProperty({
    description: 'Rider ID (for rider delivery)',
    required: false,
  })
  @IsOptional()
  @IsString()
  riderId?: string;

  @ApiProperty({
    description: 'Special delivery instructions',
    required: false,
  })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

export class UpdateDeliveryDto extends PartialType(CreateDeliveryDto) {
  @ApiProperty({
    description: 'Delivery status',
    enum: DeliveryStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;

  @ApiProperty({ description: 'Actual pickup time', required: false })
  @IsOptional()
  @IsString()
  actualPickupTime?: string;

  @ApiProperty({ description: 'Actual delivery time', required: false })
  @IsOptional()
  @IsString()
  actualDeliveryTime?: string;
}

export class DeliveryQueryDto {
  @ApiProperty({ description: 'Page number', required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiProperty({ description: 'Items per page', required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;

  @ApiProperty({ description: 'Delivery status', required: false })
  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;

  @ApiProperty({ description: 'Delivery type', required: false })
  @IsOptional()
  @IsEnum(DeliveryType)
  type?: DeliveryType;

  @ApiProperty({ description: 'Rider ID', required: false })
  @IsOptional()
  @IsString()
  riderId?: string;
}
