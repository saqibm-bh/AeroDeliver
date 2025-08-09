import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto, PaymentMethodDto } from './dto/payment.dto';
import { User } from '../common/decorators/user.decorator';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Process payment for an order' })
  @ApiResponse({
    status: 201,
    description: 'Payment processed successfully',
  })
  @ApiBody({ type: CreatePaymentDto })
  async processPayment(
    @User('id') userId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.processPayment(userId, createPaymentDto);
  }

  @Get('orders/:orderId')
  @ApiOperation({ summary: 'Get payments for a specific order' })
  @ApiResponse({
    status: 200,
    description: 'Returns payments for the specified order',
  })
  async getPaymentsByOrderId(
    @User('id') userId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.paymentService.getPaymentsByOrderId(orderId, userId);
  }

  @Get('methods')
  @ApiOperation({ summary: 'Get user payment methods' })
  @ApiResponse({
    status: 200,
    description: 'Returns saved payment methods',
  })
  async getUserPaymentMethods(@User('id') userId: string) {
    return this.paymentService.getUserPaymentMethods(userId);
  }

  @Post('methods')
  @ApiOperation({ summary: 'Add a new payment method' })
  @ApiResponse({
    status: 201,
    description: 'Payment method added successfully',
  })
  @ApiBody({ type: PaymentMethodDto })
  async addPaymentMethod(
    @User('id') userId: string,
    @Body() paymentMethodDto: PaymentMethodDto,
  ) {
    return this.paymentService.addPaymentMethod(userId, paymentMethodDto);
  }

  @Delete('methods/:id')
  @ApiOperation({ summary: 'Delete a payment method' })
  @ApiResponse({
    status: 200,
    description: 'Payment method deleted successfully',
  })
  async deletePaymentMethod(
    @User('id') userId: string,
    @Param('id') paymentMethodId: string,
  ) {
    return this.paymentService.deletePaymentMethod(userId, paymentMethodId);
  }
}
