import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  Min,
  ValidateNested,
  IsObject,
  Length,
  IsInt,
  IsUUID,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../interfaces/payment.interface';

export class BillingAddressDto {
  @ApiProperty({ description: 'Street address line 1' })
  @IsString()
  line1: string;

  @ApiProperty({ description: 'Street address line 2', required: false })
  @IsOptional()
  @IsString()
  line2?: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'State or province' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'Postal code' })
  @IsString()
  postalCode: string;

  @ApiProperty({ description: 'Country' })
  @IsString()
  country: string;
}

export class PaymentMethodDto {
  @ApiProperty({ description: 'Payment method type', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  type: PaymentMethod;

  @ApiProperty({ description: 'Last four digits of the card', required: false })
  @IsOptional()
  @IsString()
  @Length(4, 4)
  cardLastFour?: string;

  @ApiProperty({
    description: 'Card brand (Visa, Mastercard, etc.)',
    required: false,
  })
  @IsOptional()
  @IsString()
  cardBrand?: string;

  @ApiProperty({ description: 'Card expiry month', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  expiryMonth?: number;

  @ApiProperty({ description: 'Card expiry year', required: false })
  @IsOptional()
  @IsInt()
  @Min(2023)
  expiryYear?: number;

  @ApiProperty({
    description: 'Whether this is the default payment method',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ description: 'Billing address', required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BillingAddressDto)
  billingAddress?: BillingAddressDto;
}

export class CreatePaymentDto {
  @ApiProperty({ description: 'Order ID to pay for' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Payment amount' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Payment method details' })
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  paymentMethod: PaymentMethodDto;

  @ApiProperty({
    description: 'Currency code',
    default: 'USD',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @ApiProperty({ description: 'Payment description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

// Enhanced DTOs for new payment features

export class RefundRequestDto {
  @ApiProperty({ description: 'Payment ID to refund' })
  @IsString()
  @IsUUID()
  paymentId: string;

  @ApiPropertyOptional({ description: 'Refund amount (if partial)' })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @ApiProperty({ description: 'Reason for refund' })
  @IsString()
  @Length(5, 500)
  reason: string;

  @ApiProperty({ description: 'User requesting refund' })
  @IsString()
  @IsUUID()
  userId: string;
}

export class DisputeDto {
  @ApiProperty({ description: 'Payment ID in dispute' })
  @IsString()
  @IsUUID()
  paymentId: string;

  @ApiProperty({ description: 'Dispute reason' })
  @IsString()
  @Length(10, 1000)
  reason: string;

  @ApiProperty({ description: 'Detailed description' })
  @IsString()
  @Length(20, 2000)
  description: string;

  @ApiProperty({ description: 'User creating dispute' })
  @IsString()
  @IsUUID()
  userId: string;
}

export class PaymentIntentDto {
  @ApiProperty({ description: 'Amount in dollars' })
  @IsNumber()
  @Min(0.5)
  @Max(10000)
  amount: number;

  @ApiProperty({ description: 'Currency code', default: 'USD' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @ApiPropertyOptional({ description: 'Order ID if applicable' })
  @IsOptional()
  @IsString()
  @IsUUID()
  orderId?: string;

  @ApiProperty({ description: 'Customer ID' })
  @IsString()
  @IsUUID()
  customerId: string;

  @ApiPropertyOptional({ description: 'Automatic payment confirmation' })
  @IsOptional()
  @IsBoolean()
  confirmPayment?: boolean;
}

export class SavePaymentMethodDto {
  @ApiProperty({ description: 'Stripe payment method ID' })
  @IsString()
  paymentMethodId: string;

  @ApiProperty({ description: 'Customer ID' })
  @IsString()
  @IsUUID()
  customerId: string;

  @ApiPropertyOptional({ description: 'Set as default payment method' })
  @IsOptional()
  @IsBoolean()
  setAsDefault?: boolean;
}
