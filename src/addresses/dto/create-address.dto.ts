import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateNested,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CoordinatesDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    example: 40.7128,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: -74.006,
  })
  @IsNumber()
  longitude: number;
}

export class CreateAddressDto {
  @ApiProperty({
    description: 'Address label (e.g., Home, Work)',
    example: 'Home',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  label?: string;

  @ApiProperty({
    description: 'Street address',
    example: '123 Main Street, Apt 4B',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  street: string;

  @ApiProperty({
    description: 'City',
    example: 'New York',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  city: string;

  @ApiProperty({
    description: 'State or province',
    example: 'NY',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  state: string;

  @ApiProperty({
    description: 'ZIP or postal code',
    example: '10001',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  zipCode: string;

  @ApiProperty({
    description: 'Country',
    example: 'USA',
    default: 'USA',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string = 'USA';

  @ApiProperty({
    description: 'Set as default address',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false;

  @ApiProperty({
    description: 'Address coordinates (optional)',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;
}

export class UpdateAddressDto {
  @ApiProperty({
    description: 'Address label (e.g., Home, Work)',
    example: 'Work',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  label?: string;

  @ApiProperty({
    description: 'Street address',
    example: '456 Business Ave, Suite 200',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  street?: string;

  @ApiProperty({
    description: 'City',
    example: 'Brooklyn',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  city?: string;

  @ApiProperty({
    description: 'State or province',
    example: 'NY',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  state?: string;

  @ApiProperty({
    description: 'ZIP or postal code',
    example: '11201',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  zipCode?: string;

  @ApiProperty({
    description: 'Country',
    example: 'USA',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiProperty({
    description: 'Address coordinates (optional)',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;
}
