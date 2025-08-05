import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import {
  Address,
  CreateAddressResponse,
  UpdateAddressResponse,
  DeleteAddressResponse,
} from './entities';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/request.interface';

@ApiTags('addresses')
@ApiBearerAuth()
@Controller('addresses')
@UseGuards(AuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({
    status: 201,
    description: 'Address created successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createAddress(
    @Request() req: AuthenticatedRequest,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<CreateAddressResponse> {
    return this.addressesService.createAddress(req.user.id, createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user addresses' })
  @ApiResponse({
    status: 200,
    description: 'Addresses retrieved successfully',
    type: [Object],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserAddresses(
    @Request() req: AuthenticatedRequest,
  ): Promise<Address[]> {
    return this.addressesService.getUserAddresses(req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an address' })
  @ApiParam({
    name: 'id',
    description: 'Address ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Address updated successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async updateAddress(
    @Request() req: AuthenticatedRequest,
    @Param('id') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<UpdateAddressResponse> {
    return this.addressesService.updateAddress(
      req.user.id,
      addressId,
      updateAddressDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address' })
  @ApiParam({
    name: 'id',
    description: 'Address ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Address deleted successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async deleteAddress(
    @Request() req: AuthenticatedRequest,
    @Param('id') addressId: string,
  ): Promise<DeleteAddressResponse> {
    return this.addressesService.deleteAddress(req.user.id, addressId);
  }

  @Put(':id/default')
  @ApiOperation({ summary: 'Set address as default' })
  @ApiParam({
    name: 'id',
    description: 'Address ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Default address set successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async setDefaultAddress(
    @Request() req: AuthenticatedRequest,
    @Param('id') addressId: string,
  ): Promise<UpdateAddressResponse> {
    return this.addressesService.setDefaultAddress(req.user.id, addressId);
  }
}
