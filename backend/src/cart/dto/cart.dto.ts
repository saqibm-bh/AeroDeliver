import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity of products', minimum: 1 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  quantity: number = 1;

  @ApiProperty({ description: 'Variant ID (if applicable)', required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  variantId?: string;

  @ApiProperty({
    description: 'Special notes or instructions',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCartItemDto {
  @ApiProperty({ description: 'Quantity of products', minimum: 0 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  quantity: number;

  @ApiProperty({
    description: 'Special notes or instructions',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
