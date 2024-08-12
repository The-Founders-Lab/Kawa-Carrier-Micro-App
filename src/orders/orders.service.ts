import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/orders.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  create(createOrderDto: CreateOrderDto) {
    return this.orderModel.create(createOrderDto);
  }

  findAll() {
    return this.orderModel.find();
  }

  findOne(orderId: string) {
    return this.orderModel.findOne({ orderId });
  }

  update(orderId: string, update: Partial<UpdateOrderDto>) {
    return this.orderModel.findByIdAndUpdate(orderId, update, {
      new: true,
    });
  }

  remove(orderId: string) {
    return this.orderModel.findByIdAndDelete(orderId);
  }
}
