import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { SupabaseModule } from '../../supabase/supabase.module';
import { StoresModule } from '../stores.module';

@Module({
  imports: [SupabaseModule, StoresModule],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
