import { Controller } from '@nestjs/common';
import { DronesService } from './drones.service';

@Controller('drones')
export class DronesController {
  constructor(private readonly dronesService: DronesService) {}
}
