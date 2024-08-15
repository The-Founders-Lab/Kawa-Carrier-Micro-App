import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/orders.schema';
import { Order as OrderEntity } from './order.entity';
import { OrdersController } from './orders.controller';
import { RidersModule } from 'src/riders/riders.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    RidersModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
