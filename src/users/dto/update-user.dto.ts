import {
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'First name cannot be empty' })
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Last name cannot be empty' })
  lastName?: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiProperty({
    description: 'Phone number of the user',
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
    description: 'Address of the user',
    example: '123 Main St',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'City of the user',
    example: 'New York',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'State of the user',
    example: 'NY',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'ZIP code of the user',
    example: '10001',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{5}(-\d{4})?$/, {
    message: 'Please provide a valid ZIP code',
  })
  zipCode?: string;
}

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'currentPassword123!',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  currentPassword: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'newPassword123!',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newPassword: string;
}
