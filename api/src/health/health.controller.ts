import { Controller, Get, Req } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { Request } from 'express';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(@Req() req: Request) {
    const url = `${req.protocol}://${req.get('host')}`;
    console.log(url);
    return this.health.check([() => this.http.pingCheck('api', url)]);
  }
}
