import { Module } from '@nestjs/common';
import { LocationTrackingGateway } from './location-tracking.gateway';
import { LocationTrackingService } from './location-tracking.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [LocationTrackingGateway, LocationTrackingService],
  exports: [LocationTrackingService],
})
export class LocationTrackingModule {}
