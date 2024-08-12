import { Req, Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { WebhookService } from './webhook.service';

@Controller('carrier-webhook')
export class WebhookController {
  constructor(
    private ordersService: OrdersService,
    private webhookService: WebhookService,
  ) {}

  @Post('/send')
  async receiveOrder(@Body() body, @Req() req) {
    console.log('RECEIVED', Object.keys(body));
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
}
