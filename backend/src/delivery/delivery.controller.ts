import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateDeliveryDto,
  UpdateDeliveryDto,
  DeliveryQueryDto,
} from './dto/delivery.dto';
import { DeliveryStatus } from './interfaces/delivery.interface';

@ApiTags('Delivery')
@Controller('delivery')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  @ApiOperation({ summary: 'Create new delivery' })
  @ApiResponse({
    status: 201,
    description: 'Delivery created successfully',
  })
  @ApiBody({ type: CreateDeliveryDto })
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.createDelivery(createDeliveryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get deliveries' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: DeliveryStatus })
  @ApiResponse({
    status: 200,
    description: 'Deliveries retrieved successfully',
  })
  async getDeliveries(@Query() query: DeliveryQueryDto) {
    return this.deliveryService.getDeliveries(query);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active deliveries' })
  @ApiResponse({
    status: 200,
    description: 'Active deliveries retrieved successfully',
  })
  async getActiveDeliveries() {
    return this.deliveryService.getActiveDeliveries();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get delivery by ID' })
  @ApiParam({ name: 'id', description: 'Delivery ID' })
  @ApiResponse({
    status: 200,
    description: 'Delivery retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  async getDeliveryById(@Param('id') id: string) {
    return this.deliveryService.getDeliveryById(id);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get delivery by order ID' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Delivery retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  async getDeliveryByOrderId(@Param('orderId') orderId: string) {
    return this.deliveryService.getDeliveryByOrderId(orderId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update delivery' })
  @ApiParam({ name: 'id', description: 'Delivery ID' })
  @ApiResponse({
    status: 200,
    description: 'Delivery updated successfully',
  })
  @ApiBody({ type: UpdateDeliveryDto })
  async updateDelivery(
    @Param('id') id: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
  ) {
    return this.deliveryService.updateDelivery(id, updateDeliveryDto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update delivery status' })
  @ApiParam({ name: 'id', description: 'Delivery ID' })
  @ApiResponse({
    status: 200,
    description: 'Delivery status updated successfully',
  })
  async updateDeliveryStatus(
    @Param('id') id: string,
    @Body()
    body: {
      status: DeliveryStatus;
      location?: { latitude: number; longitude: number };
    },
  ) {
    return this.deliveryService.updateDeliveryStatus(
      id,
      body.status,
      body.location,
    );
  }
}
