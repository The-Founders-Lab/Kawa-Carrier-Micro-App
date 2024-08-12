import { Controller, Get } from '@nestjs/common';
import { RidersService } from './riders.service';

@Controller('riders')
export class RidersController {
  constructor(private readonly ridersService: RidersService) {}

  @Get()
  async getRiders() {
    return await this.ridersService.getRiders();
  }
}
