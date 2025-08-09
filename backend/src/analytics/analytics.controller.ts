import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsQueryDto } from './dto/analytics.dto';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get overall platform analytics' })
  @ApiResponse({
    status: 200,
    description: 'Returns overall analytics data',
  })
  async getOverallAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getOverallAnalytics(query);
  }

  @Get('restaurants/:id')
  @ApiOperation({ summary: 'Get restaurant-specific analytics' })
  @ApiResponse({
    status: 200,
    description: 'Returns restaurant analytics data',
  })
  @ApiParam({ name: 'id', description: 'Restaurant ID' })
  async getRestaurantAnalytics(
    @Param('id') id: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getRestaurantAnalytics(id, query);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user-specific analytics' })
  @ApiResponse({
    status: 200,
    description: 'Returns user analytics data',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async getUserAnalytics(
    @Param('id') id: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getUserAnalytics(id, query);
  }

  @Get('delivery')
  @ApiOperation({ summary: 'Get delivery analytics' })
  @ApiResponse({
    status: 200,
    description: 'Returns delivery analytics data',
  })
  async getDeliveryAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getDeliveryAnalytics(query);
  }
}
