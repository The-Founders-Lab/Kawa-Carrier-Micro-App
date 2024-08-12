import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
} from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './schemas/orders.schema';
import { OrdersService } from './orders.service';
import config from 'src/config';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Patch('/update/:orderId')
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() update: UpdateOrderDto,
  ) {
    if (!Object.values(OrderStatus).includes(update.orderStatus)) {
      throw new BadRequestException('Invalid status update');
    }

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
      if (respJson.statusCode === 200) {
        await this.ordersService.update(order.id, {
          data: {
            ...order.data,
            orderStatus: update.orderStatus,
          },
        });
      }

      console.log('req', {
        ...update,
        orderId,
      });
      console.log('resp', respJson);
      console.log();

      return { message: respJson?.message || 'updated', data: respJson };
    } catch (error) {
      console.log('Error updating order', error);
      return error;
    }
  }
}
