import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrdersController } from './orders.controller';
import { RidersModule } from 'src/riders/riders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookModule } from 'src/webhook/webhook.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    RidersModule,
    forwardRef(() => WebhookModule),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
