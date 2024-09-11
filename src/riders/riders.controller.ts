import { Controller, Get, Post } from '@nestjs/common';
import { RidersService } from './riders.service';

@Controller('riders')
export class RidersController {
  constructor(private readonly ridersService: RidersService) {}

  @Get()
  async getRiders() {
    return await this.ridersService.getRiders();
  }

  @Post()
  async createRider() {
    return await this.ridersService.createRider();
  }
}
