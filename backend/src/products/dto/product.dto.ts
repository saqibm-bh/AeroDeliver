import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum ProductCategory {
  // Food & Beverages
  FOOD = 'food',
  BEVERAGES = 'beverages',
  GROCERIES = 'groceries',

  // Electronics & Tech
  ELECTRONICS = 'electronics',
  MOBILE_PHONES = 'mobile_phones',
  COMPUTERS = 'computers',
  GAMING = 'gaming',

  // Fashion & Apparel
  CLOTHING = 'clothing',
  SHOES = 'shoes',
  ACCESSORIES = 'accessories',
  JEWELRY = 'jewelry',

  // Home & Living
  HOME_DECOR = 'home_decor',
  FURNITURE = 'furniture',
  KITCHEN = 'kitchen',
  GARDEN = 'garden',

  // Health & Beauty
  BEAUTY = 'beauty',
  HEALTH = 'health',
  PERSONAL_CARE = 'personal_care',
  FITNESS = 'fitness',

  // Books & Media
  BOOKS = 'books',
  MUSIC = 'music',
  MOVIES = 'movies',

  // Sports & Outdoors
  SPORTS = 'sports',
  OUTDOOR = 'outdoor',
  AUTOMOTIVE = 'automotive',

  // Baby & Kids
  BABY = 'baby',
  TOYS = 'toys',
  KIDS = 'kids',

  // Special Categories
  PHARMACY = 'pharmacy',
  PET_SUPPLIES = 'pet_supplies',
  OFFICE_SUPPLIES = 'office_supplies',
  OTHER = 'other',
}

class DimensionsDto {
  @ApiProperty({ description: 'Length in cm' })
  @IsNumber()
  @Min(0)
  length: number;

  @ApiProperty({ description: 'Width in cm' })
  @IsNumber()
  @Min(0)
  width: number;

  @ApiProperty({ description: 'Height in cm' })
  @IsNumber()
  @Min(0)
  height: number;
}

export class CreateProductDto {
  @ApiProperty({ description: 'Store/Vendor ID this product belongs to' })
  @IsString()
  storeId: string;

  @ApiProperty({ description: 'Product name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Product brand' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ description: 'Product SKU' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ description: 'Product price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Compare at price (original price)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  compareAtPrice?: number;

  @ApiProperty({ description: 'Product category', enum: ProductCategory })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty({ description: 'Product subcategory' })
  @IsString()
  @IsOptional()
  subcategory?: string;

  @ApiProperty({ description: 'Product image URLs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ description: 'Product stock quantity' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ description: 'Low stock threshold' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  lowStockThreshold?: number;

  @ApiProperty({
    description: 'Product weight in grams (for delivery optimization)',
  })
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiProperty({
    description: 'Product dimensions',
    type: DimensionsDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions?: DimensionsDto;

  @ApiProperty({ description: 'Is product available' })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ description: 'Is product featured' })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({
    description: 'Product variants (size, color, etc.)',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  variants?: string[];

  @ApiProperty({ description: 'Product tags for search', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Delivery eligibility for drones' })
  @IsBoolean()
  @IsOptional()
  droneEligible?: boolean;

  @ApiProperty({
    description: 'Maximum delivery distance for this product (km)',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxDeliveryDistance?: number;

  @ApiProperty({ description: 'Special handling instructions for delivery' })
  @IsString()
  @IsOptional()
  specialHandling?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductQueryDto {
  @ApiProperty({ description: 'Page number', required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiProperty({ description: 'Items per page', required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ description: 'Product category', required: false })
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @ApiProperty({ description: 'Search term', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Sort by field', required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ description: 'Sort order', required: false })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
