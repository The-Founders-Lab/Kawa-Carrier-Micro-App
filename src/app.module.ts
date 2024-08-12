import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhookModule } from './webhook/webhook.module';
import config from './config';

@Module({
  imports: [
    MongooseModule.forRoot(config.MONGO_URI),
    OrdersModule,
    WebhookModule,
  
    MongooseModule.forRoot(config.MONGO_URI),
    OrdersModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
