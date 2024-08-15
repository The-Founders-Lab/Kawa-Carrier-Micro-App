import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhookModule } from './webhook/webhook.module';
import config from './config';
import { RidersModule } from './riders/riders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Order } from './orders/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'microapp',
      autoLoadEntities: true,
      synchronize: true, // should not be used in production. It could result to loss of data
    }),
    MongooseModule.forRoot(config.MONGO_URI),
    OrdersModule,
    WebhookModule,
    RidersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
