import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { StoresService } from './stores.service';
import {
  CreateStoreDto,
  UpdateStoreDto,
  StoreQueryDto,
  StoreStatsDto,
} from './dto/store.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({
    status: 201,
    description: 'Store created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async createStore(
    @Request() req: any,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    return this.storesService.createStore(req.user.id, createStoreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get stores with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Stores retrieved successfully',
  })
  async getStores(@Query() query: StoreQueryDto) {
    return this.storesService.getStores(query);
  }

  @Get('my-stores')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user stores' })
  @ApiResponse({
    status: 200,
    description: 'User stores retrieved successfully',
  })
  async getMyStores(@Request() req: any) {
    return this.storesService.getStoresByOwner(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({
    status: 200,
    description: 'Store retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Store not found',
  })
  async getStoreById(@Param('id') id: string) {
    return this.storesService.getStoreById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update store' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({
    status: 200,
    description: 'Store updated successfully',
  })
  async updateStore(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storesService.updateStore(id, req.user.id, updateStoreDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete store' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({
    status: 204,
    description: 'Store deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStore(@Param('id') id: string, @Request() req: any) {
    return this.storesService.deleteStore(id, req.user.id);
  }

  // Analytics endpoints
  @Get(':id/analytics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get store analytics' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({
    status: 200,
    description: 'Analytics retrieved successfully',
  })
  async getStoreAnalytics(
    @Param('id') id: string,
    @Request() req: any,
    @Query() statsDto: StoreStatsDto,
  ) {
    return this.storesService.getStoreAnalytics(id, req.user.id, statsDto);
  }
}
