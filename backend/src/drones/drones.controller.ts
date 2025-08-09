import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DronesService } from './drones.service';
import {
  CreateDroneDto,
  UpdateDroneDto,
  DroneQueryDto,
  MaintenanceRecordDto,
  DroneAssignmentDto,
  NoFlyZoneDto,
  WeatherRestrictionDto,
} from './dto/drone.dto';
import { Drone, DroneStatus } from './interfaces/drone.interface';

@ApiTags('drones')
@Controller('drones')
export class DronesController {
  constructor(private readonly dronesService: DronesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new drone' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The drone has been successfully created',
    type: Object,
  })
  async createDrone(@Body() createDroneDto: CreateDroneDto): Promise<Drone> {
    return this.dronesService.createDrone(createDroneDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all drones with filtering options' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all drones matching the query criteria',
    type: [Object],
  })
  async queryDrones(@Query() query: DroneQueryDto): Promise<Drone[]> {
    return this.dronesService.queryDrones(query);
  }

  @Get('available')
  @ApiOperation({ summary: 'Get all available drones' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all available drones',
    type: [Object],
  })
  async getAvailableDrones(): Promise<Drone[]> {
    return this.dronesService.getAvailableDrones();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a drone by ID' })
  @ApiParam({ name: 'id', description: 'Drone ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the drone with the specified ID',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Drone with this ID does not exist',
  })
  async getDroneById(@Param('id', ParseUUIDPipe) id: string): Promise<Drone> {
    return this.dronesService.getDroneById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a drone' })
  @ApiParam({ name: 'id', description: 'Drone ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The drone has been successfully updated',
    type: Object,
  })
  async updateDrone(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDroneDto: UpdateDroneDto,
  ): Promise<Drone> {
    return this.dronesService.updateDrone(id, updateDroneDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a drone' })
  @ApiParam({ name: 'id', description: 'Drone ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The drone has been successfully deleted',
  })
  async deleteDrone(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.dronesService.deleteDrone(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update drone status' })
  @ApiParam({ name: 'id', description: 'Drone ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The drone status has been successfully updated',
    type: Object,
  })
  async updateDroneStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: DroneStatus,
  ): Promise<Drone> {
    return this.dronesService.updateDroneStatus(id, status);
  }

  @Put(':id/location')
  @ApiOperation({ summary: 'Update drone location' })
  @ApiParam({ name: 'id', description: 'Drone ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The drone location has been successfully updated',
    type: Object,
  })
  async updateDroneLocation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('location') location: [number, number],
  ): Promise<Drone> {
    return this.dronesService.updateDroneLocation(id, location);
  }

  @Put(':id/battery')
  @ApiOperation({ summary: 'Update drone battery level' })
  @ApiParam({ name: 'id', description: 'Drone ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The drone battery level has been successfully updated',
    type: Object,
  })
  async updateDroneBattery(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('batteryLevel') batteryLevel: number,
  ): Promise<Drone> {
    return this.dronesService.updateDroneBattery(id, batteryLevel);
  }

  // Maintenance records endpoints
  @Post(':id/maintenance')
  @ApiOperation({ summary: 'Add a maintenance record for a drone' })
  @ApiParam({ name: 'id', description: 'Drone ID' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The maintenance record has been successfully created',
    type: Object,
  })
  async addMaintenanceRecord(
    @Param('id', ParseUUIDPipe) droneId: string,
    @Body() recordDto: MaintenanceRecordDto,
  ) {
    return this.dronesService.addMaintenanceRecord(droneId, recordDto);
  }

  @Get(':id/maintenance')
  @ApiOperation({ summary: 'Get maintenance history for a drone' })
  @ApiParam({ name: 'id', description: 'Drone ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the maintenance history for the specified drone',
    type: [Object],
  })
  async getMaintenanceHistory(@Param('id', ParseUUIDPipe) droneId: string) {
    return this.dronesService.getMaintenanceHistory(droneId);
  }

  // Drone assignments endpoints
  @Post('assign')
  @ApiOperation({ summary: 'Assign a drone to an order' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The drone has been successfully assigned to the order',
    type: Object,
  })
  async assignDroneToOrder(@Body() assignmentDto: DroneAssignmentDto) {
    return this.dronesService.assignDroneToOrder(assignmentDto);
  }

  @Get(':id/assignments')
  @ApiOperation({ summary: 'Get all assignments for a drone' })
  @ApiParam({ name: 'id', description: 'Drone ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all assignments for the specified drone',
    type: [Object],
  })
  async getDroneAssignments(@Param('id', ParseUUIDPipe) droneId: string) {
    return this.dronesService.getDroneAssignments(droneId);
  }

  @Get(':id/current-assignment')
  @ApiOperation({ summary: 'Get current assignment for a drone' })
  @ApiParam({ name: 'id', description: 'Drone ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Return the current assignment for the specified drone or null if none',
    type: Object,
  })
  async getCurrentAssignment(@Param('id', ParseUUIDPipe) droneId: string) {
    return this.dronesService.getCurrentAssignment(droneId);
  }

  @Put('assignments/:id/status')
  @ApiOperation({ summary: 'Update status of a drone assignment' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The assignment status has been successfully updated',
    type: Object,
  })
  async updateAssignmentStatus(
    @Param('id', ParseUUIDPipe) assignmentId: string,
    @Body('status')
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled',
    @Body('actualPickupTime') actualPickupTime?: Date,
    @Body('actualDeliveryTime') actualDeliveryTime?: Date,
  ) {
    return this.dronesService.updateAssignmentStatus(
      assignmentId,
      status,
      actualPickupTime,
      actualDeliveryTime,
    );
  }

  // No-fly zones endpoints
  @Post('no-fly-zones')
  @ApiOperation({ summary: 'Create a new no-fly zone' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The no-fly zone has been successfully created',
    type: Object,
  })
  async createNoFlyZone(@Body() zoneDto: NoFlyZoneDto) {
    return this.dronesService.createNoFlyZone(zoneDto);
  }

  @Get('no-fly-zones')
  @ApiOperation({ summary: 'Get all no-fly zones' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all no-fly zones',
    type: [Object],
  })
  async getNoFlyZones() {
    return this.dronesService.getNoFlyZones();
  }

  @Get('no-fly-zones/active')
  @ApiOperation({ summary: 'Get all active no-fly zones' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all active no-fly zones',
    type: [Object],
  })
  async getActiveNoFlyZones() {
    return this.dronesService.getActiveNoFlyZones();
  }

  // Weather restrictions endpoints
  @Put('weather-restrictions/:droneTypeId')
  @ApiOperation({ summary: 'Set weather restrictions for a drone type' })
  @ApiParam({ name: 'droneTypeId', description: 'Drone Type ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The weather restrictions have been successfully set',
    type: Object,
  })
  async setWeatherRestriction(
    @Param('droneTypeId') droneTypeId: string,
    @Body() restrictionDto: WeatherRestrictionDto,
  ) {
    return this.dronesService.setWeatherRestriction(
      droneTypeId,
      restrictionDto,
    );
  }

  @Get('weather-restrictions')
  @ApiOperation({ summary: 'Get all weather restrictions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all weather restrictions',
    type: [Object],
  })
  async getWeatherRestrictions() {
    return this.dronesService.getWeatherRestrictions();
  }
}
