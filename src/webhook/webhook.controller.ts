import {
  Req,
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { OrderStatus } from 'src/orders/schemas/orders.schema';
import { WebhookService } from './webhook.service';
import config from 'src/config';
import { UpdateOrderDto } from 'src/orders/dto/update-order.dto';

@Controller('carrier-webhook')
export class WebhookController {
  constructor(
    private ordersService: OrdersService,
    private webhookService: WebhookService,
  ) {}

  @Post('/send')
  async receiveOrder(@Body() body, @Req() req) {
    console.log('RECEIVED', body);
    this.webhookService.verifyDataIsFromKawa(
      req.headers['x-kawa-signature'],
      body,
    );
    console.log(body.id);
    const order = await this.ordersService.create({
      data: body.data,
      orderId: body.data.id,
    });
    console.log({
      message: 'Data saved',
      status: body.data.orderStatus,
      data: order.data,
    });
    return {
      message: 'Data saved',
      status: body.orderStatus,
    };
  }

  @Post('/update/:orderId')
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() update: UpdateOrderDto,
  ) {
    if (!Object.values(OrderStatus).includes(update.orderStatus)) {
      throw new BadRequestException('Invalid status update');
    }

    const order = await this.ordersService.findByOrderId(orderId);
    if (order == null) {
      throw new BadRequestException('Order not found');
    }

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
      await this.ordersService.updateByOrderId(order.id, {
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
  }
}
