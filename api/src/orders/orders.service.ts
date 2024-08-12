import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/orders.schema';
import { Model } from 'mongoose';
import { RidersService } from 'src/riders/riders.service';
import { RiderStatusEnum } from 'src/riders/schemas/riders.schema';
import config from 'src/config';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly ridersService: RidersService,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    return this.orderModel.create(createOrderDto);
  }

  async assignOrderToRider(orderId: string, riderId: string) {
    try {
      const rider = await this.ridersService.findRider(riderId);
      const order = await this.findOne(orderId);

      if (!rider) {
        throw new BadRequestException('Rider does not exist');
      }

      if (!order) {
        throw new BadRequestException('Order does not exist');
      }

      if (rider.riderStatus !== RiderStatusEnum.Available) {
        throw new BadRequestException('Rider is not available');
      }

      if (order?.data?.rider) {
        throw new BadRequestException(
          'A rider has been assigned to this order already ',
        );
      }

      const { riderStatus, ...riderPayload } = rider.toJSON();
      const resp = await fetch(
        `${config.KAWA_SDK_BASE_URL}/orders/assign-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.KAWA_INTEGRATION_KEY}`,
          },
          body: JSON.stringify({
            orderId,
            ...riderPayload,
          }),
        },
      );

      const respJson = await resp.json();
      if (resp.status === 200) {
        await order.updateOne({
          data: { ...order.data, rider: riderPayload },
        });
        await rider.updateOne({ riderStatus: RiderStatusEnum.UnAvailable });
      }

      return {
        response: respJson,
      };
    } catch (error) {
      console.log('Error assigning order to rider', error);
      return error;
    }
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
