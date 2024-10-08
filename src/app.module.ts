import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { WebhookModule } from './webhook/webhook.module';
import { RidersModule } from './riders/riders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import config from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.DB_HOST,
      port: parseInt(config.DB_PORT) || 5432,
      username: config.DB_USERNAME,
      password: config.DB_PASSWORD,
      database: config.DB_DATABASE_NAME,
      autoLoadEntities: true,
      ssl: config.DB_SSL_ENABLED,
    }),
    OrdersModule,
    WebhookModule,
    RidersModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
