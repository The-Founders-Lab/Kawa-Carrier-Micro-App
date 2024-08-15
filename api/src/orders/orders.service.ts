import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatusEnum } from './schemas/orders.schema';
import { Order as OrderEntity } from './order.entity';
import { Model } from 'mongoose';
import { RidersService } from 'src/riders/riders.service';
import config from 'src/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly ridersService: RidersService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const orderExists = await this.ordersRepository.existsBy({
      orderId: createOrderDto.orderId,
    });
    if (orderExists) {
      throw new BadRequestException('Order with ID already exists');
    }

    const newOrder = this.ordersRepository.create(createOrderDto);
    return await this.ordersRepository.save(newOrder);
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

      if (rider.available !== true) {
        throw new BadRequestException('Rider is not available');
      }

      if (order?.data?.rider) {
        throw new BadRequestException(
          'A rider has been assigned to this order already ',
        );
      }

      const { available, ...riderPayload } = rider;
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
        await this.ordersRepository.update(
          { orderId: order.orderId },
          { data: { ...order.data, rider: riderPayload } },
        );
        await this.ridersService.updateRiderStatus(rider._id, false);
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
    return this.ordersRepository.find();
  }

  findOne(orderId: string) {
    return this.ordersRepository.findOneBy({ orderId });
  }

  async updateStatus(update: UpdateOrderDto) {
    if (!Object.values(OrderStatusEnum).includes(update.orderStatus)) {
      throw new BadRequestException('Invalid status update');
    }

    const { orderId } = update;
    const order = await this.findOne(orderId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    try {
      const resp = await fetch(
        `${config.KAWA_SDK_BASE_URL}/orders/update-order-status`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.KAWA_INTEGRATION_KEY}`,
          },
          method: 'POST',
          body: JSON.stringify({
            ...update,
            orderId,
          }),
        },
      );
      const respJson = await resp.json();
      console.log('req', {
        ...update,
        orderId,
      });
      console.log('resp', respJson);
      console.log();

      if (respJson.statusCode === 200) {
        await this.ordersRepository.update(
          { orderId: order.orderId },
          {
            data: {
              ...order.data,
              orderStatus: update.orderStatus,
            },
          },
        );
      }

      if (
        respJson.statusCode === 200 &&
        update.orderStatus === OrderStatusEnum.delivered
      ) {
        await this.ridersService.updateRiderStatus(
          (order.data as any)?.rider?._id,
          true,
        );
      }

      return { message: respJson?.message || 'updated', data: respJson };
    } catch (error) {
      console.log('Error updating order', error);
      return error;
    }
  }

  update(orderId: string, update: Partial<UpdateOrderDto>) {
    return this.ordersRepository.update({ orderId }, update);
  }

  async remove(orderId: string) {
    return this.ordersRepository.delete({ orderId });
  }
}
