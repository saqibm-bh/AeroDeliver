import { Module } from '@nestjs/common';
import { DronesService } from './drones.service';
import { DronesController } from './drones.controller';

@Module({
  controllers: [DronesController],
  providers: [DronesService],
})
export class DronesModule {}
