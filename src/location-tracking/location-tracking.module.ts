import { Module } from '@nestjs/common';
import { LocationTrackingService } from './location-tracking.service';
import { LocationTrackingGateway } from './location-tracking.gateway';

@Module({
  providers: [LocationTrackingService, LocationTrackingGateway],
})
export class LocationTrackingModule {}
