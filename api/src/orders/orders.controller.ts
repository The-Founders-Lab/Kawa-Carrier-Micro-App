import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatusEnum } from './schemas/orders.schema';
import { OrdersService } from './orders.service';
import config from 'src/config';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrders() {
    return await this.ordersService.findAll();
  }

  @Patch('/update-status')
  async updateOrderStatus(@Body() update: UpdateOrderDto) {
    if (!Object.values(OrderStatusEnum).includes(update.orderStatus)) {
      throw new BadRequestException('Invalid status update');
    }

    const orderId = update?.orderId;
    const order = await this.ordersService.findOne(orderId);
    if (order == null) {
      throw new BadRequestException('Order not found');
    }

    try {
      const resp = await fetch(
        `${config.KAWA_SDK_BASE_URL}/orders/update-order-status`,
        {
          body: JSON.stringify({
            ...update,
            orderId,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.KAWA_INTEGRATION_KEY}`,
          },
          method: 'POST',
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
        await this.ordersService.update(order.id, {
          data: {
            ...order.data,
            orderStatus: update.orderStatus,
          },
        });
      }

      if (
        respJson.statusCode === 200 &&
        update.orderStatus === OrderStatusEnum.delivered
      ) {
        // TODO: update rider status to available
      }

      return { message: respJson?.message || 'updated', data: respJson };
    } catch (error) {
      console.log('Error updating order', error);
      return error;
    }
  }

  @Patch('/assign-rider')
  async assignRiderToOrder(
    @Body('orderId') orderId: string,
    @Body('riderId') riderId: string,
  ) {
    return this.ordersService.assignOrderToRider(orderId, riderId);
  }
}
