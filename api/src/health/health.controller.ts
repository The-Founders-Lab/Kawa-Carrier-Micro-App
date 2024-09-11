import { Controller, Get, Req } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Request } from 'express';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(@Req() req: Request) {
    const url = `${req.protocol}://${req.get('host')}`;
    return this.health.check([
      () => this.http.pingCheck('api', url),
      () => this.db.pingCheck('database'),
    ]);
  }
}
