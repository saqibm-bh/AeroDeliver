import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  fullName: string;

  @ApiProperty({
    description: 'Phone number (optional)',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Please provide a valid phone number',
  })
  phone?: string;

  @ApiProperty({
    description: 'User type',
    enum: ['customer', 'restaurant', 'rider', 'drone_operator', 'admin'],
    example: 'customer',
    default: 'customer',
  })
  @IsEnum(['customer', 'restaurant', 'rider', 'drone_operator', 'admin'])
  userType: 'customer' | 'restaurant' | 'rider' | 'drone_operator' | 'admin' =
    'customer';

  @ApiProperty({
    description: 'User address (optional)',
    example: '123 Main St, City, State 12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'User coordinates (optional)',
    example: { lat: 40.7128, lng: -74.006 },
    required: false,
  })
  @IsOptional()
  coordinates?: { lat: number; lng: number };
}
