import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [BookingModule],
  providers: [WebhookService],
  controllers: [WebhookController],
})
export class WebhookModule {}
