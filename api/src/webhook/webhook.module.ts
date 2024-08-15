import { Module, forwardRef } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [forwardRef(() => OrdersModule)],
  providers: [WebhookService],
  controllers: [WebhookController],
  exports: [WebhookService],
})
export class WebhookModule {}
