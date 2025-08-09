import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { FleetService } from './fleet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  CreateRiderDto,
  UpdateRiderDto,
} from './dto/fleet.dto';

@ApiTags('Fleet Management')
@Controller('fleet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  // Vehicle endpoints
  @Post('vehicles')
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({ status: 201, description: 'Vehicle created successfully' })
  @ApiBody({ type: CreateVehicleDto })
  async createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.fleetService.createVehicle(createVehicleDto);
  }

  @Get('vehicles')
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({ status: 200, description: 'Returns all vehicles' })
  async getAllVehicles() {
    return this.fleetService.getAllVehicles();
  }

  @Get('vehicles/available')
  @ApiOperation({ summary: 'Get available vehicles' })
  @ApiResponse({ status: 200, description: 'Returns available vehicles' })
  async getAvailableVehicles() {
    return this.fleetService.getAvailableVehicles();
  }

  @Get('vehicles/:id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  @ApiResponse({ status: 200, description: 'Returns vehicle details' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  async getVehicleById(@Param('id') id: string) {
    return this.fleetService.getVehicleById(id);
  }

  @Put('vehicles/:id')
  @ApiOperation({ summary: 'Update vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiBody({ type: UpdateVehicleDto })
  async updateVehicle(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.fleetService.updateVehicle(id, updateVehicleDto);
  }

  @Delete('vehicles/:id')
  @ApiOperation({ summary: 'Delete vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle deleted successfully' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  async deleteVehicle(@Param('id') id: string) {
    return this.fleetService.deleteVehicle(id);
  }

  // Rider endpoints
  @Post('riders')
  @ApiOperation({ summary: 'Create a new rider' })
  @ApiResponse({ status: 201, description: 'Rider created successfully' })
  @ApiBody({ type: CreateRiderDto })
  async createRider(@Body() createRiderDto: CreateRiderDto) {
    return this.fleetService.createRider(createRiderDto);
  }

  @Get('riders')
  @ApiOperation({ summary: 'Get all riders' })
  @ApiResponse({ status: 200, description: 'Returns all riders' })
  async getAllRiders() {
    return this.fleetService.getAllRiders();
  }

  @Get('riders/available')
  @ApiOperation({ summary: 'Get available riders' })
  @ApiResponse({ status: 200, description: 'Returns available riders' })
  async getAvailableRiders() {
    return this.fleetService.getAvailableRiders();
  }

  @Get('riders/:id')
  @ApiOperation({ summary: 'Get rider by ID' })
  @ApiResponse({ status: 200, description: 'Returns rider details' })
  @ApiParam({ name: 'id', description: 'Rider ID' })
  async getRiderById(@Param('id') id: string) {
    return this.fleetService.getRiderById(id);
  }

  @Put('riders/:id')
  @ApiOperation({ summary: 'Update rider' })
  @ApiResponse({ status: 200, description: 'Rider updated successfully' })
  @ApiParam({ name: 'id', description: 'Rider ID' })
  @ApiBody({ type: UpdateRiderDto })
  async updateRider(
    @Param('id') id: string,
    @Body() updateRiderDto: UpdateRiderDto,
  ) {
    return this.fleetService.updateRider(id, updateRiderDto);
  }

  // Assignment endpoints
  @Patch('riders/:riderId/assign-vehicle/:vehicleId')
  @ApiOperation({ summary: 'Assign vehicle to rider' })
  @ApiResponse({ status: 200, description: 'Vehicle assigned successfully' })
  @ApiParam({ name: 'riderId', description: 'Rider ID' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle ID' })
  async assignVehicleToRider(
    @Param('riderId') riderId: string,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.fleetService.assignVehicleToRider(riderId, vehicleId);
  }

  @Patch('riders/:riderId/unassign-vehicle')
  @ApiOperation({ summary: 'Unassign vehicle from rider' })
  @ApiResponse({ status: 200, description: 'Vehicle unassigned successfully' })
  @ApiParam({ name: 'riderId', description: 'Rider ID' })
  async unassignVehicleFromRider(@Param('riderId') riderId: string) {
    return this.fleetService.unassignVehicleFromRider(riderId);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get fleet statistics' })
  @ApiResponse({ status: 200, description: 'Returns fleet statistics' })
  async getFleetStatistics() {
    return this.fleetService.getFleetStatistics();
  }
}
