import { Req, Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { WebhookService } from './webhook.service';
import { OrderStatusEnum } from 'src/orders/order.enum';
import type { Request } from 'express';

@Controller('carrier-webhook')
export class WebhookController {
  constructor(
    private ordersService: OrdersService,
    private webhookService: WebhookService,
  ) {}

  @Post('/send')
  async receiveOrder(
    @Body() body: Record<string, any>,
    @Req() req: Request & { headers: Record<string, any> },
  ) {
    console.log('RECEIVED', Object.keys(body));
    this.webhookService.verifyDataIsFromKawa(
      req.headers['x-kawa-signature'],
      body,
    );
    const isSdkDemo = body.data?.isSdkDemo ?? false;
    const order = await this.ordersService.create({
      data: {
        ...body.data,
        orderStatus: OrderStatusEnum.processing,
        isSdkDemo,
      },
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
}
