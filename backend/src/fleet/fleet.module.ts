import { Module } from '@nestjs/common';
import { FleetController } from './fleet.controller';
import { FleetService } from './fleet.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { RidersModule } from '../riders/riders.module';
import { DronesModule } from '../drones/drones.module';

@Module({
  imports: [SupabaseModule, RidersModule, DronesModule],
  controllers: [FleetController],
  providers: [FleetService],
  exports: [FleetService],
})
export class FleetModule {}
