import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [SupabaseModule, InventoryModule],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
