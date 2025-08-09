import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsObject,
  IsPhoneNumber,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StoreType, StoreStatus, CuisineType } from '../../common/types';

class CoordinatesDto {
  @ApiProperty({ description: 'Latitude coordinate' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Longitude coordinate' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}

class OpenHoursDto {
  @ApiProperty({ description: 'Opening time (HH:MM)' })
  @IsString()
  open: string;

  @ApiProperty({ description: 'Closing time (HH:MM)' })
  @IsString()
  close: string;

  @ApiProperty({ description: 'Whether the store is closed on this day' })
  @IsBoolean()
  isClosed: boolean;
}

export class CreateStoreDto {
  @ApiProperty({ description: 'Store name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Store description' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Store type',
    enum: StoreType,
    example: StoreType.RESTAURANT,
  })
  @IsEnum(StoreType)
  storeType: StoreType;

  @ApiPropertyOptional({
    description: 'Cuisine types (for restaurants)',
    enum: CuisineType,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(CuisineType, { each: true })
  cuisine?: CuisineType[];

  @ApiPropertyOptional({
    description: 'Business categories (for non-restaurant stores)',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({ description: 'Store address' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Store coordinates' })
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @ApiProperty({ description: 'Store phone number' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ description: 'Store email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Estimated delivery time in minutes' })
  @IsNumber()
  @Min(1)
  @Max(180)
  deliveryTime: number;

  @ApiProperty({ description: 'Delivery fee amount' })
  @IsNumber()
  @Min(0)
  deliveryFee: number;

  @ApiProperty({ description: 'Minimum order amount' })
  @IsNumber()
  @Min(0)
  minimumOrder: number;

  @ApiPropertyOptional({ description: 'Store image URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Store operating hours for each day',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => OpenHoursDto)
  openHours: {
    monday: OpenHoursDto;
    tuesday: OpenHoursDto;
    wednesday: OpenHoursDto;
    thursday: OpenHoursDto;
    friday: OpenHoursDto;
    saturday: OpenHoursDto;
    sunday: OpenHoursDto;
  };

  @ApiPropertyOptional({ description: 'Store license number' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ description: 'Tax ID number' })
  @IsOptional()
  @IsString()
  taxId?: string;
}

export class UpdateStoreDto {
  @ApiPropertyOptional({ description: 'Store name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Store description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Cuisine types (for restaurants)',
    enum: CuisineType,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(CuisineType, { each: true })
  cuisine?: CuisineType[];

  @ApiPropertyOptional({
    description: 'Business categories (for non-restaurant stores)',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({ description: 'Store address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Store coordinates' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;

  @ApiPropertyOptional({ description: 'Store phone number' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({ description: 'Store email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Estimated delivery time in minutes' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(180)
  deliveryTime?: number;

  @ApiPropertyOptional({ description: 'Delivery fee amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deliveryFee?: number;

  @ApiPropertyOptional({ description: 'Minimum order amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumOrder?: number;

  @ApiPropertyOptional({ description: 'Store image URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Store operating hours for each day',
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OpenHoursDto)
  openHours?: {
    monday?: OpenHoursDto;
    tuesday?: OpenHoursDto;
    wednesday?: OpenHoursDto;
    thursday?: OpenHoursDto;
    friday?: OpenHoursDto;
    saturday?: OpenHoursDto;
    sunday?: OpenHoursDto;
  };

  @ApiPropertyOptional({ description: 'Store license number' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ description: 'Tax ID number' })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({
    description: 'Store status',
    enum: StoreStatus,
  })
  @IsOptional()
  @IsEnum(StoreStatus)
  status?: StoreStatus;

  @ApiPropertyOptional({ description: 'Whether the store is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class StoreQueryDto {
  @ApiPropertyOptional({
    description: 'Search term for store name or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by store type',
    enum: StoreType,
  })
  @IsOptional()
  @IsEnum(StoreType)
  storeType?: StoreType;

  @ApiPropertyOptional({
    description: 'Filter by cuisine type (for restaurants)',
    enum: CuisineType,
  })
  @IsOptional()
  @IsEnum(CuisineType)
  cuisine?: CuisineType;

  @ApiPropertyOptional({
    description: 'Filter by category (for non-restaurant stores)',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by store status',
    enum: StoreStatus,
  })
  @IsOptional()
  @IsEnum(StoreStatus)
  status?: StoreStatus;

  @ApiPropertyOptional({
    description: 'User latitude for distance calculation',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({
    description: 'User longitude for distance calculation',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Maximum distance in kilometers',
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  @IsNumber()
  @Min(0.1)
  @Max(100)
  maxDistance?: number;

  @ApiPropertyOptional({ description: 'Sort field', default: 'created_at' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class StoreStatsResponseDto {
  @ApiProperty({ description: 'Total orders' })
  totalOrders: number;

  @ApiProperty({ description: 'Total revenue' })
  totalRevenue: number;

  @ApiProperty({ description: 'Average order value' })
  averageOrderValue: number;

  @ApiProperty({ description: 'Total customers' })
  totalCustomers: number;

  @ApiProperty({ description: 'Average rating' })
  averageRating: number;

  @ApiProperty({ description: 'Total ratings' })
  totalRatings: number;

  @ApiProperty({ description: 'Revenue this month' })
  revenueThisMonth: number;

  @ApiProperty({ description: 'Orders this month' })
  ordersThisMonth: number;

  @ApiProperty({ description: 'Growth percentage' })
  growthPercentage: number;
}

export class StoreStatsDto {
  @ApiPropertyOptional({
    description: 'Start date for statistics (ISO string)',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for statistics (ISO string)' })
  @IsOptional()
  @IsString()
  endDate?: string;
}
