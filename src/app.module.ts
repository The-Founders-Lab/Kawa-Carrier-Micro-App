import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhookModule } from './webhook/webhook.module';
import config from './config';

@Module({
  imports: [MongooseModule.forRoot(config.MONGO_URI), BookingModule, WebhookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
