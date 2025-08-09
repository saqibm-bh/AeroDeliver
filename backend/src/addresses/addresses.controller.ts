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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@ApiTags('Addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all addresses for current user' })
  @ApiResponse({
    status: 200,
    description: 'Addresses retrieved successfully',
  })
  async getUserAddresses(@Request() req: { user: { id: string } }) {
    return this.addressesService.getUserAddresses(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new address' })
  @ApiResponse({
    status: 201,
    description: 'Address created successfully',
  })
  @ApiBody({ type: CreateAddressDto })
  async createAddress(
    @Request() req: { user: { id: string } },
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressesService.createAddress(req.user.id, createAddressDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by ID' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({
    status: 200,
    description: 'Address retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async getAddressById(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.addressesService.getAddressById(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update address' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({
    status: 200,
    description: 'Address updated successfully',
  })
  @ApiBody({ type: UpdateAddressDto })
  async updateAddress(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.updateAddress(
      id,
      req.user.id,
      updateAddressDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete address' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({
    status: 204,
    description: 'Address deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async deleteAddress(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.addressesService.deleteAddress(id, req.user.id);
  }

  @Put(':id/default')
  @ApiOperation({ summary: 'Set address as default' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({
    status: 200,
    description: 'Default address updated successfully',
  })
  async setDefaultAddress(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.addressesService.setDefaultAddress(id, req.user.id);
  }
}
