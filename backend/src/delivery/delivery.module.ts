import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { DeliveryIntelligenceService } from './services/delivery-intelligence.service';
import { RouteOptimizationService } from './services/route-optimization.service';
import { DeliveryCostCalculationService } from './services/delivery-cost-calculation.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { FleetModule } from '../fleet/fleet.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SupabaseModule, FleetModule, ConfigModule],
  controllers: [DeliveryController],
  providers: [
    DeliveryService,
    DeliveryIntelligenceService,
    RouteOptimizationService,
    DeliveryCostCalculationService,
  ],
  exports: [
    DeliveryService,
    DeliveryIntelligenceService,
    RouteOptimizationService,
    DeliveryCostCalculationService,
  ],
})
export class DeliveryModule {}
