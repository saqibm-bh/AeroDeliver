import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  full_name: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: ['customer', 'restaurant', 'rider', 'drone_operator'] })
  @IsEnum(['customer', 'restaurant', 'rider', 'drone_operator'])
  user_type: 'customer' | 'restaurant' | 'rider' | 'drone_operator';

  @ApiProperty({ example: '123 Main St, City, State', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123 Main St, City, State', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Pizza Palace' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Best pizza in town' })
  @IsString()
  description: string;

  @ApiProperty({ example: ['Italian', 'Pizza'] })
  @IsArray()
  @IsString({ each: true })
  cuisine_type: string[];

  @ApiProperty({ example: '123 Restaurant St, City, State' })
  @IsString()
  address: string;

  @ApiProperty({ example: { lat: 40.7128, lng: -74.006 } })
  coordinates: { lat: number; lng: number };

  @ApiProperty({ example: 10, description: 'Delivery fee in dollars' })
  @IsNumber()
  @Min(0)
  delivery_fee: number;

  @ApiProperty({ example: 20, description: 'Minimum order amount in dollars' })
  @IsNumber()
  @Min(0)
  minimum_order: number;
}

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Margherita Pizza' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Fresh mozzarella, tomato sauce, basil' })
  @IsString()
  description: string;

  @ApiProperty({ example: 15.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'Pizza' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'https://example.com/pizza.jpg', required: false })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({ example: 15, description: 'Preparation time in minutes' })
  @IsNumber()
  @Min(0)
  preparation_time: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'restaurant-uuid' })
  @IsString()
  restaurant_id: string;

  @ApiProperty({
    example: [
      {
        menu_item_id: 'item-uuid',
        quantity: 2,
        special_instructions: 'Extra cheese',
      },
    ],
  })
  @IsArray()
  items: Array<{
    menu_item_id: string;
    quantity: number;
    special_instructions?: string;
  }>;

  @ApiProperty({ example: '123 Delivery St, City, State' })
  @IsString()
  delivery_address: string;

  @ApiProperty({ example: { lat: 40.7128, lng: -74.006 } })
  delivery_coordinates: { lat: number; lng: number };

  @ApiProperty({ enum: ['drone', 'rider'], required: false })
  @IsOptional()
  @IsEnum(['drone', 'rider'])
  preferred_delivery_type?: 'drone' | 'rider';
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'picked_up',
      'in_transit',
      'delivered',
      'cancelled',
    ],
  })
  @IsEnum([
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'picked_up',
    'in_transit',
    'delivered',
    'cancelled',
  ])
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'picked_up'
    | 'in_transit'
    | 'delivered'
    | 'cancelled';
}

export class CreateVehicleDto {
  @ApiProperty({ enum: ['drone', 'bike', 'scooter'] })
  @IsEnum(['drone', 'bike', 'scooter'])
  type: 'drone' | 'bike' | 'scooter';

  @ApiProperty({ example: 'DJI Mavic Pro' })
  @IsString()
  model: string;

  @ApiProperty({ example: 'ABC123', required: false })
  @IsOptional()
  @IsString()
  license_plate?: string;

  @ApiProperty({ example: 5, description: 'Maximum weight capacity in kg' })
  @IsNumber()
  @Min(0)
  max_weight_capacity: number;

  @ApiProperty({ example: 10, description: 'Maximum distance range in km' })
  @IsNumber()
  @Min(0)
  max_distance_range: number;
}

export class UpdateDeliveryStatusDto {
  @ApiProperty({
    enum: [
      'assigned',
      'en_route_pickup',
      'at_restaurant',
      'picked_up',
      'en_route_delivery',
      'delivered',
    ],
  })
  @IsEnum([
    'assigned',
    'en_route_pickup',
    'at_restaurant',
    'picked_up',
    'en_route_delivery',
    'delivered',
  ])
  status:
    | 'assigned'
    | 'en_route_pickup'
    | 'at_restaurant'
    | 'picked_up'
    | 'en_route_delivery'
    | 'delivered';

  @ApiProperty({ example: { lat: 40.7128, lng: -74.006 }, required: false })
  @IsOptional()
  current_location?: { lat: number; lng: number };
}

export class LocationUpdateDto {
  @ApiProperty({ example: 40.7128 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ example: -74.006 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}

export class RestaurantFiltersDto {
  @ApiProperty({ example: 'Italian', required: false })
  @IsOptional()
  @IsString()
  cuisine_type?: string;

  @ApiProperty({ example: 40.7128, required: false })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({ example: -74.006, required: false })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiProperty({
    example: 5,
    description: 'Search radius in km',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  radius?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
